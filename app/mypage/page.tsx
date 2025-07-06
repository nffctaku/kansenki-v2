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
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6';

import { Post, MatchInfo } from '@/types/post';
import CollapsibleSection from '@/components/post-form/CollapsibleSection';
import { travelFrequencyOptions, countryOptions, overseasMatchCountOptions } from '@/components/data';




export default function MyPage() {
  useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
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
        
        const combined = [...newPostsData, ...oldPostsData];
        combined.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        setPosts(combined);
        setPostCollectionMap(newMap);
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
        const postRef = doc(db, collectionName, postId);

        // Delete 'likes' subcollection
        const likesCollectionRef = collection(postRef, 'likes');
        const likesSnapshot = await getDocs(likesCollectionRef);
        const deletePromises = likesSnapshot.docs.map((likeDoc) => deleteDoc(likeDoc.ref));
        await Promise.all(deletePromises);

        // Delete the post document itself
        await deleteDoc(postRef);

        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
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

      {/* あなたの投稿一覧 */}
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4 dark:text-white">あなたの投稿</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.filter(p => p.id).map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col">
              <a href={`/posts/${post.id}`}>
                <Image
                  src={post.images?.[0] || '/no-image.png'}
                  alt="観戦画像"
                  width={400}
                  height={400}
                  className="w-full aspect-square object-cover hover:opacity-90 transition"
                />
              </a>
              <div className="p-4 text-sm flex-grow leading-[1.1] space-y-[2px]">
                <p className="text-[12px] text-gray-400 dark:text-gray-500 leading-[1.1] m-0">
                  {post.match?.season || post.match?.date || '日付未設定'}
                </p>
                <p className="text-[13px] font-bold dark:text-gray-200 leading-[1.1] m-0">
                  {post.match?.competition || '大会名未入力'}
                </p>
                <p className="text-[13px] text-gray-800 dark:text-gray-300 leading-[1.1] m-0">
                  {post.match?.homeTeam || 'チームA'} vs {post.match?.awayTeam || 'チームB'}
                </p>
              </div>
              <div className="flex justify-between items-center px-4 pb-4">
                <a href={`/edit/${post.id}?collection=${postCollectionMap.get(post.id!) || ''}`} className="flex items-center gap-[4px] text-green-600 text-[12px] hover:underline">
                  <Image src="/えんぴつのアイコン素材.png" alt="編集" width={10} height={10} className="w-[10px] h-[10px] object-contain dark:invert" />
                  編集
                </a>
                <button
                  onClick={() => {
                    if (post.id) {
                      const collectionName = postCollectionMap.get(post.id);
                      if (collectionName) {
                        handleDelete(post.id, collectionName);
                      }
                    }
                  }}
                  className="flex items-center gap-[4px] text-red-600 text-[12px] hover:underline"
                >
                  <Image src="/ゴミ箱の無料アイコン.png" alt="削除" width={10} height={10} className="w-[10px] h-[10px] object-contain dark:invert" />
                  削除
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


