import { useState, useEffect } from "react";
import { supabase } from "../../../utils/supabase";
import { useKioskStore } from "../../../store/useKioskStore";

export async function getUserTier(userId: string) {
  const { count } = await supabase
    .from("visits")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  return count || 0;
}

export function useGameState() {
  const session = useKioskStore((state: any) => state.session);
  const [currentStage, setCurrentStage] = useState(1);
  const [loading, setLoading] = useState(true);
  const totalStages = 26;

  useEffect(() => {
    async function load() {
      if (!session?.pioneerId) {
        setLoading(false);
        return;
      }
      const tier = await getUserTier(session.pioneerId);
      setCurrentStage(Math.min(totalStages, tier));
      setLoading(false);
    }
    load();
  }, [session?.pioneerId]);

  return { currentStage, loading, totalStages, session };
}
