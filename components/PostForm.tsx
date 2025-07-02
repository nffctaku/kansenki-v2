'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, serverTimestamp, setDoc, collection, DocumentData, query, where, orderBy, getDocs, writeBatch } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { PostFormData, MatchInfo, Post } from '@/types/post';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';

// Import section components
import BasicInfoSection from './post-form/BasicInfoSection';
import MatchInfoSection from './post-form/MatchInfoSection';
import TravelInfoSection from './post-form/TravelInfoSection';
import TicketInfoSection from './post-form/TicketInfoSection';
import AccommodationSection from './post-form/AccommodationSection';
import SpotsSection from './post-form/SpotsSection';
import CostsSection from './post-form/CostsSection';
import OtherInfoSection from './post-form/OtherInfoSection';
import ImageUploadSection from './post-form/ImageUploadSection';
import CategorySection from './post-form/CategorySection';

const initialFormData: PostFormData = {
  id: null,
  authorNickname: '',
  postType: 'new',
  parentPostId: undefined,
  title: '',
  isPublic: true,
  match: {
    competition: '',
    season: '',
    date: '',
    kickoff: '',
    homeTeam: '',
    awayTeam: '',
    homeScore: '',
    awayScore: '',
    stadium: '',
    ticketPrice: '',
    ticketPurchaseRoute: '',
    ticketPurchaseRouteUrl: '',
    ticketTeam: '',
    isTour: false,
    isHospitality: false,
    hospitalityDetail: '',
    seat: '',
    seatReview: '',
  },
  travelStartDate: '',
  travelEndDate: '',
  outboundTotalDuration: '',
  inboundTotalDuration: '',
  visitedCities: [],
  transports: [],
  hotels: [],
  spots: [],
  costs: [],
  belongings: '',
  goods: '',
  memories: '',
  message: '',
  imageFiles: [],
  existingImageUrls: [],
  categories: [],
};

interface PostFormProps {
  postId?: string;
}

export default function PostForm({ postId }: PostFormProps) {
  const [user, authLoading] = useAuthState(auth);
  const router = useRouter();
  const isEditMode = !!postId;

  const [formData, setFormData] = useState<PostFormData>(initialFormData);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isLegacyPost, setIsLegacyPost] = useState(false);
  const [navigationUrl, setNavigationUrl] = useState<string | null>(null);
  const [userPosts, setUserPosts] = useState<Partial<PostFormData>[]>([]);
  const [selectedParentPostId, setSelectedParentPostId] = useState<string | null>(null);
  const [loadingUserPosts, setLoadingUserPosts] = useState(false);



  useEffect(() => {
    if (navigationUrl) {
      router.push(navigationUrl);
    }
  }, [navigationUrl, router]);



    // Normalizes data from 'simple-posts' (legacy)
    const normalizeOldPostToFormData = (oldData: DocumentData): Partial<PostFormData> => {
        const oldMatch = (oldData.matches && oldData.matches[0]) || {};
        const matchInfo: MatchInfo = {
            competition: oldMatch.competition || '',
            season: oldData.season || oldMatch.season || '',
            date: oldMatch.date || '',
            kickoff: oldMatch.kickoff || '',
            homeTeam: oldMatch.homeTeam || oldMatch.teamA || '',
            awayTeam: oldMatch.awayTeam || oldMatch.teamB || '',
            homeScore: String(oldMatch.homeScore ?? ''),
            awayScore: String(oldMatch.awayScore ?? ''),
            stadium: oldMatch.stadium || '',
            ticketPrice: String(oldMatch.ticketPrice ?? ''),
            ticketPurchaseRoute: oldMatch.ticketPurchaseRoute || '',
            ticketPurchaseRouteUrl: oldMatch.ticketPurchaseRouteUrl || '',
            ticketTeam: oldMatch.ticketTeam || '',
            isTour: oldMatch.isTour || false,
            isHospitality: oldMatch.isHospitality || false,
            hospitalityDetail: oldMatch.hospitalityDetail || '',
            seat: oldMatch.seat || '',
            seatReview: oldMatch.seatReview || '',
        };

        const costs = oldData.cost ? Object.entries(oldData.cost).map(([category, amount]) => ({
            id: uuidv4(),
            category: category as string,
            amount: Number(amount) || 0,
        })) : [];

        const hotels = (oldData.hotels || []).map((h: any) => ({
            ...h,
            id: h.id || uuidv4(),
            comment: h.comment || h.review || '',
        }));

        const spots = (oldData.spots || []).map((s: any) => ({
            ...s,
            id: s.id || uuidv4(),
            description: s.description || s.review || '',
        }));

        return {
            title: oldData.title || '',
            isPublic: oldData.isPublic !== undefined ? oldData.isPublic : true,
            match: matchInfo,
            memories: oldData.content || '',
            message: oldData.firstAdvice || '',
            goods: oldData.goods || '',
            hotels: hotels,
            spots: spots,
            costs: costs,
            existingImageUrls: oldData.imageUrls || [],
        };
    };

    // Normalizes data from 'posts' (new)
    const normalizeNewPostToFormData = (post: Post): Partial<PostFormData> => {
        const match: MatchInfo = {
            competition: post.match?.competition || '',
            season: post.match?.season || '',
            date: post.match?.date || '',
            kickoff: post.match?.kickoff || '',
            homeTeam: post.match?.homeTeam || '',
            awayTeam: post.match?.awayTeam || '',
            homeScore: String(post.match?.homeScore ?? ''),
            awayScore: String(post.match?.awayScore ?? ''),
            stadium: post.match?.stadium || '',
            ticketPrice: post.match?.ticketPrice || '',
            ticketPurchaseRoute: post.match?.ticketPurchaseRoute || '',
            ticketPurchaseRouteUrl: post.match?.ticketPurchaseRouteUrl || '',
            ticketTeam: post.match?.ticketTeam || '',
            isTour: post.match?.isTour || false,
            isHospitality: post.match?.isHospitality || false,
            hospitalityDetail: post.match?.hospitalityDetail || '',
            seat: post.match?.seat || '',
            seatReview: post.match?.seatReview || '',
        };

        const hotels = (post.hotels || []).map((h: any) => ({
            ...h,
            id: h.id || uuidv4(),
            comment: h.comment || h.review || '', // Handle legacy 'review' field
        }));

        const spots = (post.spots || []).map((s: any) => ({
            ...s,
            id: s.id || uuidv4(),
            description: s.description || s.review || '', // Handle legacy 'review' field
        }));

        return {
            id: post.id,
            authorNickname: post.authorNickname || '',
            postType: post.postType || 'new',
            parentPostId: post.parentPostId,
            title: post.title || '',
            isPublic: post.isPublic !== undefined ? post.isPublic : true,
            match: match,
            travelStartDate: post.travelStartDate || '',
            travelEndDate: post.travelEndDate || '',
            visitedCities: post.visitedCities || [],
      outboundTotalDuration: post.outboundTotalDuration || '',
      inboundTotalDuration: post.inboundTotalDuration || '',
            transports: post.transports || [],
            hotels: hotels,
            spots: spots,
            costs: post.costs || [],
            belongings: post.belongings || '',
            goods: post.goods || '',
            memories: post.content || '',
            message: post.firstAdvice || '',
            existingImageUrls: post.imageUrls || [],
            categories: post.categories || [],
        };
    };



  // useEffect for fetching initial data (user & post for edit mode)
  useEffect(() => {
    const fetchUserDataAndPost = async () => {
        if (authLoading) return;
        if (!user) {
            router.push('/login');
            return;
        }

        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        const userNickname = userDocSnap.exists() ? userDocSnap.data().nickname : '';

        if (!isEditMode || !postId) {
            setFormData(prev => ({ ...initialFormData, authorNickname: userNickname, postType: 'new' }));
            setIsFetching(false);
            return;
        }

        setIsFetching(true);
        try {
            let normalizedData: Partial<PostFormData> | null = null;
            let postExists = false;

            // Check 'posts' collection
            const postRef = doc(db, 'posts', postId);
            const postSnap = await getDoc(postRef);
            if (postSnap.exists()) {
                postExists = true;
                setIsLegacyPost(false);
                const post = postSnap.data() as Post;
                if (post.authorId !== user.uid) {
                    setMessage('この投稿を編集する権限がありません。');
                    router.push('/');
                    return;
                }
                normalizedData = normalizeNewPostToFormData(post);
            } else {
                // Check 'simple-posts' collection
                const legacyPostRef = doc(db, 'simple-posts', postId);
                const legacyPostSnap = await getDoc(legacyPostRef);
                if (legacyPostSnap.exists()) {
                    postExists = true;
                    setIsLegacyPost(true);
                    const legacyPost = legacyPostSnap.data();
                    const authorField = legacyPost.uid || legacyPost.authorId;
                     if (authorField && authorField !== user.uid) {
                       setMessage('この投稿を編集する権限がありません。');
                       router.push('/');
                       return;
                    }
                    normalizedData = normalizeOldPostToFormData(legacyPost);
                }
            }

            if (postExists && normalizedData) {
                const finalMatch = {
                    ...initialFormData.match!,
                    ...(normalizedData.match || {}),
                } as MatchInfo;

                setFormData({
                    ...initialFormData,
                    ...normalizedData,
                    match: finalMatch,
                    id: postId,
                    authorNickname: userNickname,
                    imageFiles: [],
                });
            } else {
                setMessage('投稿が見つかりません。');
            }
        } catch (error) {
            console.error('データ取得エラー:', error);
            setMessage('データの読み込み中にエラーが発生しました。');
        } finally {
            setIsFetching(false);
        }
    };

    fetchUserDataAndPost();
  }, [postId, isEditMode, user, authLoading, router]);


  // useEffect for fetching user's posts for parent post selection
  useEffect(() => {
      const fetchUserPosts = async () => {
          if (!user) return;
          setLoadingUserPosts(true);
          try {
              // Fetch from 'posts'
              const postsQuery = query(
                  collection(db, 'posts'),
                  where('authorId', '==', user.uid),
                  orderBy('match.date', 'desc')
              );
              const postsSnapshot = await getDocs(postsQuery);
              const newPosts = postsSnapshot.docs.map(doc => normalizeNewPostToFormData({ id: doc.id, ...doc.data() } as Post));

              // Fetch from 'simple-posts'
              const legacyPostsQuery = query(
                  collection(db, 'simple-posts'),
                  where('uid', '==', user.uid),
                  orderBy('match_date', 'desc')
              );
              const legacyPostsSnapshot = await getDocs(legacyPostsQuery);
              const legacyPosts = legacyPostsSnapshot.docs.map(doc => normalizeOldPostToFormData({ id: doc.id, ...doc.data() }));
              
              // Combine and remove duplicates (preferring new posts)
              const allPosts = [...newPosts, ...legacyPosts];
              const uniquePosts = allPosts.filter((post, index, self) =>
                  index === self.findIndex((p) => (
                      p.id === post.id
                  ))
              );

              setUserPosts(uniquePosts);
          } catch (error) {
              console.error("ユーザーの投稿の取得に失敗しました:", error);
              setMessage("過去の投稿の読み込みに失敗しました。");
          } finally {
              setLoadingUserPosts(false);
          }
      };

      if (formData.postType === 'additional' && !isEditMode) {
          fetchUserPosts();
      }
  }, [formData.postType, user, isEditMode]);

  // useEffect to pre-fill form when a parent post is selected
  useEffect(() => {
      if (selectedParentPostId) {
          const parentPost = userPosts.find(p => p.id === selectedParentPostId);
          if (parentPost) {
              // Ensure nested objects are properly handled to avoid undefined errors
              const parentHotels = (parentPost.hotels || []).map((h: any) => ({
                  ...h,
                  id: h.id || uuidv4(),
                  comment: h.comment || h.review || '',
              }));
              const parentSpots = (parentPost.spots || []).map((s: any) => ({
                  ...s,
                  id: s.id || uuidv4(),
                  description: s.description || s.review || '',
              }));

              setFormData(prevFormData => ({
                  ...initialFormData,
                  authorNickname: prevFormData.authorNickname,
                  postType: 'additional',
                  parentPostId: parentPost.id,
                  // Copy travel and cost related fields
                  travelStartDate: parentPost.travelStartDate || '',
                  travelEndDate: parentPost.travelEndDate || '',
                  visitedCities: parentPost.visitedCities || [],
                  transports: parentPost.transports || [],
                  hotels: parentHotels,
                  spots: parentSpots,
                  costs: parentPost.costs || [],
                  belongings: parentPost.belongings || '',
                  goods: parentPost.goods || '',
                  // Reset fields that should be unique for the new post
                  title: '',
                  match: initialFormData.match,
                  memories: '',
                  message: '',
                  imageFiles: [],
                  existingImageUrls: [],
                  categories: [],
                  id: null,
              }));
          }
      } else if (formData.postType === 'additional') {
          // If parent is deselected, reset the form but keep the 'additional' type
          setFormData(prev => ({
              ...initialFormData,
              postType: 'additional',
              authorNickname: prev.authorNickname,
          }));
      }
  }, [selectedParentPostId, userPosts]);

  const handlePostTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPostType = e.target.value as 'new' | 'additional';
      setFormData(prev => ({ ...initialFormData, authorNickname: prev.authorNickname, postType: newPostType }));
      if (newPostType === 'new') {
          setSelectedParentPostId(null);
          // userPosts are not cleared to avoid re-fetching if user toggles back
      }
  };

  const handleParentPostChange = (option: { value: string; label: string } | null) => {
      setSelectedParentPostId(option ? option.value : null);
  };

  const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
      if (!cloudName || !uploadPreset) {
        setMessage('Cloudinaryの設定がされていません。');
        throw new Error('Cloudinary configuration is missing.');
      }
    
      const uploadedImageUrls: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
    
        try {
          const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Cloudinary upload error:', errorData);
            throw new Error(`Cloudinary image upload failed: ${errorData.error.message}`);
          }
    
          const data = await response.json();
          uploadedImageUrls.push(data.secure_url);
        } catch (error) {
          console.error('Error uploading image:', error);
          // Continue to next image if one fails
        }
      }
      return uploadedImageUrls;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage('ログインしてください。');
      return;
    }
    if (!formData.title) {
      setMessage('タイトルは必須です。');
      return;
    }

    setIsSubmitting(true);
    setMessage('投稿処理中...');

    try {
      const newImageUrls = await uploadImagesToCloudinary(formData.imageFiles);
      const finalImageUrls = [...formData.existingImageUrls, ...newImageUrls];

      // Map form data to the Firestore Post schema
      const postData = {
        authorId: user.uid,
        authorNickname: formData.authorNickname,
        postType: formData.postType,
        parentPostId: formData.parentPostId || null,
        title: formData.title,
        isPublic: formData.isPublic,
        match: formData.match,
        travelStartDate: formData.travelStartDate,
        travelEndDate: formData.travelEndDate,
      outboundTotalDuration: formData.outboundTotalDuration || '',
      inboundTotalDuration: formData.inboundTotalDuration || '',
        visitedCities: formData.visitedCities,
        transports: formData.transports,
        hotels: formData.hotels,
        spots: formData.spots,
        costs: formData.costs,
        belongings: formData.belongings,
        goods: formData.goods,
        content: formData.memories, // Map 'memories' back to 'content'
        firstAdvice: formData.message, // Map 'message' back to 'firstAdvice'
        imageUrls: finalImageUrls,
        categories: formData.categories,
        updatedAt: serverTimestamp(),
      };

      const docId = isEditMode && postId ? postId : doc(collection(db, 'posts')).id;
      const postRef = doc(db, 'posts', docId);

      const dataToSave = isEditMode
        ? postData
        : { ...postData, createdAt: serverTimestamp() };

      await setDoc(postRef, dataToSave, { merge: true });

      if (isLegacyPost && postId) {
        // Optionally, delete the old post from 'simple-posts' after migration
        // const legacyPostRef = doc(db, 'simple-posts', postId);
        // await deleteDoc(legacyPostRef);
      }

      setMessage(isEditMode ? '投稿を更新しました！' : '投稿に成功しました！');
      setNavigationUrl(`/posts/${docId}`); // Trigger navigation via useEffect

    } catch (error) {
      console.error('投稿エラー:', error);
      setMessage(`エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isFetching) {
    return <div className="text-center p-10">読み込み中...</div>;
  }

  if (!user) {
    // Redirect will happen in useEffect, this is a fallback
    return null;
  }

  const selectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: '40px',
      padding: '8px',
      fontSize: '16px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      boxShadow: 'none',
    }),
    option: (base: any, state: any) => ({
      ...base,
      fontSize: '16px',
      padding: '8px',
      backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
      color: state.isFocused ? '#333' : '#666',
    }),
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-4 sm:p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{isEditMode ? '投稿を編集' : '観戦記を投稿'}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">観戦の記録を共有しましょう！</p>
      </div>

      {!isEditMode && (
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">投稿の種類</p>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="postType"
                  value="new"
                  checked={formData.postType === 'new'}
                  onChange={handlePostTypeChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">新規投稿</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="postType"
                  value="additional"
                  checked={formData.postType === 'additional'}
                  onChange={handlePostTypeChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">追加投稿</span>
              </label>
            </div>
          </div>

          {formData.postType === 'additional' && (
            <div className="w-full">
              <label htmlFor="parentPost-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                追加元の投稿を選択
              </label>
              <Select
                instanceId="parentPost-select"
                inputId="parentPost-select"
                options={userPosts
                  .filter(post => post.id && post.title)
                  .map(post => ({ value: post.id!, label: `${post.match?.date || '日付不明'} - ${post.title!}` }))
                }
                onChange={handleParentPostChange}
                value={userPosts
                  .filter(post => post.id && post.title)
                  .map(p => ({ value: p.id!, label: `${p.match?.date || '日付不明'} - ${p.title!}` }))
                  .find(o => o.value === selectedParentPostId)
                }
                isLoading={loadingUserPosts}
                isClearable
                placeholder="過去の投稿を選択..."
                noOptionsMessage={() => loadingUserPosts ? '読み込み中...' : '投稿が見つかりません'}
                styles={selectStyles}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                選択すると、旅程や費用などの情報が自動で引き継がれます。
              </p>
            </div>
          )}
        </div>
      )}

      <BasicInfoSection formData={formData} setFormData={setFormData} user={user} />
      <MatchInfoSection formData={formData} setFormData={setFormData} />
      <TicketInfoSection formData={formData} setFormData={setFormData} />
      <TravelInfoSection formData={formData} setFormData={setFormData} />
      <AccommodationSection formData={formData} setFormData={setFormData} />
      <SpotsSection formData={formData} setFormData={setFormData} />
      <CostsSection formData={formData} setFormData={setFormData} />
      <OtherInfoSection formData={formData} setFormData={setFormData} />
      <ImageUploadSection formData={formData} setFormData={setFormData} />
      <CategorySection formData={formData} setFormData={setFormData} />

      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl shadow-sm">
        <div className="flex items-center">
          <input
            id="isPublic"
            type="checkbox"
            checked={formData.isPublic}
            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isPublic" className="ml-3 block text-md font-medium text-gray-700 dark:text-gray-200">
            この投稿を公開する
          </label>
        </div>
      </div>

      <div className="flex justify-end items-center space-x-4 pt-4">
        {message && <p className="text-sm text-red-500 dark:text-red-400">{message}</p>}
        <button
          type="submit"
          disabled={isSubmitting || !formData.title}
          className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '処理中...' : (isEditMode ? '更新する' : '投稿する')}
        </button>
      </div>
    </form>
  );
}