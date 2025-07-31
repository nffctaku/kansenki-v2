'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, serverTimestamp, setDoc, collection, DocumentData, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { PostFormData, MatchInfo, Post } from '@/types/post';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';

// Import section components
import BasicInfoSection from './post-form/BasicInfoSection';
import MatchInfoSection from './post-form/MatchInfoSection';
import TravelInfoSection from './post-form/TravelInfoSection';
import TicketInfoSection from './post-form/TicketInfoSection';
// import AccommodationSection from './post-form/AccommodationSection';
// import SpotsSection from './post-form/SpotsSection';
import CostsSection from './post-form/CostsSection';
import OtherInfoSection from './post-form/OtherInfoSection';
import ImageUploadSection from './post-form/ImageUploadSection';
import CategorySection from './post-form/CategorySection';

const initialFormData: PostFormData = {
  id: null,
  postType: 'new',
  parentPostId: undefined,
  title: '',
  status: 'published',
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
  youtubeUrl: '',
  isPublic: true,
};

interface PostFormProps {
  postId?: string;
  collectionName?: string;
}

export default function PostForm({ postId, collectionName }: PostFormProps) {
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
      id: oldData.id,
      title: oldData.title || '',
      status: oldData.isPublic ? 'published' : 'draft',
      match: matchInfo,
      travelStartDate: oldData.travelStartDate || oldData.travel_start_date || '',
      travelEndDate: oldData.travelEndDate || oldData.travel_end_date || '',
      visitedCities: oldData.visitedCities || [],
      outboundTotalDuration: oldData.outboundTotalDuration || '',
      inboundTotalDuration: oldData.inboundTotalDuration || '',
      transports: oldData.transports || [],
      hotels: hotels,
      spots: spots,
      costs: costs,
      belongings: oldData.belongings || '',
      goods: oldData.goods || '',
      memories: oldData.content || '',
      message: oldData.firstAdvice || '',
      existingImageUrls: oldData.imageUrls || [],
    };
  };

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
      postType: post.postType || 'new',
      parentPostId: post.parentPostId,
      title: post.title || '',
      status: post.status,
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
      existingImageUrls: post.images || [],
      categories: post.categories || [],
    };
  };

  useEffect(() => {
    const fetchUserDataAndPost = async () => {
      if (authLoading) {
        setIsFetching(true);
        return;
      }
      if (!user) {
        router.push('/login');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!isEditMode || !postId) {
        setFormData({ ...initialFormData, postType: 'new' });
        setIsFetching(false);
        return;
      }

      if (!collectionName) {
        console.error("Collection name is missing in edit mode.");
        setMessage('投稿情報の読み込みに失敗しました。URLが正しくありません。');
        setIsFetching(false);
        return;
      }

      setIsFetching(true);
      try {
        const postRef = doc(db, collectionName, postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const postData = postSnap.data();
          
          const authorId = collectionName === 'posts' ? postData.authorId : postData.uid;
          if (authorId !== user.uid) {
            setMessage('この投稿を編集する権限がありません。');
            router.push('/mypage');
            return;
          }

          const normalizedData = collectionName === 'posts'
            ? normalizeNewPostToFormData(postData as Post)
            : normalizeOldPostToFormData(postData);

          setFormData({
            ...initialFormData,
            ...normalizedData,
            id: postId,
  
          });
          setIsLegacyPost(collectionName === 'simple-posts');

        } else {
          setMessage('投稿が見つかりませんでした。');
        }
      } catch (error) {
        console.error('投稿データの取得中にエラーが発生しました:', error);
        setMessage('投稿データの読み込みに失敗しました。');
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserDataAndPost();
  }, [postId, collectionName, isEditMode, user, authLoading, router]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return;

      setLoadingUserPosts(true);
      try {
        const postsQuery = query(
          collection(db, 'posts'),
          where('authorId', '==', user.uid)
        );
        const postsSnapshot = await getDocs(postsQuery);
        const newPosts = postsSnapshot.docs.map(doc => normalizeNewPostToFormData({ id: doc.id, ...doc.data() } as Post));

        const legacyPostsQueryByUid = query(
          collection(db, 'simple-posts'),
          where('uid', '==', user.uid)
        );
        const legacyPostsQueryByAuthorId = query(
          collection(db, 'simple-posts'),
          where('authorId', '==', user.uid)
        );

        const [legacyPostsSnapshotByUid, legacyPostsSnapshotByAuthorId] = await Promise.all([
          getDocs(legacyPostsQueryByUid),
          getDocs(legacyPostsQueryByAuthorId),
        ]);

        const legacyPostsByUid = legacyPostsSnapshotByUid.docs.map(doc => normalizeOldPostToFormData({ id: doc.id, ...doc.data() }));
        const legacyPostsByAuthorId = legacyPostsSnapshotByAuthorId.docs.map(doc => normalizeOldPostToFormData({ id: doc.id, ...doc.data() }));

        const allPosts = [...newPosts, ...legacyPostsByUid, ...legacyPostsByAuthorId];
        const uniquePosts = allPosts.filter((post, index, self) =>
          index === self.findIndex((p) => p.id === post.id)
        );

        uniquePosts.sort((a, b) => {
          const dateA = a.match?.date || '';
          const dateB = b.match?.date || '';
          if (dateA < dateB) return 1;
          if (dateA > dateB) return -1;
          return 0;
        });

        setUserPosts(uniquePosts);
      } catch (error) {
        console.error("ユーザーの投稿の取得に失敗しました:", error);
        setMessage("過去の投稿の読み込みに失敗しました。");
      } finally {
        setLoadingUserPosts(false);
      }
    };

    if (formData.postType === 'additional') {
      fetchUserPosts();
    } else {
      setUserPosts([]);
    }
  }, [formData.postType, user, isEditMode]);

  useEffect(() => {
    if (isEditMode) return;

    if (selectedParentPostId) {
      const parentPost = userPosts.find(p => p.id === selectedParentPostId);
      if (parentPost) {
        const parentHotels = (parentPost.hotels || []).map((h: any) => ({ ...h, id: h.id || uuidv4(), comment: h.comment || h.review || '' }));
        const parentSpots = (parentPost.spots || []).map((s: any) => ({ ...s, id: s.id || uuidv4(), description: s.description || s.review || '' }));

        setFormData({
          ...initialFormData,
          postType: 'additional',
          parentPostId: parentPost.id,
          travelStartDate: parentPost.travelStartDate || '',
          travelEndDate: parentPost.travelEndDate || '',
          visitedCities: parentPost.visitedCities || [],
          transports: parentPost.transports || [],
          hotels: parentHotels,
          spots: parentSpots,
          costs: parentPost.costs || [],
          belongings: parentPost.belongings || '',
          goods: parentPost.goods || '',
          title: '',
          match: initialFormData.match,
          memories: '',
          message: '',
          imageFiles: [],
          existingImageUrls: [],
          categories: [],
          id: null,
          status: parentPost.status ?? 'published',
        });
      }
    } else if (formData.postType === 'additional') {
      setFormData({
        ...initialFormData,
        postType: 'additional',
      });
    }
  }, [selectedParentPostId, userPosts, formData.postType, isEditMode]);

  const handlePostTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPostType = e.target.value as 'new' | 'additional';
    setFormData(prev => ({ ...initialFormData, postType: newPostType }));
    if (newPostType === 'new') {
      setSelectedParentPostId(null);
    }
  };

  const handleParentPostChange = (option: { value: string; label: string } | null) => {
    setSelectedParentPostId(option ? option.value : null);

    if (option) {
      const parentPost = userPosts.find(p => p.id === option.value);
      if (parentPost) {
        const parentHotels = (parentPost.hotels || []).map((h: any) => ({ ...h, id: uuidv4() }));
        const parentSpots = (parentPost.spots || []).map((s: any) => ({ ...s, id: uuidv4() }));
        const parentCosts = (parentPost.costs || []).map((c: any) => ({ ...c, id: uuidv4() }));
        const parentTransports = (parentPost.transports || []).map((t: any) => ({ ...t, id: uuidv4() }));
        const parentVisitedCities = (parentPost.visitedCities || []).map((city: any) => ({ ...city, id: uuidv4() }));

        setFormData(prevData => ({
          ...initialFormData,
          travelStartDate: parentPost.travelStartDate || '',
          travelEndDate: parentPost.travelEndDate || '',
          visitedCities: parentVisitedCities,
          outboundTotalDuration: parentPost.outboundTotalDuration || '',
          inboundTotalDuration: parentPost.inboundTotalDuration || '',
          transports: parentTransports,
          costs: parentCosts,
          belongings: parentPost.belongings || '',
          goods: parentPost.goods || '',
          hotels: parentHotels,
          spots: parentSpots,

          id: null,
          postType: 'additional',
          parentPostId: parentPost.id,
          status: parentPost.status ?? 'published',
          title: '',
          match: initialFormData.match,
          memories: '',
          message: '',
          imageFiles: [],
          existingImageUrls: [],
          categories: [],
        }));
      }
    } else {
      setFormData(prevData => ({
        ...initialFormData,
        postType: 'additional',
      }));
    }
  };

  const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      setMessage('Cloudinaryの設定がされていません。');
      throw new Error('Cloudinary configuration is missing.');
    }

    const uploadPromises = files.map(async (file) => {
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
        return data.secure_url;
      } catch (error) {
        console.error('Error uploading image:', error);
        setMessage(`画像のアップロードに失敗しました: ${file.name}`);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    return results.filter((url): url is string => url !== null);
  };

  const handleSubmit = async (submissionStatus: 'published' | 'draft') => {
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
      const postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'helpfulCount'> & { updatedAt: any, createdAt?: any } = {
        author: {
          id: user.uid,
          name: user.displayName || user.email || '名無し',
          image: user.photoURL || '',
        },
        postType: formData.postType,
        parentPostId: formData.parentPostId || null,
        title: formData.title,
        status: submissionStatus,
        match: formData.match || undefined,
        travelStartDate: formData.travelStartDate,
        travelEndDate: formData.travelEndDate,
        visitedCities: formData.visitedCities,
        outboundTotalDuration: formData.outboundTotalDuration,
        inboundTotalDuration: formData.inboundTotalDuration,
        transports: formData.transports,
        hotels: formData.hotels,
        spots: formData.spots,
        costs: formData.costs,
        belongings: formData.belongings ?? '',
        goods: formData.goods ?? '',
        content: formData.memories || '', // memories
        firstAdvice: formData.message || '', // message
        images: finalImageUrls,
        categories: formData.categories,
        youtubeUrl: formData.youtubeUrl ?? '',
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

  const selectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: '40px',
      padding: '8px',
      fontSize: '16px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#999',
      },
    }),
    option: (base: any, state: any) => ({
      ...base,
      fontSize: '16px',
      padding: '8px',
      backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
      color: state.isFocused ? '#333' : '#666',
    }),
  };

  if (authLoading || isFetching) {
    return <div className="text-center p-10">読み込み中...</div>;
  }

  if (!user) {
    return <div className="text-center p-10">ログインしてください。</div>;
  }

  return (
    <form className="space-y-8 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {!isEditMode && (
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
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
            </div>
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
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
            <div className="w-full mt-4">
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

            <div className="bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400 text-blue-700 dark:text-blue-300 p-4 my-6 rounded-md text-sm" role="alert">
        <p className="font-bold text-base mb-2">キャンペーン参加者様への投稿項目お知らせ</p>
        <p>現在開催中の投稿キャンペーンでは、</p>
        <div className="mt-2 pl-2 space-y-1">
          <p className="font-semibold">基本情報、観戦試合、画像、カテゴリー</p>
          <p className="font-semibold text-lg">+</p>
          <p><span className="font-semibold">『プレシーズンマッチ/アンフィールド』</span>投稿の場合は上記に加えて<span className="font-semibold">2項目</span></p>
          <p><span className="font-semibold">『ジャパンツアー』</span>投稿の場合は上記に加えて<span className="font-semibold">チケット情報、その他の情報</span></p>
        </div>
        <p className="mt-3">必須項目をご投稿前にご確認をお願いいたします。</p>
        <p className="text-xs mt-1">(なお、項目ごと全ての内容を入力する必要はありません。)</p>
      </div>
      <BasicInfoSection formData={formData} setFormData={setFormData} user={user} />
      <MatchInfoSection formData={formData} setFormData={setFormData} />
      <TicketInfoSection formData={formData} setFormData={setFormData} />
      <TravelInfoSection formData={formData} setFormData={setFormData} />
      {/* <AccommodationSection formData={formData} setFormData={setFormData} /> */}
      {/* <SpotsSection formData={formData} setFormData={setFormData} /> */}
      <CostsSection formData={formData} setFormData={setFormData} />
      <OtherInfoSection formData={formData} setFormData={setFormData} />
      <ImageUploadSection formData={formData} setFormData={setFormData} />
      <CategorySection formData={formData} setFormData={setFormData} />

      <div className="flex justify-end items-center space-x-4 pt-4">
        {message && <p className="text-sm text-red-500 dark:text-red-400">{message}</p>}
        <button
          type="button"
          onClick={() => handleSubmit('draft')}
          disabled={isSubmitting || !formData.title}
          className="inline-flex justify-center py-2 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          {isSubmitting ? '保存中...' : '下書き保存'}
        </button>
        <button
          type="button"
          onClick={() => handleSubmit('published')}
          disabled={isSubmitting || !formData.title}
          className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '処理中...' : (isEditMode ? '更新する' : '公開する')}
        </button>
      </div>
    </form>
  );
}