import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../utils/supabase";

async function purchaseRoundsApi({
  userId,
  quantity,
}: {
  userId: string;
  quantity: number;
}) {
  if (!userId || quantity <= 0) return { success: false };

  // Create an array of visits
  const visits = Array.from({ length: quantity }).map(() => ({
    user_id: userId,
    plot_claimed: false,
    visit_date: new Date().toISOString(),
  }));

  // Insert multiple rows into visits table
  const { error } = await supabase.from("visits").insert(visits);

  if (error) {
    throw new Error("Failed to purchase rounds");
  }

  return { success: true };
}

export function usePurchaseRounds() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: purchaseRoundsApi,
    onSuccess: () => {
      // Invalidate relevant queries (e.g. map state, game state which relies on visits)
      queryClient.invalidateQueries({ queryKey: ["mapState"] });
      queryClient.invalidateQueries({ queryKey: ["gameState"] });
    },
  });
}
