'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  doc, 
  getDoc, 
  serverTimestamp, 
  setDoc, 
  collection, 
  DocumentData, 
  query, 
  where, 
  getDocs, 
  orderBy,
  updateDoc,
} from 'firebase/firestore';
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
// import SpotsSection from './post-form/SpotsSection';
import CostsSection from './post-form/CostsSection';
import OtherInfoSection from './post-form/OtherInfoSection';
import ImageUploadSection from './post-form/ImageUploadSection';
import CategorySection from './post-form/CategorySection';

const initialFormData: PostFormData = {
  content: '',
  authorId: '',
  authorName: '',
  authorImage: '',
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
  const [navigationUrl, setNavigationUrl] = useState<string | null>(null);
  const [userPosts, setUserPosts] = useState<Partial<PostFormData>[]>([]);
  const [selectedParentPostId, setSelectedParentPostId] = useState<string | null>(null);
  const [loadingUserPosts, setLoadingUserPosts] = useState(false);

  useEffect(() => {
    const fetchUserDataAndPost = async () => {
      if (!user) return;
      setIsFetching(true);

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        const userProfile = userDocSnap.exists() ? userDocSnap.data() : null;

        if (isEditMode && postId && collectionName) {
          const postDocRef = doc(db, collectionName, postId);
          const postDocSnap = await getDoc(postDocRef);

          if (postDocSnap.exists()) {
            const postData = postDocSnap.data();
            const normalizedData = normalizeOldPostToFormData(postData);

            setFormData({
              ...initialFormData,
              ...normalizedData,
              id: postId,
              authorId: user.uid,
              authorName: userProfile?.nickname || user.displayName || '',
              authorImage: userProfile?.avatarUrl || user.photoURL || '',
              visitedCountries: postData.visitedCountries || userProfile?.visitedCountries?.map((c: any) => c.name) || [],
              overseasMatchCount: postData.overseasMatchCount || userProfile?.overseasMatchCount || '',
              travelFrequency: postData.travelFrequency || userProfile?.travelFrequency || '',
            });
          } else {
            setMessage('投稿が見つかりませんでした。');
          }
        } else {
          setFormData(prev => ({
            ...prev,
            authorId: user.uid,
            authorName: userProfile?.nickname || user.displayName || '',
            authorImage: userProfile?.avatarUrl || user.photoURL || '',
            visitedCountries: userProfile?.visitedCountries?.map((c: any) => c.name) || [],
            overseasMatchCount: userProfile?.overseasMatchCount || '',
            travelFrequency: userProfile?.travelFrequency || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('データの取得中にエラーが発生しました。');
      } finally {
        setIsFetching(false);
      }
    };

    const fetchUserPosts = async () => {
      if (!user) return;
      setLoadingUserPosts(true);
      try {
        const postsQuery = query(
          collection(db, 'posts'),
          where('authorId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(postsQuery);
        const posts = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as PostFormData));
        setUserPosts(posts);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoadingUserPosts(false);
      }
    };

    if (user) {
      fetchUserDataAndPost();
      fetchUserPosts();
    } else if (!authLoading) {
      router.push('/login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, postId, collectionName]);

  const handlePostTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPostType = e.target.value as 'new' | 'additional';
    setFormData(prev => ({ ...prev, postType: newPostType }));
    if (newPostType === 'new') {
      setSelectedParentPostId(null);
      setFormData(prev => ({ ...prev, parentPostId: undefined }));
    }
  };

  const handleParentPostChange = (option: { value: string; label: string } | null) => {
    setSelectedParentPostId(option ? option.value : null);
    if (option) {
      const selectedPost = userPosts.find(p => p.id === option.value);
      if (selectedPost) {
        const normalizedData = normalizeNewPostToFormData(selectedPost as Post);
        setFormData(prev => ({
          ...initialFormData,
          ...prev,
          ...normalizedData,
          parentPostId: selectedPost.id,
          id: null,
          postType: 'add',
          travelStartDate: normalizedData.travelStartDate || '',
          travelEndDate: normalizedData.travelEndDate || '',
          visitedCities: normalizedData.visitedCities || [],
          transports: normalizedData.transports || [],
          hotels: normalizedData.hotels || [],
          spots: normalizedData.spots || [],
          costs: normalizedData.costs || [],
          belongings: normalizedData.belongings || '',
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        parentPostId: undefined,
        travelStartDate: '',
        travelEndDate: '',
        visitedCities: [],
        transports: [],
        hotels: [],
        spots: [],
        costs: [],
        belongings: '',
      }));
    }
  };

  const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'default_preset');

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        } else {
          throw new Error('Image upload failed, no secure_url returned.');
        }
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
      }
    }
    return uploadedUrls;
  };

  const handleSubmit = async (submissionStatus: 'published' | 'draft') => {
    if (!user) {
      setMessage('ログインが必要です。');
      return;
    }

    if (!formData.match) {
      setMessage('試合情報が不足しています。');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const uploadedImageUrls = await uploadImagesToCloudinary(formData.imageFiles);
      const finalImageUrls = [...formData.existingImageUrls, ...uploadedImageUrls];

      const postDoc: Omit<Post, 'id' | 'createdAt' | 'updatedAt'> & { updatedAt: any, createdAt?: any } = {
        authorId: user.uid,
        authorName: formData.authorName || '',
        authorImage: formData.authorImage || '',
        postType: formData.postType,
        parentPostId: formData.parentPostId || null,
        title: formData.title || '',
        status: submissionStatus,
        isPublic: submissionStatus === 'published',
        match: formData.match,
        travelStartDate: formData.travelStartDate || '',
        travelEndDate: formData.travelEndDate || '',
        visitedCities: formData.visitedCities || [],
        transports: formData.transports || [],
        outboundTotalDuration: formData.outboundTotalDuration || '',
        inboundTotalDuration: formData.inboundTotalDuration || '',
        hotels: formData.hotels || [],
        spots: formData.spots || [],
        costs: formData.costs || [],
        belongings: formData.belongings || '',
        goods: formData.goods || '',
        content: formData.content || formData.memories || '',
        firstAdvice: formData.message || '',
        youtubeUrl: formData.youtubeUrl || '',
        images: finalImageUrls,
        categories: formData.categories || [],
        likeCount: 0,
        helpfulCount: 0,
        updatedAt: serverTimestamp(),
        tags: [], // Add tags property
      };

      const docId = isEditMode && formData.id ? formData.id : uuidv4();
      const docRef = doc(db, 'posts', docId);

      if (isEditMode) {
        await updateDoc(docRef, postDoc);
        setMessage('投稿を更新しました。');
      } else {
        await setDoc(docRef, { ...postDoc, createdAt: serverTimestamp() });
        setMessage('投稿を作成しました。');
      }
      
      if (isEditMode) {
        // 編集モードの場合は、投稿詳細ページにリダイレクト
        router.push(`/posts/${docId}`);
      } else {
        // 新規作成の場合は、マイページにリダイレクト
        router.push('/mypage');
      }

    } catch (error) {
      console.error('Error submitting post:', error);
      setMessage(`エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectStyles = {
    control: (base: any) => ({ ...base, backgroundColor: 'var(--select-bg)', borderColor: 'var(--select-border)', color: 'var(--select-text)', '&:hover': { borderColor: 'var(--select-border-hover)' } }),
    option: (base: any, state: any) => ({ ...base, backgroundColor: state.isSelected ? 'var(--select-option-selected-bg)' : 'var(--select-option-bg)', color: state.isSelected ? 'var(--select-option-selected-text)' : 'var(--select-option-text)', '&:hover': { backgroundColor: 'var(--select-option-hover-bg)' } }),
    singleValue: (base: any) => ({ ...base, color: 'var(--select-text)' }),
    menu: (base: any) => ({ ...base, backgroundColor: 'var(--select-menu-bg)' }),
    input: (base: any) => ({ ...base, color: 'var(--select-text)' }),
  };

  if (authLoading || isFetching) {
    return <div className="flex justify-center items-center h-screen"><p>読み込み中...</p></div>;
  }

  return (
    <form className="space-y-8 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      {!isEditMode && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">投稿の種類を選択</h2>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="postType"
                value="new"
                checked={formData.postType === 'new'}
                onChange={handlePostTypeChange}
                className="form-radio h-4 w-4 text-blue-600 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">新規の旅行</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="postType"
                value="additional"
                checked={formData.postType === 'additional'}
                onChange={handlePostTypeChange}
                className="form-radio h-4 w-4 text-blue-600 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">過去の旅行に追加</span>
            </label>
          </div>
          {formData.postType === 'additional' && (
            <div className="mt-4">
              <label htmlFor="parentPost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">関連する過去の投稿</label>
              <Select
                id="parentPost"
                instanceId="parentPost-select"
                options={userPosts
                  .filter(p => p.id && p.title)
                  .map(p => ({ value: p.id!, label: `${p.match?.date || '日付不明'} - ${p.title!}` }))}
                onChange={handleParentPostChange}
                value={userPosts
                  .filter(p => p.id && p.title)
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

const normalizeOldPostToFormData = (oldData: DocumentData): Partial<PostFormData> => {
  // oldData.match が存在する場合、それを優先。なければ oldData 自体を試合情報のソースとして扱う
  const matchDataSource = oldData.match || oldData;

  const matchInfo: MatchInfo = {
    competition: matchDataSource.competition || '',
    season: matchDataSource.season || oldData.season || '',
    date: matchDataSource.date || '',
    kickoff: matchDataSource.kickoff || '',
    homeTeam: matchDataSource.homeTeam || matchDataSource.teamA || '',
    awayTeam: matchDataSource.awayTeam || matchDataSource.teamB || '',
    homeScore: String(matchDataSource.homeScore ?? ''),
    awayScore: String(matchDataSource.awayScore ?? ''),
    stadium: matchDataSource.stadium || '',
    ticketPrice: String(matchDataSource.ticketPrice ?? ''),
    ticketPurchaseRoute: matchDataSource.ticketPurchaseRoute || '',
    ticketPurchaseRouteUrl: matchDataSource.ticketPurchaseRouteUrl || '',
    ticketTeam: matchDataSource.ticketTeam || '',
    isTour: matchDataSource.isTour || false,
    isHospitality: matchDataSource.isHospitality || false,
    hospitalityDetail: matchDataSource.hospitalityDetail || '',
    seat: matchDataSource.seat || '',
    seatReview: matchDataSource.seatReview || '',
  };

  const imageUrls = oldData.imageUrls || (oldData.images ? (Array.isArray(oldData.images) ? oldData.images : [oldData.images]) : []);

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
    hotels: oldData.hotels || [],
    spots: oldData.spots || [],
    costs: oldData.costs || [],
    belongings: oldData.belongings || '',
    goods: oldData.goods || oldData.souvenirs || '',
    memories: oldData.memories || oldData.thoughts || '',
    message: oldData.message || oldData.firstAdvice || '',
    youtubeUrl: oldData.youtubeUrl || '',
    existingImageUrls: imageUrls,
    categories: oldData.categories || [],
    isPublic: oldData.isPublic !== undefined ? oldData.isPublic : true,
    postType: oldData.postType || 'new',
  };
};

const normalizeNewPostToFormData = (post: Post): Partial<PostFormData> => {
  return {
    id: post.id,
    title: post.title,
    status: post.isPublic ? 'published' : 'draft',
    match: post.match,
    travelStartDate: post.travelStartDate,
    travelEndDate: post.travelEndDate,
    visitedCities: post.visitedCities,
    transports: post.transports,
    hotels: post.hotels,
    spots: post.spots,
    costs: post.costs,
    belongings: post.belongings,
    goods: post.goods,
    memories: (post as any).memories, // Cast to any to access potential property
    message: (post as any).message, // Cast to any to access potential property
    youtubeUrl: post.youtubeUrl,
    existingImageUrls: post.images,
    categories: post.categories,
    isPublic: post.isPublic !== undefined ? post.isPublic : true,
    postType: (post as any).postType,
  };
};