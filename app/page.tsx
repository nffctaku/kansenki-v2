'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { teamsByCountry } from '../lib/teamData';
import { SimplePost, Match } from '@/types/match';
import { UnifiedPost } from '@/types/post';
import { Timestamp } from 'firebase/firestore';
import PostCard from '@/components/PostCard';
import SpotCard, { SpotData } from '@/components/SpotCard';
import { format } from 'date-fns';
import AnnouncementBanner from './components/AnnouncementBanner';



export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<UnifiedPost[]>([]);
  const [spots, setSpots] = useState<SpotData[]>([]);
  const [teamNameSuggestions, setTeamNameSuggestions] = useState<{ [key: string]: string[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // Fetch from 'posts' (new format)
        const postsCollection = collection(db, 'posts');
        const qNew = query(postsCollection, orderBy('createdAt', 'desc'), limit(50));
        const snapshotNew = await getDocs(qNew);
        const newPosts: SimplePost[] = snapshotNew.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            imageUrls: d.images || d.imageUrls || d.existingImageUrls || [],
            season: d.match?.season ?? '',
            episode: d.title ?? '',
            author: d.authorNickname ?? '',
            authorId: d.authorId ?? '',
            league: d.match?.competition ?? '',
            matches: d.match ? [d.match] : [],
            likeCount: d.likeCount ?? 0,
            helpfulCount: d.helpfulCount ?? 0,
            createdAt: d.createdAt?.toDate() || new Date(0),
            postType: 'new',
          } as SimplePost;
        });

        // Fetch from 'simple-posts' (legacy format)
        const simplePostsCollection = collection(db, 'simple-posts');
        const qLegacy = query(simplePostsCollection, orderBy('createdAt', 'desc'), limit(50));
        const snapshotLegacy = await getDocs(qLegacy);
        const legacyPosts: SimplePost[] = snapshotLegacy.docs.map((doc) => {
          const d = doc.data();
          const matchesWithCompat = (Array.isArray(d.matches) ? d.matches : []).map((match: any) => ({
            ...match,
            homeTeam: match.homeTeam || match.teamA,
            awayTeam: match.awayTeam || match.teamB,
          }));
          return {
            id: doc.id,
            imageUrls: d.imageUrls ?? [],
            season: d.season ?? '',
            episode: d.episode ?? '',
            author: d.nickname ?? '',
            authorId: d.uid ?? '',
            league: matchesWithCompat[0]?.competition ?? '',
            matches: matchesWithCompat,
            likeCount: d.likeCount ?? 0,
            helpfulCount: d.helpfulCount ?? 0,
            createdAt: d.createdAt?.toDate() || new Date(0),
            postType: 'simple',
          } as SimplePost;
        });

        const combined = [...newPosts, ...legacyPosts];
        const postsWithImages = combined.filter(p => p.imageUrls && p.imageUrls.length > 0);
        const uniquePostsRaw = Array.from(new Map(postsWithImages.map(p => [p.id, p])).values());
        uniquePostsRaw.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));

        const uniquePosts: UnifiedPost[] = uniquePostsRaw.map(post => ({
          id: post.id,
          postType: 'post',
          title: post.episode,
          subtext: (post.matches?.[0] ? `${post.matches[0].homeTeam || post.matches[0].teamA} vs ${post.matches[0].awayTeam || post.matches[0].teamB}` : '試合情報なし') || null,
          imageUrls: post.imageUrls || [],
          author: {
            id: post.authorId || '',
            nickname: post.author as string,
            avatar: post.authorAvatar,
          },
          createdAt: post.createdAt ?? null,
          league: post.league || '',
          country: post.country || '',
          href: `/posts/${post.id}`,
          originalData: post,
        }));
        const spotsCollection = collection(db, 'spots');
        const qSpots = query(spotsCollection, orderBy('createdAt', 'desc'), limit(50));
        const spotsSnapshot = await getDocs(qSpots);
        const allSpots: SpotData[] = spotsSnapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            spotName: d.spotName,
            comment: d.comment,
            imageUrls: d.imageUrls || [],
            createdAt: d.createdAt?.toDate() || new Date(0),
            url: d.url,
            country: d.country,
            category: d.category,
            type: d.type || 'spot',
            author: d.author,
            authorAvatar: d.authorAvatar,
            rating: d.rating,
            city: d.city,
            overallRating: d.overallRating,
          } as SpotData;
        });

        setPosts(uniquePosts.slice(0, 10));
        setSpots(allSpots.slice(0, 10));

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const query = searchQuery.trim().toLowerCase();

    if (searchQuery.trim() === '') {
      setTeamNameSuggestions({});
      return;
    }

    const suggestions: { [key: string]: string[] } = {};
    Object.entries(teamsByCountry).forEach(([country, teams]) => {
      const matchingTeams = teams.filter(team => team.toLowerCase().includes(query));
      if (matchingTeams.length > 0) {
        suggestions[country] = matchingTeams;
      }
    });
    setTeamNameSuggestions(suggestions);
  }, [searchQuery, isLoading]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSuggestionClick = (teamName: string) => {
    setSearchQuery(teamName);
    setTeamNameSuggestions({});
  };

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return (
    <>
      <AnnouncementBanner />
      <div className="m-3 bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <div className="text-center">
          <h2 className="text-md font-bold mb-3 text-gray-900 dark:text-gray-200">観戦記を探す</h2>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="チーム名または大会名を入力"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {Object.keys(teamNameSuggestions).length > 0 && (
              <div className="absolute mt-1 w-full z-10">
                <ul className="text-left list-none m-0 p-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                  {Object.entries(teamNameSuggestions).map(([country, teams]) => (
                    <React.Fragment key={country}>
                      <li className="p-2 font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 sticky top-0">{country}</li>
                      {teams.map((team) => (
                        <li key={team} onClick={() => handleSuggestionClick(team)} className="p-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700">
                          {team}
                        </li>
                      ))}
                    </React.Fragment>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="px-2 py-3">
        <h2 className="text-lg font-bold my-3 text-center text-gray-900 dark:text-gray-200">
          最新の観戦記
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Spots Feed */}
      <div className="px-2 py-3">
        <h2 className="text-lg font-bold my-3 text-center text-gray-900 dark:text-gray-200">
          最新のおすすめスポット
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
          {spots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </div>
    </>
  );
}
