import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../utils/supabase";

export async function getMapState(userId: string | null) {
  const { data: plots } = await supabase
    .from("plots")
    .select("id, owner_id, profiles(first_name, color)")
    .not("owner_id", "is", null);

  let userTier = 0;
  let canClaim = false;
  let myPlotId = null;
  let myProfile = null;

  if (userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, color")
      .eq("id", userId)
      .single();

    if (profile) {
      myProfile = { ...profile, full_name: profile.first_name };
    }

    const { count: visitCount } = await supabase
      .from("visits")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    userTier = visitCount || 0;

    const { data: userPlots } = await supabase
      .from("plots")
      .select("id")
      .eq("owner_id", userId)
      .limit(1);

    if (userPlots && userPlots.length > 0) {
      canClaim = false;
      myPlotId = userPlots[0].id;
    } else {
      const { data: visits } = await supabase
        .from("visits")
        .select("id")
        .eq("user_id", userId)
        .eq("plot_claimed", false)
        .limit(1);

      canClaim = !!visits && visits.length > 0;
    }
  }

  const { data: allVisits } = await supabase
    .from("visits")
    .select("user_id, profiles(first_name)");

  const leaderboardMap = new Map();
  if (allVisits) {
    allVisits.forEach((v) => {
      const uid = v.user_id;
      const profileData = v.profiles
        ? Array.isArray(v.profiles)
          ? v.profiles[0]
          : v.profiles
        : null;
      const uname = profileData?.first_name || "Anonymous";
      if (!leaderboardMap.has(uid)) {
        leaderboardMap.set(uid, {
          owner_id: uid,
          first_name: uname,
          visits: 0,
        });
      }
      leaderboardMap.get(uid).visits += 1;
    });
  }

  const leaderboardData = Array.from(leaderboardMap.values());
  leaderboardData.sort((a, b) => b.visits - a.visits);

  return {
    plots,
    currentUserId: userId,
    userTier,
    canClaim,
    myPlotId,
    myProfile,
    leaderboardData,
  };
}

export function useMapState(currentUserId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["mapState", currentUserId],
    queryFn: () => getMapState(currentUserId),
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("realtime_plots")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "plots" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["mapState"] });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}
