'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';

type Travel = {
  id: string;
  nickname: string;
  imageUrls?: string[];
  category?: string;
  season?: string;
  likeCount?: number;
  helpfulCount?: number;
  league?: string;
  matches?: {
    teamA?: string;
    teamB?: string;
    homeTeam?: string;
    awayTeam?: string;
    date?: string;
    competition?: string;
  }[];
};

const categoryLabelMap: Record<string, string> = {
  england: 'イングランド',
  spain: 'スペイン',
  italy: 'イタリア',
  germany: 'ドイツ',
  france: 'フランス',
  'club-world-cup': 'クラブワールドカップ',
  'japan-tour': 'ジャパンツアー',
  other: 'その他',
};

const categoryToLeagueMap: Record<string, string> = {
  england: 'プレミアリーグ',
  spain: 'ラ・リーガ',
  italy: 'セリエA',
  germany: 'ブンデスリーガ',
  france: 'リーグ・アン',
  'club-world-cup': 'クラブワールドカップ',
  'japan-tour': 'ジャパンツアー',
  other: 'その他',
};

const getCategoryStyles = (category: string | string[] | undefined): { style: React.CSSProperties; titleClassName: string } => {
  if (typeof category !== 'string') {
    return { style: { paddingBottom: '200px' }, titleClassName: 'text-gray-800' };
  }
  switch (category) {
    case 'club-world-cup':
      return {
        style: {
          backgroundImage: 'url(/cwc-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          paddingBottom: '200px',
          minHeight: '100vh',
        },
        titleClassName: 'text-white',
      };
    // Example for Japan Tour
    // case 'japan-tour':
    //   return {
    //     style: {
    //       background: 'linear-gradient(135deg, #bc002d 0%, #ffffff 100%)', // Red and white
    //       paddingBottom: '200px',
    //       minHeight: '100vh',
    //     },
    //     titleClassName: 'text-black',
    //   };
    default:
      return { style: { paddingBottom: '200px' }, titleClassName: 'text-gray-800' };
  }
};


export default function CategoryPage() {
  const { category } = useParams();
  const [posts, setPosts] = useState<Travel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!category || typeof category !== 'string') return;
        console.log(`Fetching data for category: ${category}`);

        const japaneseCategory = categoryLabelMap[category] || category;
        console.log(`Translated to japanese category: ${japaneseCategory}`);

        // Query for old simple-posts
        const oldPostsQuery = query(collection(db, 'simple-posts'), where('category', '==', category));
        
        // Query for new posts
        const newPostsQuery = query(collection(db, 'posts'), where('categories', 'array-contains', japaneseCategory));

        const [oldPostsSnap, newPostsSnap] = await Promise.all([
          getDocs(oldPostsQuery),
          getDocs(newPostsQuery)
        ]);

        console.log(`Old posts found: ${oldPostsSnap.docs.length}`);
        console.log(`New posts found: ${newPostsSnap.docs.length}`);

        const oldPosts = oldPostsSnap.docs.map((doc) => {
          const postData = doc.data();
          const matchesWithCompat = (Array.isArray(postData.matches) ? postData.matches : []).map((match: any) => ({
            ...match,
            homeTeam: match.homeTeam || match.teamA,
            awayTeam: match.awayTeam || match.teamB,
          }));
          return { 
            id: doc.id, 
            ...postData, 
            matches: matchesWithCompat,
            league: matchesWithCompat[0]?.competition ?? '',
          } as Travel;
        });

        const newPosts = newPostsSnap.docs.map((doc) => {
          const postData = doc.data();
          const match = postData.match || {};
          const normalizedMatches = [{
              homeTeam: match.homeTeam,
              awayTeam: match.awayTeam,
              date: match.date,
          }];
          
          return {
            id: doc.id,
            nickname: postData.authorNickname || '',
            imageUrls: postData.images || postData.imageUrls || postData.existingImageUrls || [],
            category: (postData.categories && postData.categories[0]) || '',
            season: match.season || '',
            likeCount: postData.likeCount || 0,
            helpfulCount: postData.helpfulCount || 0,
            league: match.competition ?? '',
            matches: normalizedMatches,
          } as Travel;
        });
        
        const combinedPosts = [...oldPosts, ...newPosts];
        const uniquePosts = Array.from(new Map(combinedPosts.map(post => [post.id, post])).values());

        setPosts(uniquePosts);
      } catch (error) {
        console.error("Failed to fetch category posts:", error);
      }
    };
    fetchData();
  }, [category]);

  const { style: pageStyle, titleClassName } = getCategoryStyles(category);
  const title = categoryLabelMap[category as string] || category;

  const displayedPosts = posts.filter((post) => {
    const match = post.matches?.[0] as any;
    const matchText = match
      ? `${match.homeTeam || ''} vs ${match.awayTeam || ''}`.toLowerCase()
      : '';
    const seasonText = post.season?.toLowerCase() || '';
    return (
      matchText.includes(searchTerm.toLowerCase()) ||
      seasonText.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div
      className="mb-12 px-4 w-full max-w-screen-xl mx-auto"
      style={pageStyle}
    >
      <h1 className={`text-2xl font-bold mb-4 ${titleClassName}`}>{title}の観戦記</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="試合名やシーズンで検索"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 w-full max-w-full">
        {displayedPosts.map((post) => {
          const match = post.matches?.[0] as any;
          const homeTeam = match?.homeTeam || '';
          const awayTeam = match?.awayTeam || '';
          const matchTitle =
            homeTeam && awayTeam
              ? `${homeTeam} vs ${awayTeam}`
              : homeTeam || awayTeam || '';
          const postDate = post.season || (post.matches && post.matches[0]?.date) || '日付未設定';

          return (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col">
              <Link href={`/posts/${post.id}`} className="no-underline flex flex-col flex-grow">
                <div className="w-full h-28 relative">
                  {post.imageUrls && post.imageUrls.length > 0 ? (
                    <Image
                      src={post.imageUrls[0]}
                      alt={post.nickname || 'Post image'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700"></div>
                  )}
                  {(post.league || post.category || category) && (
                    <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-[10px] px-2 py-0.5 rounded-full">
                      {post.league || categoryToLeagueMap[category as string] || categoryToLeagueMap[post.category as string] || post.category}
                    </div>
                  )}
                </div>
                <div className="p-2 flex flex-col flex-grow">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-1 line-clamp-2">
                    {post.nickname || matchTitle || 'タイトルなし'}
                  </p>
                  {matchTitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">
                      {matchTitle}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="truncate font-medium text-gray-700 dark:text-gray-300">
                      {post.nickname || '投稿者'}
                    </span>
                    <span>{postDate}</span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}