'use client';

import AnnouncementBanner from '../components/AnnouncementBanner';
import LatestPostsSection from './components/LatestPostsSection';
import ThreadsSection from './components/ThreadsSection';
import SoccerKingVideosSection from './components/SoccerKingVideosSection';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function TimelinePage() {
  return (
    <>
      <AnnouncementBanner />
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950">
        <div className="px-3 pt-4 pb-24">
          <LatestPostsSection />
          <ThreadsSection />
          <SoccerKingVideosSection />
        </div>
      </div>
    </>
  );
}
