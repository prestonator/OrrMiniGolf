import { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';

import { claimPlot } from '../utils/api';
import { useKioskStore } from '../store/useKioskStore';
import { Spinner } from './Spinner';

import { usePlots } from '../hooks/usePlots';
import { CITY_TARGETS, CITIES, GRID_COLS, GRID_ROWS, TOTAL_PLOTS } from '../config/constants';
import { Leaderboard } from './Map/Leaderboard';
import { CitySelector } from './Map/CitySelector';
import { ClaimModal } from './Map/ClaimModal';
import { Button } from './ui/Button';

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
  const transformWrapperRef = useRef<ReactZoomPanPinchRef>(null);

  const getInitials = (name?: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const { data: mapState, isLoading } = usePlots(currentUserId);

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
    const targetPlotId = CITY_TARGETS[city];
    setTimeout(() => {
      transformWrapperRef.current?.zoomToElement(`plot-${targetPlotId}`, 3, 800);
    }, 100);
  };

  const plotDetails = useMemo(() => {
    const details: Record<number, { initials: string, isMine: boolean }> = {};
    if (mapState?.plots) {
      mapState.plots.forEach((p: { id: number; owner_id: string; profiles: { first_name?: string } | { first_name?: string }[] }) => {
        if (p.owner_id) {
          const profileData = p.profiles 
            ? (Array.isArray(p.profiles) ? p.profiles[0] : p.profiles) 
            : null;
          const firstName = profileData?.first_name || 'Anonymous';
          details[p.id] = {
            initials: getInitials(firstName),
            isMine: p.owner_id === currentUserId
          };
        }
      });
    }
    return details;
  }, [mapState?.plots, currentUserId]);

  const leaderboard = useMemo(() => {
    if (!mapState?.leaderboardData) return [];
    return mapState.leaderboardData.map((data: { owner_id: string; first_name: string; visits: number }) => ({
      owner_id: data.owner_id,
      first_name: data.first_name,
      initials: getInitials(data.first_name),
      visits: data.visits,
      stage: Math.min(26, Math.max(1, data.visits))
    }));
  }, [mapState?.leaderboardData]);

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
        <Spinner size="lg" color="border-[#3a2212]" />
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-orange-50 select-none">
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg w-[calc(100%-2rem)] max-w-4xl flex justify-between items-center border border-white/20">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight font-serif">Oklahoma Land Rush (1889)</h1>
        <div className="flex gap-4 items-center">
          <div className="text-sm sm:text-lg font-semibold text-blue-700 bg-blue-100 px-4 py-1.5 rounded-full shadow-inner">
            Tier: {mapState?.userTier || 0}
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Done (Log Out)
          </Button>
        </div>
      </div>

      <Leaderboard entries={leaderboard} />

      <AnimatePresence>
        {showCityChoice && (
          <CitySelector 
            cities={CITIES} 
            onSelectCity={handleCityChoice} 
            onSkip={() => setHasDismissedCityChoice(true)} 
          />
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
              {Array.from({ length: TOTAL_PLOTS }).map((_, idx) => (
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
        <ClaimModal 
          activePlot={activePlot} 
          isProcessing={isProcessing} 
          errorMsg={errorMsg} 
          onCancel={handleCancel} 
          onConfirm={handleInitiatePayment} 
        />
      )}
    </div>
  );
}
