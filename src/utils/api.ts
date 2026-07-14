import { supabase } from './supabase'

export async function getUserTier(userId: string) {
  const { count } = await supabase
    .from('visits')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    
  return count || 0
}

export async function claimPlot(plotId: number, userId: string) {
  // 1. Find an active visit that hasn't claimed a plot yet
  const { data: visits } = await supabase
    .from('visits')
    .select('id')
    .eq('user_id', userId)
    .eq('plot_claimed', false)
    .order('visit_date', { ascending: false })
    .limit(1)

  if (!visits || visits.length === 0) {
    return { error: 'No available claims for this visit. Please check in again to claim another plot.' }
  }

  const visitId = visits[0].id

  // 2. Check if they already own a plot
  const { count: ownedPlotsCount } = await supabase
    .from('plots')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', userId)

  if (ownedPlotsCount && ownedPlotsCount > 0) {
    return { error: 'You have already claimed a plot. You can only claim one plot total.' }
  }

  // 3. Check if the requested plot is already owned
  const { data: plot } = await supabase
    .from('plots')
    .select('owner_id')
    .eq('id', plotId)
    .single()

  if (plot?.owner_id) {
    return { error: 'Plot is already claimed by someone else.' }
  }

  // 4. Claim the plot
  const { error: plotError } = await supabase
    .from('plots')
    .upsert({ id: plotId, owner_id: userId, visit_id: visitId, claimed_at: new Date().toISOString() })

  if (plotError) {
    return { error: 'Failed to claim plot.' }
  }

  // 5. Mark visit as claimed
  await supabase
    .from('visits')
    .update({ plot_claimed: true })
    .eq('id', visitId)

  // Calculate new tier based on total visits
  const { count } = await supabase
    .from('visits')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  const newTier = count || 1;
  return { success: true, newTier }
}

export async function getMapState(userId: string | null) {
  const { data: plots } = await supabase
    .from('plots')
    .select('id, owner_id, profiles(username, color)')
    .not('owner_id', 'is', null)
  
  let userTier = 0
  let canClaim = false
  let myPlotId = null
  let myProfile = null

  if (userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, color')
      .eq('id', userId)
      .single()
      
    if (profile) {
      myProfile = { ...profile, full_name: profile.username }
    }

    const { count: visitCount } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      
    userTier = visitCount || 0

    const { data: userPlots } = await supabase
      .from('plots')
      .select('id')
      .eq('owner_id', userId)
      .limit(1)

    if (userPlots && userPlots.length > 0) {
      canClaim = false
      myPlotId = userPlots[0].id
    } else {
      const { data: visits } = await supabase
        .from('visits')
        .select('id')
        .eq('user_id', userId)
        .eq('plot_claimed', false)
        .limit(1)
      
      canClaim = !!visits && visits.length > 0
    }
  }

  const { data: allVisits } = await supabase
    .from('visits')
    .select('user_id, profiles(username)')
  
  const leaderboardMap = new Map()
  if (allVisits) {
    allVisits.forEach(v => {
      const uid = v.user_id
      const profileData = v.profiles 
        ? (Array.isArray(v.profiles) ? v.profiles[0] : v.profiles) 
        : null
      const uname = profileData?.username || 'Anonymous'
      if (!leaderboardMap.has(uid)) {
        leaderboardMap.set(uid, { owner_id: uid, username: uname, visits: 0 })
      }
      leaderboardMap.get(uid).visits += 1
    })
  }

  const leaderboardData = Array.from(leaderboardMap.values())
  leaderboardData.sort((a, b) => b.visits - a.visits)

  return { plots, currentUserId: userId, userTier, canClaim, myPlotId, myProfile, leaderboardData }
}
