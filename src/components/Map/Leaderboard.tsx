interface LeaderboardEntry {
  owner_id: string;
  first_name: string;
  initials: string;
  visits: number;
  stage: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <div className="absolute right-6 top-32 z-10 bg-white/90 backdrop-blur-md px-4 py-4 rounded-xl shadow-lg w-64 border border-white/20 max-h-[60vh] overflow-y-auto flex flex-col gap-3 pointer-events-auto">
      <h2 className="text-lg font-bold text-gray-800 tracking-tight border-b pb-2 font-serif">Leaderboard</h2>
      {entries.length === 0 ? (
        <div className="text-sm text-gray-500 italic">No plots claimed yet.</div>
      ) : (
        entries.map((entry, idx) => (
          <div key={entry.owner_id} className="flex items-center gap-3">
            <div className="text-sm font-bold text-gray-400 w-4">{idx + 1}.</div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm bg-gray-500">
              {entry.initials}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="text-sm font-bold text-gray-800 truncate">{entry.first_name}</div>
              <div className="text-xs text-gray-500">Stage {entry.stage} / 26</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
