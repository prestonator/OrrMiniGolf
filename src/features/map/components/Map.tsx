import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { AnimatePresence } from "framer-motion";

import { useKioskStore } from "../../../store/useKioskStore";
import { Spinner } from "../../../components/ui/Spinner";

import { useMapState } from "../api/useMapState";
import { useClaimPlot } from "../api/useClaimPlot";
import { usePurchaseRounds } from "../../payment/api/usePurchaseRounds";
import {
  CITY_TARGETS,
  CITIES,
  GRID_COLS,
  GRID_ROWS,
  TOTAL_PLOTS,
} from "../../../config/constants";
import { Leaderboard } from "./Leaderboard";
import { CitySelector } from "./CitySelector";
import { ClaimModal } from "./ClaimModal";
import { Button } from "../../../components/ui/Button";

export default function OklahomaPlotMap() {
  const navigate = useNavigate();
  const session = useKioskStore((state) => state.session);
  const clearSession = useKioskStore((state) => state.clearSession);

  const currentUserId = session?.pioneerId || null;
  const transformWrapperRef = useRef<ReactZoomPanPinchRef>(null);

  const getInitials = (name?: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const { data: mapState, isLoading } = useMapState(currentUserId);
  const claimPlotMutation = useClaimPlot();
  const { mutateAsync: purchaseRounds } = usePurchaseRounds();

  const [pendingPlots, setPendingPlots] = useState<number[]>([]);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [activePlot, setActivePlot] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasDismissedCityChoice, setHasDismissedCityChoice] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPlot, setHoveredPlot] = useState<number | null>(null);

  const showCityChoice =
    !hasDismissedCityChoice &&
    !isLoading &&
    mapState?.myPlotId === null &&
    imageLoaded;

  const handleCityChoice = (city: string) => {
    setHasDismissedCityChoice(true);
    const targetPlotId = CITY_TARGETS[city];
    setTimeout(() => {
      transformWrapperRef.current?.zoomToElement(
        `plot-${targetPlotId}`,
        3,
        800,
      );
    }, 100);
  };

  const plotDetails = useMemo(() => {
    const details: Record<number, { initials: string; isMine: boolean }> = {};
    if (mapState?.plots) {
      mapState.plots.forEach(
        (p: {
          id: number;
          owner_id: string;
          profiles: { first_name?: string } | { first_name?: string }[];
        }) => {
          if (p.owner_id) {
            const profileData = p.profiles
              ? Array.isArray(p.profiles)
                ? p.profiles[0]
                : p.profiles
              : null;
            const firstName = profileData?.first_name || "Anonymous";
            details[p.id] = {
              initials: getInitials(firstName),
              isMine: p.owner_id === currentUserId,
            };
          }
        },
      );
    }
    return details;
  }, [mapState?.plots, currentUserId]);

  const leaderboard = useMemo(() => {
    if (!mapState?.leaderboardData) return [];
    return mapState.leaderboardData.map(
      (data: { owner_id: string; first_name: string; visits: number }) => ({
        owner_id: data.owner_id,
        first_name: data.first_name,
        initials: getInitials(data.first_name),
        visits: data.visits,
        stage: Math.min(26, Math.max(1, data.visits)),
      }),
    );
  }, [mapState?.leaderboardData]);

  useEffect(() => {
    if (!isLoading && mapState?.myPlotId !== null && imageLoaded) {
      if (transformWrapperRef.current) {
        setTimeout(() => {
          transformWrapperRef.current?.zoomToElement(
            `plot-${mapState?.myPlotId}`,
            2,
          );
          setTimeout(() => {
            navigate("/game");
          }, 2000);
        }, 100);
      }
    }
  }, [isLoading, mapState?.myPlotId, navigate, imageLoaded]);

  const handlePlotClick = useCallback(
    (plotId: number) => {
      if (plotDetails[plotId] || pendingPlots.includes(plotId)) return;

      if (!mapState?.canClaim) {
        alert(
          "You have already claimed a plot. You can only claim one plot total.",
        );
        return;
      }

      setPendingPlots([...pendingPlots, plotId]);
      setActivePlot(plotId);
      setShowClaimModal(true);
      setErrorMsg("");
    },
    [plotDetails, pendingPlots, mapState?.canClaim],
  );

  const handleInitiatePayment = async (quantity: number) => {
    if (activePlot === null || !currentUserId) return;
    setIsProcessing(true);
    setErrorMsg("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      if (quantity > 1) {
        await purchaseRounds({ userId: currentUserId, quantity: quantity - 1 });
      }

      await claimPlotMutation.mutateAsync({
        plotId: activePlot,
        userId: currentUserId,
      });

      navigate("/game");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to claim plot");
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
    navigate("/");
  };

  // Canvas drawing logic
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const width = img.clientWidth;
    const height = img.clientHeight;

    // Fallback just in case image hasn't fully computed layout
    if (width === 0 || height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const cellWidth = width / GRID_COLS;
    const cellHeight = height / GRID_ROWS;

    // Background grid lines
    ctx.strokeStyle = "rgba(107, 114, 128, 0.2)"; // gray-500/20
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let c = 0; c <= GRID_COLS; c++) {
      ctx.moveTo(c * cellWidth, 0);
      ctx.lineTo(c * cellWidth, height);
    }
    for (let r = 0; r <= GRID_ROWS; r++) {
      ctx.moveTo(0, r * cellHeight);
      ctx.lineTo(width, r * cellHeight);
    }
    ctx.stroke();

    for (let idx = 0; idx < TOTAL_PLOTS; idx++) {
      const col = idx % GRID_COLS;
      const row = Math.floor(idx / GRID_COLS);
      const x = col * cellWidth;
      const y = row * cellHeight;

      const isPending = pendingPlots.includes(idx);
      const details = plotDetails[idx];
      const isMine = details?.isMine;
      const isOther = details && !details.isMine;
      const isHovered = hoveredPlot === idx;

      if (isPending) {
        ctx.fillStyle = "rgba(250, 204, 21, 0.7)";
        ctx.fillRect(x, y, cellWidth, cellHeight);
        ctx.strokeStyle = "rgba(234, 179, 8, 1)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellWidth, cellHeight);
      } else if (isMine) {
        ctx.fillStyle = "rgba(34, 197, 94, 1)";
        ctx.fillRect(x, y, cellWidth, cellHeight);
        ctx.strokeStyle = "rgba(21, 128, 61, 1)";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cellWidth, cellHeight);

        ctx.fillStyle = "white";
        // Calculate font size relative to cell width (roughly 80% of width up to a max)
        const fontSize = Math.max(3, Math.min(10, cellWidth * 0.8));
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(details.initials, x + cellWidth / 2, y + cellHeight / 2);
      } else if (isOther) {
        ctx.fillStyle = "rgba(107, 114, 128, 1)";
        ctx.fillRect(x, y, cellWidth, cellHeight);
        ctx.strokeStyle = "rgba(75, 85, 99, 1)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellWidth, cellHeight);

        ctx.fillStyle = "white";
        const fontSize = Math.max(3, Math.min(10, cellWidth * 0.8));
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(details.initials, x + cellWidth / 2, y + cellHeight / 2);
      } else if (isHovered) {
        ctx.fillStyle = "rgba(96, 165, 250, 0.4)";
        ctx.fillRect(x, y, cellWidth, cellHeight);
        ctx.strokeStyle = "rgba(96, 165, 250, 1)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellWidth, cellHeight);
      }
    }
  }, [imageLoaded, plotDetails, pendingPlots, hoveredPlot]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const getPlotIdxFromEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cellWidth = rect.width / GRID_COLS;
    const cellHeight = rect.height / GRID_ROWS;

    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);

    if (col >= 0 && col < GRID_COLS && row >= 0 && row < GRID_ROWS) {
      return row * GRID_COLS + col;
    }
    return null;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const idx = getPlotIdxFromEvent(e);
    if (idx !== hoveredPlot) {
      setHoveredPlot(idx);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPlot(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const idx = getPlotIdxFromEvent(e);
    if (idx !== null) {
      handlePlotClick(idx);
    }
  };

  // Hidden targets for zoom feature
  const hiddenTargets = useMemo(() => {
    const targets = CITIES.map((city) => {
      const targetId = CITY_TARGETS[city];
      const col = targetId % GRID_COLS;
      const row = Math.floor(targetId / GRID_COLS);
      return (
        <div
          key={city}
          id={`plot-${targetId}`}
          className="absolute pointer-events-none"
          style={{
            left: `${(col / GRID_COLS) * 100}%`,
            top: `${(row / GRID_ROWS) * 100}%`,
            width: `${100 / GRID_COLS}%`,
            height: `${100 / GRID_ROWS}%`,
          }}
        />
      );
    });

    if (mapState?.myPlotId !== null && mapState?.myPlotId !== undefined) {
      const col = mapState.myPlotId % GRID_COLS;
      const row = Math.floor(mapState.myPlotId / GRID_COLS);
      targets.push(
        <div
          key="myPlot"
          id={`plot-${mapState.myPlotId}`}
          className="absolute pointer-events-none"
          style={{
            left: `${(col / GRID_COLS) * 100}%`,
            top: `${(row / GRID_ROWS) * 100}%`,
            width: `${100 / GRID_COLS}%`,
            height: `${100 / GRID_ROWS}%`,
          }}
        />,
      );
    }

    return targets;
  }, [mapState?.myPlotId]);

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
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight font-serif">
          Oklahoma Land Rush (1889)
        </h1>
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
        <TransformComponent
          wrapperClass="!w-full !h-full"
          contentClass="flex items-center justify-center"
        >
          <div
            className="relative"
            style={{ width: "1600px", maxWidth: "none" }}
          >
            <img
              ref={imgRef}
              src="/oklahoma-map-1889.jpg"
              alt="1889 Oklahoma Indian Territory Map"
              onLoad={() => {
                setImageLoaded(true);
                // Trigger a re-draw immediately after load
                setTimeout(drawCanvas, 0);
              }}
              className="w-full h-auto block opacity-90 shadow-2xl border-4 border-gray-800"
              draggable={false}
            />

            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 border-4 border-transparent z-10 cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleCanvasClick}
            />

            {hiddenTargets}
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
