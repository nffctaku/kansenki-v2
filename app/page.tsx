'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { teamsByCountry } from '../lib/teamData';
import { SimplePost, Match } from '@/types/match';
import { UnifiedPost, UnifiedPostWithDate } from '@/types/post';
import { Timestamp } from 'firebase/firestore';
import PostCard from '@/components/PostCard';
import SpotCard, { SpotData } from '@/components/SpotCard';
import { format } from 'date-fns';
import AnnouncementBanner from './components/AnnouncementBanner';
import PopularPostsSlider from '@/components/PopularPostsSlider';
import { RecentSpotsSlider } from '@/components/RecentSpotsSlider';



export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<UnifiedPostWithDate[]>([]);
  const [teamNameSuggestions, setTeamNameSuggestions] = useState<{ [key: string]: string[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const collectionNames = ['posts', 'simple-posts', 'simple-travels'];
        const allItems: { data: any; type: string }[] = [];
        const authorIds = new Set<string>();

        for (const collectionName of collectionNames) {
          const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'), limit(50));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(doc => {
            const data = doc.data();
            allItems.push({ data: { ...data, id: doc.id }, type: collectionName });
            const authorId = data.authorId || data.userId || (data.author && data.author.id);
            if (authorId) {
              authorIds.add(authorId);
            }
          });
        }

        const authorProfiles = new Map<string, { nickname: string; avatarUrl: string }>();
        if (authorIds.size > 0) {
          const authorIdList = Array.from(authorIds);
          const chunks = [];
          for (let i = 0; i < authorIdList.length; i += 30) {
            chunks.push(authorIdList.slice(i, i + 30));
          }

          for (const chunk of chunks) {
            if (chunk.length === 0) continue;
            const usersQuery = query(collection(db, 'users'), where('__name__', 'in', chunk));
            const usersSnapshot = await getDocs(usersQuery);
            usersSnapshot.forEach(doc => {
              const userData = doc.data();
              authorProfiles.set(doc.id, {
                nickname: userData.nickname,
                avatarUrl: userData.avatarUrl
              });
            });
          }
        }

        const unifiedItems: UnifiedPostWithDate[] = allItems.map(({ data, type }) => {

          const authorId = data.authorId || data.userId || (data.author && data.author.id);
          const profile = authorId ? authorProfiles.get(authorId) : undefined;

          const authorName = profile?.nickname
            || data.authorName
            || (data.author && typeof data.author === 'object' ? data.author.name : (typeof data.author === 'string' ? data.author : null))
            || '名無し';

          const authorImage = profile?.avatarUrl
            || (data.author && typeof data.author === 'object' ? data.author.image : null)
            || data.authorImage
            || '/default-avatar.svg';

          const getTitle = () => {
            // Use user-defined title if it exists, especially for the 'posts' collection.
            if (data.title) {
              return data.title;
            }
            // Fallback to match card string if no user title.
            if (type === 'posts' || type === 'simple-posts') {
              const homeTeam = data.match?.homeTeam || data.homeTeam;
              const awayTeam = data.match?.awayTeam || data.awayTeam;
              if (homeTeam && awayTeam) {
                return `${homeTeam} vs ${awayTeam}`;
              }
            }
            // Final fallback for other types or if no data is available.
            return data.spotName || '無題';
          };

          return {
            id: data.id,
            postType: type.replace(/s$/, '') as any,
            collectionName: type,
            title: getTitle(),
            subtext: data.match?.stadium?.name || data.stadium || null,
            imageUrls: data.imageUrls || data.images || (data.imageUrl ? [data.imageUrl] : []),
            authorId: authorId,
            authorName: authorName,
            authorImage: authorImage,
            createdAt: (() => {
              const d = data.createdAt;
              if (!d) return null;
              if (d instanceof Date) return d;
              if (typeof d === 'string') return new Date(d);
              if (typeof d.seconds === 'number') return new Timestamp(d.seconds, d.nanoseconds).toDate();
              return null;
            })(),
            league: data.match?.competition || data.match?.league || data.league || data.matches?.[0]?.competition || '',
            country: data.match?.country || data.country || '',
            href: `/${type}/${data.id}`,
            originalData: data,
          };
        }).filter(item => item.imageUrls && item.imageUrls.length > 0);

        unifiedItems.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));

        setItems(unifiedItems.slice(0, 10));

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
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

      <PopularPostsSlider />

      {/* All Items Feed */}
      <div className="px-2 py-3">
        <h2 className="text-lg font-bold my-3 text-center text-gray-900 dark:text-gray-200">
          最新の投稿
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
          {items.map((item) => {
            if (item.postType === 'spot') {
              return <SpotCard key={item.id} spot={item.originalData as SpotData} />;
            }
            return <PostCard key={item.id} post={item} />;
          })}
        </div>
      </div>
      <RecentSpotsSlider />
    </>
  );
}
