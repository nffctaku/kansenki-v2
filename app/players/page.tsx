import JfaVideosSection from './components/JfaVideosSection';
import FavoritePlayersSection from './components/FavoritePlayersSection';
import ManualNationalMatchesRow from '@/app/home/components/ManualNationalMatchesRow';
import { manualNationalMatches } from '@/lib/national/manualNationalMatches';

export default function PlayersPage() {
  const nationalMatchesForList = manualNationalMatches;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950">
      <div className="px-3 pt-4 pb-24">
        <div className="px-1 pb-2">
          <h1 className="text-lg font-bold text-white">日本代表</h1>
        </div>
        <ManualNationalMatchesRow matches={nationalMatchesForList} />
        <FavoritePlayersSection />
        <JfaVideosSection />
      </div>
    </div>
  );
}
