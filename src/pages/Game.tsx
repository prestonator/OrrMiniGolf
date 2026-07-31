import Scene from "../features/game/components/Scene";
import { GameUI } from "../features/game/components/GameUI";
import { useGameState } from "../features/game/api/useGameState";
import { Spinner } from "../components/ui/Spinner";

export default function Game() {
  const { currentStage, totalStages, loading, session } = useGameState();

  if (loading) {
    return (
      <div className="w-full h-screen bg-cream flex flex-col items-center justify-center">
        <Spinner
          size="lg"
          text="Loading Homestead..."
          subtext="Pioneering the frontier..."
        />
      </div>
    );
  }

  return (
    <main className="relative w-full h-screen bg-sky-100 overflow-hidden">
      <Scene currentStage={currentStage} />
      <GameUI
        currentStage={currentStage}
        totalStages={totalStages}
        session={session}
      />
    </main>
  );
}
