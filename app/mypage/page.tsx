'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6';

import CollapsibleSection from '@/components/post-form/CollapsibleSection';
import { travelFrequencyOptions, countryOptions, overseasMatchCountOptions } from '@/components/data';
import { SimplePost } from '@/types/match';
import { SpotData } from '@/components/SpotCard';
import PostGrid from './PostGrid';
import { UnifiedPost } from './types';

export default function MyPage() {
  useTheme();
  const [activeTab, setActiveTab] = useState('myPosts');
  const [combinedItems, setCombinedItems] = useState<UnifiedPost[]>([]);
  const [bookmarkedItems, setBookmarkedItems] = useState<UnifiedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [nickname, setNickname] = useState('');
  const [userId, setUserId] = useState('');
  const [uid, setUid] = useState('');
  const [xLink, setXLink] = useState('');
  const [noteLink, setNoteLink] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [travelFrequency, setTravelFrequency] = useState('');
  const [residence, setResidence] = useState('');
  const [overseasMatchCount, setOverseasMatchCount] = useState('');
  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);
  const [visitedStadiums, setVisitedStadiums] = useState<string[]>([]);
  const [favoriteClub, setFavoriteClub] = useState('');
  const router = useRouter();

  const [postCollectionMap, setPostCollectionMap] = useState(new Map<string, string>());
  const [authorProfiles, setAuthorProfiles] = useState<Map<string, { nickname: string; avatar: string }>>(new Map());



  const toUnifiedPost = useCallback((item: any, type: string): UnifiedPost | null => {
    if (!item || !item.id) return null;

    const post = item as any;
    const authorProfile = authorProfiles.get(post.author?.id);

    const basePost: Omit<UnifiedPost, 'postType' | 'href' | 'originalData' | 'subtext' | 'league' | 'country'> = {
      id: post.id,
      title: post.title || post.spotName || '無題',
      imageUrls: post.imageUrls || (post.imageUrl ? [post.imageUrl] : []) || (post.image_url ? [post.image_url] : []) || (post.images ? post.images : []),
      author: {
        id: post.author?.id || post.userId || '',
        nickname: authorProfile?.nickname || post.author?.name || '名無し',
        avatar: authorProfile?.avatar || post.author?.image || '/default-avatar.svg',
      },
      createdAt: post.createdAt instanceof Timestamp ? post.createdAt.toDate() : new Date(),
    };

    if (type === 'posts' || type === 'simple-posts') {
      return {
        ...basePost,
        postType: 'post',
        subtext: post.content?.substring(0, 50) || null,
        league: post.competition || post.league || '',
        href: `/posts/${post.id}`,
        originalData: post,
      };
    } else if (type === 'spots') {
      return {
        ...basePost,
        postType: 'spot',
        subtext: post.address || null,
        country: post.country || '',
        href: `/spots/${post.id}`,
        originalData: post,
      };
    }

    return null;
  }, [authorProfiles]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("✅ [MyPage] User is authenticated:", user.uid);
        setUid(user.uid);
        setLoading(true);
        try {
          // ユーザープロファイル取得
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            console.log("✅ [MyPage] User profile data fetched:", userData);
            setNickname(userData.nickname || '');
            setUserId(userData.id || '');
            setBio(userData.bio || '');
            setAvatarUrl(userData.avatarUrl || '');
            setFavoriteClub(userData.favoriteClub || '');
            setVisitedCountries(userData.visitedCountries || []);
            setVisitedStadiums(userData.visitedStadiums || []);
            setXLink(userData.socialLinks?.x || '');
            setNoteLink(userData.socialLinks?.note || '');
            setYoutubeLink(userData.socialLinks?.youtube || '');
            setInstagramLink(userData.socialLinks?.instagram || '');
            setTravelFrequency(userData.travelFrequency || '');
            setOverseasMatchCount(userData.overseasMatchCount || '');
            if (userData.birthdate instanceof Timestamp) {
              setBirthdate(userData.birthdate.toDate());
            }
          } else {
            console.warn("⚠️ [MyPage] User profile not found in Firestore for UID:", user.uid);
          }

          // ユーザーの投稿を取得 (author.id に統一)
          console.log("🔄 [MyPage] Fetching user's own posts with author.id...");
          const collectionsToQuery = ['posts', 'simple-posts', 'simple-travels'];
          const allPosts: UnifiedPost[] = [];
          const newPostCollectionMap = new Map<string, string>();

          for (const collectionName of collectionsToQuery) {
            const q = query(collection(db, collectionName), where('author.id', '==', user.uid));
            const querySnapshot = await getDocs(q);
            const posts = querySnapshot.docs.map(doc => {
              const data = doc.data();
              if (!newPostCollectionMap.has(doc.id)) { // 重複を避ける
                newPostCollectionMap.set(doc.id, collectionName);
                return toUnifiedPost({ id: doc.id, ...data }, collectionName);
              }
              return null;
            }).filter((p): p is UnifiedPost => p !== null);
            allPosts.push(...posts);
          }

          allPosts.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
          console.log(`✅ [MyPage] Total unified posts: ${allPosts.length}`);
          setCombinedItems(allPosts);
          setPostCollectionMap(newPostCollectionMap);

          // ブックマークした投稿を取得
          console.log("🔄 [MyPage] Fetching bookmarked posts...");
          const bookmarksRef = collection(db, 'users', user.uid, 'bookmarks');
          const bookmarksSnap = await getDocs(bookmarksRef);
          console.log(`[MyPage] Found ${bookmarksSnap.size} bookmarks.`);
          const bookmarkedPosts: UnifiedPost[] = [];

          for (const bookmarkDoc of bookmarksSnap.docs) {
            const bookmark = bookmarkDoc.data();
            console.log(`[MyPage] Processing bookmark for postId: ${bookmark.postId}`);
            const postTypes = ['posts', 'simple-posts', 'simple-travels', 'spots'];
            for (const type of postTypes) {
              const postRef = doc(db, type, bookmark.postId);
              const postSnap = await getDoc(postRef);
              if (postSnap.exists()) {
                const post = toUnifiedPost({ id: postSnap.id, ...postSnap.data() }, type);
                if (post !== null) {
                  bookmarkedPosts.push(post);
                  break; // 次のブックマークへ
                }
              }
            }
          }
          
          bookmarkedPosts.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
          console.log(`✅ [MyPage] Total bookmarked posts: ${bookmarkedPosts.length}`);
          setBookmarkedItems(bookmarkedPosts);

        } catch (error) {
          console.error("❌ [MyPage] Error fetching data:", error);
          setMessage('データの取得に失敗しました。');
        } finally {
          console.log("🏁 [MyPage] Data fetching process finished.");
          setLoading(false);
        }
      } else {
        console.log("🚪 [MyPage] User not authenticated, redirecting to /login.");
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router, toUnifiedPost]);

  const handleDelete = async (postId: string) => {
    if (!uid) return;
    const collectionName = postCollectionMap.get(postId);
    if (!collectionName) {
      console.error('Collection for post not found');
      return;
    }

    if (window.confirm('本当にこの投稿を削除しますか？')) {
      try {
        await deleteDoc(doc(db, collectionName, postId));
        setCombinedItems(prevItems => prevItems.filter(item => item.id !== postId));
        console.log('Post deleted successfully');
      } catch (error) {
        console.error('Error deleting post: ', error);
      }
    }
  };

  const handleSave = async () => {
    if (!uid) return;
    setMessage('更新中...');

    let newAvatarUrl = avatarUrl;
    if (avatarFile) {
      try {
        newAvatarUrl = await uploadImage(avatarFile);
        setAvatarUrl(newAvatarUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        setMessage('画像のアップロードに失敗しました。');
        return;
      }
    }

    async function uploadImage(file: File): Promise<string> {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data.secure_url;
    }

    const userRef = doc(db, 'users', uid);
    const updatedData = {
      nickname,
      bio,
      socialLinks: { 
        twitter: xLink, 
        instagram: instagramLink, 
        youtube: youtubeLink, 
        note: noteLink 
      },
      residence,
      travelFrequency,
      overseasMatchCount,
      visitedCountries,
      avatarUrl: newAvatarUrl,
    };

    if (birthdate) {
      (updatedData as any).birthdate = Timestamp.fromDate(birthdate);
    }

    try {
      await updateDoc(userRef, updatedData);
      setMessage('プロフィールが更新されました！');
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      setMessage('プロフィールの更新に失敗しました。');
      console.error('Error updating profile: ', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };


  if (loading) return <div className="p-6 dark:text-white">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-gray-900 font-sans pb-48">
      <div className="flex justify-between items-center px-4 py-3 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
        <h1 className="text-lg font-bold dark:text-white">マイページ</h1>
      </div>

      {/* Public Profile View */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-6">
          {/* Avatar */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-lg">
            <Image
              src={avatarUrl || '/default-avatar.png'}
              alt="User Avatar"
              fill
              className="object-cover"
            />
          </div>
          {/* User Info */}
          <div className="flex-1 text-center sm:text-left mt-4 sm:mt-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{nickname}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{userId}</p>
            {/* Social Links */}
            <div className="flex justify-center sm:justify-start space-x-4 mt-2">
              {xLink && (
                <a href={xLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                  <FaXTwitter size={20} />
                </a>
              )}
              {instagramLink && (
                <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                  <FaInstagram size={20} />
                </a>
              )}
              {youtubeLink && (
                <a href={youtubeLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                  <FaYoutube size={20} />
                </a>
              )}
              {noteLink && (
                <a href={noteLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                  <span className="font-bold text-xl">note</span>
                </a>
              )}
            </div>
            {/* Bio */}
            <p className="text-gray-700 dark:text-gray-300 mt-4 whitespace-pre-wrap">{bio}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-center">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="font-bold text-xl text-blue-600 dark:text-blue-400">{visitedCountries.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">訪問国数</p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="font-bold text-xl text-blue-600 dark:text-blue-400">{overseasMatchCount || '0'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">海外観戦</p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="font-bold text-xl text-blue-600 dark:text-blue-400">{combinedItems.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">投稿数</p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="font-bold text-xl text-blue-600 dark:text-blue-400">{bookmarkedItems.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">ブックマーク</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Section */}
      <CollapsibleSection title="プロフィールを編集する">
        <div className="p-4 sm:p-6 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-inner">
          {/* Avatar Upload */}
          <div className="flex items-center space-x-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden">
              <Image
                src={avatarPreview || avatarUrl || '/default-avatar.png'}
                alt="Avatar Preview"
                fill
                className="object-cover"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setAvatarFile(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300 dark:hover:file:bg-gray-600"
            />
          </div>

          {/* Nickname */}
          <div className="space-y-2">
            <label htmlFor="nickname" className="text-sm font-semibold dark:text-gray-300">ニックネーム</label>
            <input type="text" id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border-none" />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-semibold dark:text-gray-300">自己紹介</label>
            <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border-none" />
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="xLink" className="text-sm font-semibold dark:text-gray-300">X (Twitter) リンク</label>
              <input type="url" id="xLink" value={xLink} onChange={(e) => setXLink(e.target.value)} className="w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border-none" />
            </div>
            <div className="space-y-2">
              <label htmlFor="instagramLink" className="text-sm font-semibold dark:text-gray-300">Instagram リンク</label>
              <input type="url" id="instagramLink" value={instagramLink} onChange={(e) => setInstagramLink(e.target.value)} className="w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border-none" />
            </div>
            <div className="space-y-2">
              <label htmlFor="youtubeLink" className="text-sm font-semibold dark:text-gray-300">YouTube リンク</label>
              <input type="url" id="youtubeLink" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} className="w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border-none" />
            </div>
            <div className="space-y-2">
              <label htmlFor="noteLink" className="text-sm font-semibold dark:text-gray-300">note リンク</label>
              <input type="url" id="noteLink" value={noteLink} onChange={(e) => setNoteLink(e.target.value)} className="w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border-none" />
            </div>
          </div>

          {/* Travel Stats */}
          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-gray-300">居住地</label>
            <select value={residence} onChange={(e) => setResidence(e.target.value)} className="w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border-none">
              {countryOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)} 
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-gray-300">海外旅行の頻度</label>
            <select value={travelFrequency} onChange={(e) => setTravelFrequency(e.target.value)} className="w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border-none">
              {travelFrequencyOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)} 
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-gray-300">海外観戦回数</label>
            <select value={overseasMatchCount} onChange={(e) => setOverseasMatchCount(e.target.value)} className="w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border-none">
              {overseasMatchCountOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)} 
            </select>
          </div>

          {/* 行ったことのある国 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-gray-300">行ったことのある国</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2 p-4 border rounded-md dark:border-gray-600">
              {countryOptions.map(option => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`country-${option.value}`}
                    value={option.value}
                    checked={visitedCountries.includes(option.value)}
                    onChange={(e) => {
                      const country = e.target.value;
                      setVisitedCountries(prev => 
                        prev.includes(country) 
                          ? prev.filter(c => c !== country) 
                          : [...prev, country]
                      );
                    }}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`country-${option.value}`} className="text-sm dark:text-gray-300">{option.label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* ボタン */}
          <div className="flex justify-end items-center space-x-4 pt-4">
            <button onClick={handleSave} className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition">
              保存する
            </button>
            <button onClick={handleLogout} className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600 transition">
              ログアウト
            </button>
          </div>

          {message && <p className="text-sm text-green-600 dark:text-green-400 text-center pt-2">{message}</p>}
        </div>
      </CollapsibleSection>

      {/* タブ */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 px-4" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('myPosts')}
            className={`${activeTab === 'myPosts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            あなたの投稿
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`${activeTab === 'bookmarks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            aria-current={activeTab === 'bookmarks' ? 'page' : undefined}
          >
            保存した投稿
          </button>
        </nav>
      </div>

      {/* 投稿一覧 */}
      <div className="p-4">
        {activeTab === 'myPosts' ? (
          <PostGrid items={combinedItems} showDeleteButton={true} onDelete={handleDelete} />
        ) : (
          <PostGrid items={bookmarkedItems} showDeleteButton={false} />
        )}
      </div>

      {/* がっつり余白 */}
      <div className="h-48" />
    </div>
  );
}
