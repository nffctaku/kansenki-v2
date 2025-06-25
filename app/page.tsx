'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { teamsByCountry } from '../lib/teamData';
import { Heart } from 'lucide-react';

type MatchInfo = {
  teamA: string;
  teamB: string;
  competition: string;
  season: string;
  nickname: string;
  stadium?: string;
  seat?: string;
  seatReview?: string;
  ticketPrice?: string;
};

type Travel = {
  id: string;
  imageUrls: string[];
  season: string;
  title?: string;
  author?: string;
  league?: string;
  homeTeam?: string;
  awayTeam?: string;
  matches?: MatchInfo[];
  likeCount?: number;
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allPosts, setAllPosts] = useState<Travel[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<Travel[]>([]);
  const [teamNameSuggestions, setTeamNameSuggestions] = useState<{ [key: string]: string[] }>({});

  const [isLoading, setIsLoading] = useState(true);

  // 全投稿を取得
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'simple-posts'));
        const data: Travel[] = snapshot.docs.map((doc) => {
          const d = doc.data();
          const matches = Array.isArray(d.matches) ? d.matches : [];
          const homeTeam = matches[0]?.teamA ?? '';
          const awayTeam = matches[0]?.teamB ?? '';

          return {
            id: doc.id,
            imageUrls: d.imageUrls ?? [],
            season: d.season ?? '',
            title: d.episode ?? '',
            author: d.nickname ?? '',
            league: matches[0]?.competition ?? '',
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            matches: matches,
            likeCount: d.likeCount ?? 0,
          };
        });
        const reversedData = data.reverse();
        setAllPosts(reversedData);
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
      const filteredPosts = allPosts.filter(post =>
        post.homeTeam?.toLowerCase().includes(query) ||
        post.awayTeam?.toLowerCase().includes(query) ||
        post.league?.toLowerCase().includes(query)
      );
      setDisplayedPosts(filteredPosts);
    } else {
      setDisplayedPosts(allPosts.slice(0, 5));
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
      <div className="m-3 bg-white rounded-xl shadow p-5">
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4 text-gray-900">観戦記を探す</h2>
          <div className="mx-auto w-full max-w-[280px] relative">
            <input
              type="text"
              placeholder="チーム名または大会名を入力"
              value={searchQuery}
              onChange={handleSearchChange}
              autoComplete="off"
              className="w-full p-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {Object.keys(teamNameSuggestions).length > 0 && (
              <div className="absolute mt-1 w-full z-10">
                <ul className="text-left list-none m-0 p-0 bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                  {Object.entries(teamNameSuggestions).map(([country, teams]) => (
                    <React.Fragment key={country}>
                      <li className="p-2 font-bold text-gray-500 bg-gray-100 sticky top-0">{country}</li>
                      {teams.map((team) => (
                        <li key={team} onClick={() => handleSuggestionClick(team)} className="p-3 cursor-pointer hover:bg-blue-100">
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
        <h2 className="text-lg font-bold my-3 text-center text-gray-900">
          {searchQuery.trim() === '' ? '最新の投稿' : '検索結果'}
        </h2>
        <div className="divide-y divide-gray-200">
          {displayedPosts.map((post) => (
            <div key={post.id} className="py-4">
              <div className="flex items-start justify-between space-x-4">
                <div className="flex-1 min-w-0">
                  <Link href={`/posts/${post.id}`} className="no-underline">
                    <p className="truncate text-sm font-bold text-gray-900">
                      ({post.season}) {post.homeTeam} vs {post.awayTeam} - {post.title}
                    </p>
                  </Link>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <Heart className="h-3 w-3 mr-1 flex-shrink-0 text-blue-500" fill="currentColor" />
                    <span className="truncate">{post.likeCount ?? 0} {post.author}</span>
                  </div>
                </div>
                <div className="w-24 h-16 flex-shrink-0">
                  {post.imageUrls && post.imageUrls.length > 0 && (
                    <Link href={`/posts/${post.id}`}>
                      <Image
                        src={post.imageUrls[0]}
                        alt={post.title || 'Post image'}
                        width={96}
                        height={64}
                        className="h-full w-full rounded-md object-cover"
                      />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
