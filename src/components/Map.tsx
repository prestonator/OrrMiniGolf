import { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getMapState, claimPlot } from '../utils/api';
import { supabase } from '../utils/supabase';
import { useKioskStore } from '../store/useKioskStore';

const cityTargets: Record<string, number> = { Norman: 1150, OKC: 650, Guthrie: 250, Stillwater: 35, Kingfisher: 205, "El Reno": 645 };
const cities = ["Kingfisher", "Guthrie", "Stillwater", "OKC", "Norman", "El Reno"];

const PlotSquare = memo(({ 
  idx, 
  details, 
  isPending, 
  onClick 
}: { 
  idx: number, 
  details?: { initials: string, isMine: boolean }, 
  isPending: boolean, 
  onClick: (idx: number) => void 
}) => {
  const isOwnedByMe = details?.isMine;
  const isOwnedByOther = details && !details.isMine;
  
  let plotStyle = "border border-gray-500/20 hover:bg-blue-400/40 hover:border-blue-400 cursor-pointer transition-all duration-150 flex items-center justify-center overflow-hidden";
  
  if (isPending) {
    plotStyle = "bg-yellow-400/70 border-yellow-500 cursor-wait shadow-inner flex items-center justify-center overflow-hidden";
  } else if (isOwnedByMe) {
    plotStyle = "bg-green-500 flex items-center justify-center overflow-hidden font-bold text-[0.45rem] shadow-sm animate-in zoom-in-75 duration-300 text-white border-2 border-green-700";
  } else if (isOwnedByOther) {
    plotStyle = "bg-gray-500 flex items-center justify-center overflow-hidden font-bold text-[0.45rem] shadow-sm animate-in zoom-in-75 duration-300 text-white border border-gray-600";
  }

  return (
    <div
      id={`plot-${idx}`}
      onClick={() => onClick(idx)}
      className={plotStyle}
      title={`Plot #${idx}`}
    >
      {details && !isPending && details.initials}
    </div>
  );
});
PlotSquare.displayName = 'PlotSquare';

export default function OklahomaPlotMap() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const session = useKioskStore((state) => state.session);
  const clearSession = useKioskStore((state) => state.clearSession);
  
  const currentUserId = session?.pioneerId || null;

  // Zoom reference
  const transformWrapperRef = useRef<ReactZoomPanPinchRef>(null);

  // Configuration for 1200 plots
  const GRID_COLS = 40; 
  const GRID_ROWS = 30;
  const totalPlots = GRID_COLS * GRID_ROWS;

  const getInitials = (name?: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const { data: mapState, isLoading } = useQuery({
    queryKey: ['mapState', currentUserId],
    queryFn: () => getMapState(currentUserId)
  });

  const [pendingPlots, setPendingPlots] = useState<number[]>([]);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [activePlot, setActivePlot] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasDismissedCityChoice, setHasDismissedCityChoice] = useState(false);

  const showCityChoice = !hasDismissedCityChoice && !isLoading && mapState?.myPlotId === null && imageLoaded;

  const handleCityChoice = (city: string) => {
    setHasDismissedCityChoice(true);
    const targetPlotId = cityTargets[city];
    setTimeout(() => {
      transformWrapperRef.current?.zoomToElement(`plot-${targetPlotId}`, 3, 800);
    }, 100);
  };

  const plotDetails = useMemo(() => {
    const details: Record<number, { initials: string, isMine: boolean }> = {};
    if (mapState?.plots) {
      mapState.plots.forEach((p: { id: number; owner_id: string; profiles: { username?: string } | { username?: string }[] }) => {
        if (p.owner_id) {
          const profileData = p.profiles 
            ? (Array.isArray(p.profiles) ? p.profiles[0] : p.profiles) 
            : null;
          const username = profileData?.username || 'Anonymous';
          details[p.id] = {
            initials: getInitials(username),
            isMine: p.owner_id === currentUserId
          };
        }
      });
    }
    return details;
  }, [mapState?.plots, currentUserId]);

  const leaderboard = useMemo(() => {
    if (!mapState?.leaderboardData) return [];
    return mapState.leaderboardData.map((data: { owner_id: string; username: string; visits: number }) => ({
      owner_id: data.owner_id,
      username: data.username,
      initials: getInitials(data.username),
      visits: data.visits,
      stage: Math.min(26, data.visits + 1)
    }));
  }, [mapState?.leaderboardData]);

  // Effect for zooming and redirecting when myPlotId is found
  useEffect(() => {
    if (!isLoading && mapState?.myPlotId !== null && imageLoaded) {
      if (transformWrapperRef.current) {
        setTimeout(() => {
          transformWrapperRef.current?.zoomToElement(`plot-${mapState?.myPlotId}`, 2);
          setTimeout(() => {
            navigate('/game');
          }, 2000);
        }, 100);
      }
    }
  }, [isLoading, mapState?.myPlotId, navigate, imageLoaded]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase.channel('realtime_plots')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'plots' }, () => {
        queryClient.invalidateQueries({ queryKey: ['mapState'] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handlePlotClick = useCallback((plotId: number) => {
    if (plotDetails[plotId] || pendingPlots.includes(plotId)) return;
    
    if (!mapState?.canClaim) {
      alert("You have already claimed a plot. You can only claim one plot total.");
      return;
    }

    setPendingPlots([...pendingPlots, plotId]);
    setActivePlot(plotId);
    setShowClaimModal(true);
    setErrorMsg('');
  }, [plotDetails, pendingPlots, mapState?.canClaim]);

  const handleInitiatePayment = async () => {
    if (activePlot === null || !currentUserId) return;
    setIsProcessing(true);
    setErrorMsg('');
    try {
      // Simulate network delay for payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { error } = await claimPlot(activePlot, currentUserId);
      if (error) throw new Error(error);
      
      queryClient.invalidateQueries({ queryKey: ['mapState'] });
      navigate('/game');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to claim plot');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setPendingPlots(pendingPlots.filter((id) => id !== activePlot));
    setShowClaimModal(false);
    setActivePlot(null);
  };

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-orange-50 select-none">
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg w-[calc(100%-2rem)] max-w-4xl flex justify-between items-center border border-white/20">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">Oklahoma Land Rush (1889)</h1>
        <div className="flex gap-4 items-center">
          <div className="text-sm sm:text-lg font-semibold text-blue-700 bg-blue-100 px-4 py-1.5 rounded-full shadow-inner">
            Tier: {mapState?.userTier || 0}
          </div>
          <button 
            onClick={handleLogout}
            className="text-sm font-medium bg-gray-800 hover:bg-gray-900 text-white px-4 py-1.5 rounded-full transition-colors shadow-md active:scale-95"
          >
            Done (Log Out)
          </button>
        </div>
      </div>

      <div className="absolute right-6 top-32 z-10 bg-white/90 backdrop-blur-md px-4 py-4 rounded-xl shadow-lg w-64 border border-white/20 max-h-[60vh] overflow-y-auto flex flex-col gap-3 pointer-events-auto">
        <h2 className="text-lg font-bold text-gray-800 tracking-tight border-b pb-2">Leaderboard</h2>
        {leaderboard.length === 0 ? (
          <div className="text-sm text-gray-500 italic">No plots claimed yet.</div>
        ) : (
          leaderboard.map((entry, idx) => (
            <div key={entry.owner_id} className="flex items-center gap-3">
              <div className="text-sm font-bold text-gray-400 w-4">{idx + 1}.</div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm bg-gray-500">
                {entry.initials}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="text-sm font-bold text-gray-800 truncate">{entry.username}</div>
                <div className="text-xs text-gray-500">Stage {entry.stage} / 26</div>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showCityChoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[2rem] p-8 shadow-2xl max-w-2xl w-full text-center mx-4"
            >
              <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Claim a Specific Plot</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {cities.map(city => (
                  <button
                    key={city}
                    onClick={() => handleCityChoice(city)}
                    className="py-5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xl transition-colors shadow-md active:scale-95"
                  >
                    {city}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setHasDismissedCityChoice(true)}
                className="text-lg font-semibold text-gray-500 hover:text-gray-700 active:text-gray-900 py-3 px-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors active:scale-95"
              >
                Skip and see entire map
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <TransformWrapper
        ref={transformWrapperRef}
        initialScale={1}
        minScale={0.5}
        maxScale={8}
        centerOnInit={true}
        wheel={{ step: 0.001 }}
      >
        <TransformComponent wrapperClass="!w-full !h-full" contentClass="flex items-center justify-center">
          <div className="relative" style={{ width: '1600px', maxWidth: 'none' }}>
            <img 
              src="/oklahoma-map-1889.jpg"
              alt="1889 Oklahoma Indian Territory Map" 
              onLoad={() => setImageLoaded(true)}
              className="w-full h-auto block opacity-90 shadow-2xl border-4 border-gray-800"
              draggable={false}
            />

            <div 
              className="absolute top-0 left-0 w-full h-full border-4 border-transparent"
              style={{ 
                display: 'grid', 
                gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`, 
                gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)` 
              }}
            >
              {Array.from({ length: totalPlots }).map((_, idx) => (
                <PlotSquare 
                  key={idx}
                  idx={idx}
                  details={plotDetails[idx]}
                  isPending={pendingPlots.includes(idx)}
                  onClick={handlePlotClick}
                />
              ))}
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>

      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-white/20 transform animate-in zoom-in-95 duration-200">
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Claim</h2>
            <p className="text-gray-600 mb-6">
              You are about to claim <strong>Plot #{activePlot}</strong>. <br /> 
              Confirm your claim to take ownership and increase your tier.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {errorMsg}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button 
                onClick={handleCancel}
                disabled={isProcessing}
                className="flex-1 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleInitiatePayment}
                disabled={isProcessing}
                className="flex-[2] py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  `Pay $15.00 for Plot #${activePlot}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
