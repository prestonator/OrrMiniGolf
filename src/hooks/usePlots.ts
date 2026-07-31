import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMapState } from '../utils/api';
import { supabase } from '../utils/supabase';

export function usePlots(currentUserId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['mapState', currentUserId],
    queryFn: () => getMapState(currentUserId),
  });

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

  return query;
}
