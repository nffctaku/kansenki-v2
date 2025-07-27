'use client';

import { useEffect, useState } from 'react';
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
  writeBatch
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6';

import { Timestamp } from 'firebase/firestore';
import { Post, MatchInfo } from '@/types/post';
import CollapsibleSection from '@/components/post-form/CollapsibleSection';
import { travelFrequencyOptions, countryOptions, overseasMatchCountOptions } from '@/components/data';
import StarRating from '@/components/StarRating';
import PostCard from '@/components/PostCard';
import SpotCard, { SpotData } from '@/components/SpotCard';
import { SimplePost } from '@/types/match';

interface Spot {
  id: string;
  spotName: string;
  url: string;
  comment: string;
  rating: number; // for spot
  imageUrls: string[];
  userId: string;
  nickname: string;
  createdAt: Timestamp;
  country: string;
  category: string | null;
  type: 'spot' | 'hotel';
  // Hotel specific fields
  overallRating?: number;
  accessRating?: number;
  cleanlinessRating?: number;
  comfortRating?: number;
  facilityRating?: number;
  staffRating?: number;
  price?: number;
  bookingSite?: string;
  city?: string;
  nights?: number;
}




export default function MyPage() {
  useTheme();
  const [combinedItems, setCombinedItems] = useState<(SimplePost | SpotData)[]>([]);
  const [loading, setLoading] = useState(true);
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
  const router = useRouter();

  const [postCollectionMap, setPostCollectionMap] = useState(new Map<string, string>());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setNickname(userData.nickname || '');
          setUserId(userData.id || '');
          setXLink(userData.xLink || '');
          setNoteLink(userData.noteLink || '');
          setYoutubeLink(userData.youtubeUrl || '');
          setInstagramLink(userData.instagramLink || '');
          setBio(userData.bio || '');
          setTravelFrequency(userData.travelFrequency || '0');
          setResidence(userData.residence || '未選択');
          setOverseasMatchCount(userData.overseasMatchCount || '0');
          setVisitedCountries(userData.visitedCountries || []);
          setAvatarUrl(userData.avatarUrl || '');
        }

        const newMap = new Map<string, string>();

        // Fetch new posts from 'posts' collection
        const newPostsQuery = query(collection(db, 'posts'), where('authorId', '==', user.uid));
        const newPostsSnapshot = await getDocs(newPostsQuery);
        const newPostsData = newPostsSnapshot.docs.map((doc) => {
          newMap.set(doc.id, 'posts');
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            postType: 'new',
            images: data.images || data.imageUrls || data.existingImageUrls || [],
          } as unknown as Post;
        });

        // Fetch old posts from 'simple-posts' collection
        const oldPostsQuery = query(collection(db, 'simple-posts'), where('uid', '==', user.uid));
        const oldPostsSnapshot = await getDocs(oldPostsQuery);
        const oldPostsData = oldPostsSnapshot.docs.map((doc) => {
          newMap.set(doc.id, 'simple-posts');
          const data = doc.data();
          const matchData = data.matches && data.matches[0] ? data.matches[0] : {};
          const ticketData = data.ticket || {};

          const matchInfo: MatchInfo = {
            competition: matchData.competition || '',
            season: matchData.season || data.season || '',
            date: matchData.date || '',
            kickoff: matchData.kickoff || '',
            homeTeam: matchData.homeTeam || matchData.teamA || '',
            awayTeam: matchData.awayTeam || matchData.teamB || '',
            homeScore: matchData.homeScore ?? '',
            awayScore: matchData.awayScore ?? '',
            stadium: matchData.stadium || '',
            ticketPrice: ticketData.price || '',
            ticketPurchaseRoute: ticketData.purchaseRoute || '',
            ticketPurchaseRouteUrl: ticketData.purchaseRouteUrl || '',
            ticketTeam: ticketData.team || '',
            isTour: ticketData.isTour || false,
            isHospitality: ticketData.isHospitality || false,
            hospitalityDetail: ticketData.hospitalityDetail || '',
            seat: ticketData.seat || '',
            seatReview: ticketData.seatReview || '',
          };

          const post: Post = {
            id: doc.id,
            status: data.status || 'published',
            authorId: data.uid,
            authorNickname: data.nickname || '',
            isPublic: data.isPublic !== undefined ? data.isPublic : true,
            title: data.title || '',
            content: data.content || '',
            firstAdvice: data.firstAdvice || '',
            goods: data.goods || '',
            images: data.imageUrls || [],
            categories: data.categories || [],
            match: matchInfo,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt || data.createdAt,
            postType: 'simple',
            likeCount: data.likeCount || 0,
            helpfulCount: data.helpfulCount || 0,
          };

          return post;
        });
        
        const allPostsData = [...newPostsData, ...oldPostsData];

        const formattedPosts: SimplePost[] = allPostsData.map(p => ({
          ...p,
          id: p.id!,
          episode: p.title || '',
          author: p.authorNickname || nickname,
          authorId: p.authorId || uid,
          authorAvatar: avatarUrl, // Use the fetched avatarUrl
          league: p.match?.competition || '',
          matches: p.match ? [p.match] : [],
          imageUrls: p.images || [],
          createdAt: (p.createdAt as Timestamp)?.toDate() || new Date(),
          postType: 'new', // This might need adjustment based on simple/new post type
          type: 'post',
        }));

        const spotsQuery = query(collection(db, 'spots'), where('authorId', '==', user.uid));
        const spotsSnapshot = await getDocs(spotsQuery);
        const spotsData = spotsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const formattedSpots: SpotData[] = spotsData.map(s => ({
          ...s,
          author: s.nickname || nickname,
          authorAvatar: avatarUrl,
          createdAt: (s.createdAt as Timestamp)?.toDate() || new Date(),
        }));

        const combined = [...formattedPosts, ...formattedSpots];
        combined.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
        setCombinedItems(combined);

        setPostCollectionMap(newMap);

        console.log('Fetched Posts:', combined);
        console.log('Fetched Spots:', spotsData);

        setLoading(false);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleDelete = async (postId: string, collectionName: string) => {
    if (window.confirm('本当にこの投稿を削除しますか？')) {
      try {
        // Firestoreのドキュメント参照
        const postRef = doc(db, collectionName, postId);

        // 投稿に関連するコメントを一括削除 (一時的に無効化)
      /*
      const commentsQuery = query(collection(db, 'comments'), where('postId', '==', postId));
      const commentsSnapshot = await getDocs(commentsQuery);
      if (!commentsSnapshot.empty) {
        const batch = writeBatch(db);
        commentsSnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();
      }
      */

        // 投稿ドキュメント自体を削除
        await deleteDoc(postRef);

        // UIから削除
        setCombinedItems((prevItems) => prevItems.filter((item) => item.id !== postId));

        alert('投稿を削除しました。');
      } catch (error) {
        console.error('削除エラー:', error);
        alert('投稿の削除に失敗しました。');
      }
    }
  };

  const handleSave = async () => {
    if (!uid) return;
    setMessage('保存中...');

    let newAvatarUrl = avatarUrl;

    const uploadImage = async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'default_preset');
      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error.message || 'Image upload failed');
      }
      return data.secure_url;
    };

    try {
      if (avatarFile) {
        newAvatarUrl = await uploadImage(avatarFile);
      }

      const userRef = doc(db, 'users', uid);
      const dataToSave: { [key: string]: any } = {
        nickname,
        bio,
        xLink,
        instagramLink,
        youtubeUrl: youtubeLink,
        noteLink,
        residence,
        travelFrequency,
        overseasMatchCount,
        visitedCountries,
        avatarUrl: newAvatarUrl,
      };
      
      await updateDoc(userRef, dataToSave);

      setMessage('プロフィールを更新しました！');
      setAvatarFile(null); // Clear the file input after save
    } catch (error) {
      console.error('Error updating profile: ', error);
      setMessage('プロフィールの更新に失敗しました。');
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
          <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden flex-shrink-0 border-4 border-white dark:border-gray-800 shadow-md">
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
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
              {xLink && (
                <a href={xLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                  <FaXTwitter size={24} />
                </a>
              )}
              {instagramLink && (
                <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                  <FaInstagram size={24} />
                </a>
              )}
              {youtubeLink && (
                <a href={youtubeLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                  <FaYoutube size={24} />
                </a>
              )}
              {noteLink && (
                <a href={noteLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                  <span className="font-bold text-xl">note</span>
                </a>
              )}
            </div>
            {/* Bio */}
            {bio && <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap text-left">{bio}</p>}
          </div>
        </div>
        
        {/* Travel Stats */}
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="space-y-4">
              {residence && residence !== '未選択' && (
                  <div className="flex items-center">
                      <span className="w-32 text-sm font-medium text-gray-500 dark:text-gray-400">居住地</span>
                      <span className="text-sm text-gray-800 dark:text-gray-200">{residence}</span>
                  </div>
              )}
              {travelFrequency && travelFrequency !== '0' && (
                  <div className="flex items-center">
                      <span className="w-32 text-sm font-medium text-gray-500 dark:text-gray-400">観戦頻度</span>
                      <span className="text-sm text-gray-800 dark:text-gray-200">{travelFrequencyOptions.find(o => o.value === travelFrequency)?.label || travelFrequency}</span>
                  </div>
              )}
              {overseasMatchCount && overseasMatchCount !== '0' && (
                  <div className="flex items-center">
                      <span className="w-32 text-sm font-medium text-gray-500 dark:text-gray-400">海外観戦試合数</span>
                      <span className="text-sm text-gray-800 dark:text-gray-200">{overseasMatchCountOptions.find(o => o.value === overseasMatchCount)?.label || overseasMatchCount}</span>
                  </div>
              )}
              {visitedCountries && visitedCountries.length > 0 && (
                  <div className="flex items-start">
                      <span className="w-32 text-sm font-medium text-gray-500 dark:text-gray-400 pt-1">行ったことのある国</span>
                      <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">
                        {visitedCountries.map(country => countryOptions.find(c => c.value === country)?.label || country).join('、')}
                      </span>
                  </div>
              )}
            </div>
        </div>
      </div>

      <CollapsibleSection title="プロフィールを編集する">
        <div className="p-6 space-y-6">

          {/* プロフィール画像 */}
          <div className="space-y-2">
            <label className="block text-sm font-bold dark:text-gray-300">プロフィール画像</label>
            <div className="flex items-center gap-4">
              <div style={{ position: 'relative', width: '96px', height: '96px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                <Image
                  src={avatarPreview || avatarUrl || '/no-image.png'}
                  alt="Avatar"
                  fill
                  style={{ objectFit: 'cover' }}
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
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* ニックネーム */}
          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-gray-300">ニックネーム</label>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border-none" />
          </div>
          
          {/* ユーザーID */}
          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-gray-300">ユーザーID（@ID）</label>
            <div className="flex items-center w-full">
              <span className="text-gray-500 dark:text-gray-400 mr-1">@</span>
              <input type="text" value={userId} readOnly className="rounded-lg px-3 py-2 bg-gray-200 dark:bg-gray-800 dark:text-gray-400 focus:outline-none border-none w-full cursor-not-allowed" />
            </div>
          </div>

          {/* 自己紹介 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-gray-300">自己紹介</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full mt-1 rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border-none" rows={4}></textarea>
          </div>

          {/* SNSリンク */}
          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-gray-300">X (Twitter)</label>
            <input type="text" value={xLink} onChange={(e) => setXLink(e.target.value)} placeholder="https://twitter.com/your_id" className="w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-gray-300">Note</label>
            <input type="text" value={noteLink} onChange={(e) => setNoteLink(e.target.value)} placeholder="https://note.com/your_id" className="w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-gray-300">YouTube</label>
            <input type="text" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="https://youtube.com/channel/your_id" className="w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-gray-300">Instagram</label>
            <input type="text" value={instagramLink} onChange={(e) => setInstagramLink(e.target.value)} placeholder="https://instagram.com/your_id" className="w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border-none" />
          </div>

          {/* 海外観戦歴 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-gray-300">海外観戦歴</label>
            <select value={travelFrequency} onChange={(e) => setTravelFrequency(e.target.value)} className="w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border-none">
              {travelFrequencyOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-gray-300">居住地</label>
            <select value={residence} onChange={(e) => setResidence(e.target.value)} className="w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border-none">
              {countryOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
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
            <label className="text-sm font-semibold dark:text-gray-300">行ったことのある国（複数選択可）</label>
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

      {/* 投稿一覧 */}
      <div className="p-4">
        <div className="mb-6 mt-12">
          <h2 className="text-lg font-bold mb-4 dark:text-white">あなたの投稿一覧</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {combinedItems.map((item) => (
            <div key={item.id} className="relative group">
              {item.type === 'post' ? (
                <PostCard post={item as SimplePost} />
              ) : (
                <SpotCard spot={item as SpotData} />
              )}
              <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => handleDelete(item.id, item.type === 'post' ? postCollectionMap.get(item.id) || 'posts' : 'spots')}
                    className="bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
            </div>
          ))}
        </div>
      </div>

      {/* がっつり余白 */}
      <div className="h-48" />
    </div>
  );
}
