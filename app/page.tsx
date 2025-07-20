'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { teamsByCountry } from '../lib/teamData';

import { SimplePost } from '../types/match';
import LikeButton from '@/components/LikeButton';
import { format } from 'date-fns';
import AnnouncementBanner from './components/AnnouncementBanner';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
    const [allPosts, setAllPosts] = useState<SimplePost[]>([]);
    const [displayedPosts, setDisplayedPosts] = useState<SimplePost[]>([]);
  const [teamNameSuggestions, setTeamNameSuggestions] = useState<{ [key: string]: string[] }>({});

  const [isLoading, setIsLoading] = useState(true);

  // 全投稿を取得
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // Fetch from 'posts' (new format)
        const postsCollection = collection(db, 'posts');
        const qNew = query(postsCollection, where("isPublic", "==", true), orderBy('createdAt', 'desc'), limit(50));
        const snapshotNew = await getDocs(qNew);
        const newPosts: SimplePost[] = snapshotNew.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            imageUrls: d.images || d.imageUrls || d.existingImageUrls || [],
            season: d.match?.season ?? '',
            episode: d.title ?? '', // Using title as episode for consistency
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

        // Combine and remove duplicates, preferring new posts
        const combined = [...newPosts, ...legacyPosts];
        // Filter for posts that have at least one image
        const postsWithImages = combined.filter(p => p.imageUrls && p.imageUrls.length > 0);
        const uniquePosts = Array.from(new Map(postsWithImages.map(p => [p.id, p])).values());
        uniquePosts.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
        setAllPosts(uniquePosts.slice(0, 10));
      } catch (error) {
        console.error('投稿取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 検索クエリに基づいて表示する投稿を更新
  useEffect(() => {
    if (isLoading) {
      return;
    }

    const query = searchQuery.trim().toLowerCase();

    if (query) {
      const filteredPosts = allPosts.filter(post => {
        const match = post.matches && post.matches[0];
        return (
          (match && match.homeTeam?.toLowerCase().includes(query)) ||
          (match && match.awayTeam?.toLowerCase().includes(query)) ||
          post.league?.toLowerCase().includes(query)
        );
      });
      setDisplayedPosts(filteredPosts);
    } else {
      setDisplayedPosts(allPosts.slice(0, 10));
    }

    // チーム検索のサジェストを更新
    if (searchQuery.trim() === '') {
      setTeamNameSuggestions({});
    } else {
      const filteredSuggestions: { [key: string]: string[] } = {};
      for (const country in teamsByCountry) {
        const filteredTeams = teamsByCountry[country].filter(team =>
          team.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filteredTeams.length > 0) {
          filteredSuggestions[country] = filteredTeams;
        }
      }
      setTeamNameSuggestions(filteredSuggestions);
    }
  }, [searchQuery, allPosts, isLoading]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      const filteredSuggestions: { [key: string]: string[] } = {};
      for (const country in teamsByCountry) {
        const filteredTeams = teamsByCountry[country].filter(team =>
          team.toLowerCase().includes(query.toLowerCase())
        );
        if (filteredTeams.length > 0) {
          filteredSuggestions[country] = filteredTeams;
        }
      }
      setTeamNameSuggestions(filteredSuggestions);
    } else {
      setTeamNameSuggestions({});
    }
  };

  const handleSuggestionClick = (teamName: string) => {
    setSearchQuery(teamName);
    setTeamNameSuggestions({});
  };

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

      {/* Latest Posts Section */}
      <div className="p-3">
        <h2 className="text-lg font-bold my-3 text-center text-gray-900 dark:text-gray-200">
          {searchQuery.trim() === '' ? '最新の投稿' : '検索結果'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {displayedPosts.map((post) => {
            const postDate = post.createdAt ? format(post.createdAt, 'yyyy.MM.dd') : '';
            return (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col">
                <Link href={`/posts/${post.id}`} className="no-underline flex flex-col flex-grow">
                  <div className="w-full h-28 relative">
                    {post.imageUrls && post.imageUrls.length > 0 ? (
                      <Image
                        src={post.imageUrls[0]}
                        alt={post.episode || 'Post image'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700"></div>
                    )}
                    {post.league && (
                      <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-[10px] px-2 py-0.5 rounded-full">
                        {post.league}
                      </div>
                    )}
                  </div>
                  <div className="p-2 flex flex-col flex-grow">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-1 line-clamp-2">
                      {post.episode}
                    </p>
                    {post.matches && post.matches.length > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">
                        {post.matches[0].homeTeam} vs {post.matches[0].awayTeam}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span className="truncate font-medium text-gray-700 dark:text-gray-300">
                        {post.author}
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
    </>
  );
}
