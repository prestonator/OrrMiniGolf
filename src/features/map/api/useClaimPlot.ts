import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../utils/supabase";

async function claimPlotApi({
  plotId,
  userId,
}: {
  plotId: number;
  userId: string;
}) {
  // 1. Find an active visit that hasn't claimed a plot yet
  const { data: visits } = await supabase
    .from("visits")
    .select("id")
    .eq("user_id", userId)
    .eq("plot_claimed", false)
    .order("visit_date", { ascending: false })
    .limit(1);

  if (!visits || visits.length === 0) {
    throw new Error(
      "No available claims for this visit. Please check in again to claim another plot.",
    );
  }

  const visitId = visits[0].id;

  // 2. Check if they already own a plot
  const { count: ownedPlotsCount } = await supabase
    .from("plots")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", userId);

  if (ownedPlotsCount && ownedPlotsCount > 0) {
    throw new Error(
      "You have already claimed a plot. You can only claim one plot total.",
    );
  }

  // 3. Check if the requested plot is already owned
  const { data: plot } = await supabase
    .from("plots")
    .select("owner_id")
    .eq("id", plotId)
    .single();

  if (plot?.owner_id) {
    throw new Error("Plot is already claimed by someone else.");
  }

  // 4. Claim the plot
  const { error: plotError } = await supabase
    .from("plots")
    .upsert({
      id: plotId,
      owner_id: userId,
      visit_id: visitId,
      claimed_at: new Date().toISOString(),
    });

  if (plotError) {
    throw new Error("Failed to claim plot.");
  }

  // 5. Mark visit as claimed
  await supabase
    .from("visits")
    .update({ plot_claimed: true })
    .eq("id", visitId);

  // Calculate new tier based on total visits
  const { count } = await supabase
    .from("visits")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const newTier = count || 1;
  return { success: true, newTier };
}

export function useClaimPlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: claimPlotApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mapState"] });
    },
  });
}
