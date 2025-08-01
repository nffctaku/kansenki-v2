'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from 'firebase/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserPosts } from '@/hooks/useUserPosts';
import { UserProfileCard } from '@/components/user/UserProfileCard';
import { UserPostsTabs } from '@/components/user/UserPostsTabs';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

function MyPageContent({ user }: { user: User }) {
  const router = useRouter();
  const profileProps = useUserProfile(user);

  // useMemoを使用して、profilePropsの値が変更されたときだけ新しいオブジェクトを作成する
  // これにより、useUserPostsフックの無限ループを防ぐ
  const currentUserProfile = useMemo(() => {
    if (profileProps.loading) {
      return null;
    }
    return {
      nickname: profileProps.nickname,
      avatarUrl: profileProps.avatarUrl,
    };
  }, [profileProps.loading, profileProps.nickname, profileProps.avatarUrl]);

  // プロフィール情報が読み込まれた後に投稿を取得する
  const { combinedItems, bookmarkedItems, loading: postsLoading, handleDelete, refetch } = useUserPosts(user, currentUserProfile);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('ログアウトエラー', error);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
      <UserProfileCard {...profileProps} loading={profileProps.loading} />

      {/* プロフィールの読み込みが完了してから投稿セクションを表示 */}
      <div className="mt-8">
        {!profileProps.loading && (
          <UserPostsTabs 
            userPosts={combinedItems} 
            bookmarkedPosts={bookmarkedItems} 
            handleDelete={handleDelete} 
            refetchPosts={refetch}
          />
        )}
        {postsLoading && <div className="text-center p-4">投稿を読み込んでいます...</div>}
      </div>

      <div className="mt-8 text-center">
        <Button onClick={handleLogout} variant="outline">ログアウト</Button>
      </div>
    </div>
  );
}

// 認証状態のチェックとリダイレクトを担うメインコンポーネント
export default function MyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 認証状態のチェックが完了し、かつユーザーが存在しない場合のみリダイレクト
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // 認証状態が確認できるまでローディング表示
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">読み込み中...</div>;
  }

  // ユーザーが存在する場合のみコンテンツを表示
  if (user) {
    return <MyPageContent user={user} />;
  }

  // リダイレクトが実行されるまでの間、何も表示しない
  return null;
}
