'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { UnifiedPost } from '../../types/post';
import PostCard from '../PostCard';

const Tabs = ({ tabs, activeTab, setActiveTab }: { tabs: { name: string, label: string }[], activeTab: string, setActiveTab: (tab: string) => void }) => (
  <div className="border-b border-gray-200 dark:border-gray-700">
    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => setActiveTab(tab.name)}
          className={`${
            activeTab === tab.name
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
);

const PostGrid = ({ posts, handleDelete, isBookmark, refetchPosts }: { posts: UnifiedPost[], handleDelete: (id: string) => Promise<void>, isBookmark: boolean, refetchPosts: () => void }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3 mt-6">
    {posts.length > 0 ? (
      posts.map((post) => (
        <div key={post.id} className="flex flex-col">
          <PostCard post={post} />
          {!isBookmark && (
            <div className="flex items-center gap-2 mt-2">
              {post.editHref && (
                <Link href={post.editHref} passHref className="flex-1">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setTimeout(refetchPosts, 1000)}>編集</Button>
                </Link>
              )}
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={async () => {
                await handleDelete(post.id);
                refetchPosts();
              }}
              >
                削除
              </Button>
            </div>
          )}
        </div>
      ))
    ) : (
      <p className="dark:text-white text-center mt-6 col-span-full">{isBookmark ? 'ブックマークはありません。' : '投稿はありません。'}</p>
    )}
  </div>
);

type UserPostsTabsProps = {
    userPosts: UnifiedPost[];
    bookmarkedPosts: UnifiedPost[];
    handleDelete: (id: string) => Promise<void>;
    refetchPosts: () => void;
};

export const UserPostsTabs = ({ userPosts, bookmarkedPosts, handleDelete, refetchPosts }: UserPostsTabsProps) => {
    const [activeTab, setActiveTab] = useState('posts');

    return (
        <div className="mt-8">
            <Tabs 
                tabs={[{name: 'posts', label: '投稿'}, {name: 'bookmarks', label: 'ブックマーク'}]}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            {activeTab === 'posts' && <PostGrid posts={userPosts} handleDelete={handleDelete} isBookmark={false} refetchPosts={refetchPosts} />}
            {activeTab === 'bookmarks' && <PostGrid posts={bookmarkedPosts} handleDelete={async () => {}} isBookmark={true} refetchPosts={refetchPosts} />}
        </div>
    );
};
