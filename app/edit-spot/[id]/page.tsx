'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import StarRating from '@/components/StarRating';
import { teamsByCountry } from '@/lib/teamData';
import { useAuthState } from 'react-firebase-hooks/auth';

interface SpotData {
  spotName: string;
  url: string;
  comment: string;
  rating: number;
  country: string;
  category: string;
  imageUrls: string[];
}

const EditSpotPage = () => {
  const router = useRouter();
  const params = useParams();
  const spotId = params.id as string;
  const [user] = useAuthState(auth);

  const [spot, setSpot] = useState<SpotData | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSpot = useCallback(async () => {
    if (!spotId) return;
    setLoading(true);
    try {
      const spotRef = doc(db, 'spots', spotId);
      const spotSnap = await getDoc(spotRef);

      if (spotSnap.exists()) {
        const spotData = spotSnap.data() as SpotData;
        setSpot(spotData);
      } else {
        setError('指定されたスポットが見つかりません。');
      }
    } catch (err) {
      console.error('Error fetching spot:', err);
      setError('スポットの読み込み中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  }, [spotId]);

  useEffect(() => {
    fetchSpot();
  }, [fetchSpot]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (spot) {
      setSpot({ ...spot, [name]: value });
    }
  };

  const handleRatingChange = (newRating: number) => {
    if (spot) {
      setSpot({ ...spot, rating: newRating });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if ((spot?.imageUrls.length || 0) + imageFiles.length + files.length > 5) {
        alert('画像は最大5枚までアップロードできます。');
        return;
      }
      setImageFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (imageUrlToRemove: string) => {
    if (!spot) return;
    if (window.confirm('この画像を削除しますか？（注意：すぐに反映されます）')) {
      const updatedImageUrls = spot.imageUrls.filter(url => url !== imageUrlToRemove);
      setSpot({ ...spot, imageUrls: updatedImageUrls });
    }
  };

  const uploadImagesToCloudinary = async (files: File[]) => {
    const imageUrls: string[] = [];
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        imageUrls.push(data.secure_url);
      } catch (err) {
        console.error('Cloudinaryへの画像アップロードに失敗しました。', err);
        throw new Error('画像アップロード失敗');
      }
    }
    return imageUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spot || !user) {
      setError('データが不足しているか、認証されていません。');
      return;
    }
    if (!spot.spotName || !spot.comment || spot.rating === 0) {
      alert('スポット名、コメント、評価は必須です。');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let newImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        newImageUrls = await uploadImagesToCloudinary(imageFiles);
      }

      const updatedImageUrls = [...spot.imageUrls, ...newImageUrls];

      const spotRef = doc(db, 'spots', spotId);
      await updateDoc(spotRef, {
        ...spot,
        imageUrls: updatedImageUrls,
        updatedAt: serverTimestamp(),
      });

      alert('スポット情報を更新しました！');
      router.push('/mypage');
    } catch (err) {
      console.error('更新エラー:', err);
      setError('スポットの更新に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">読み込み中...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!spot) return <div className="text-center mt-8">スポットデータが見つかりません。</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">おすすめスポットを編集</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="spotName" className="font-semibold">スポット名（必須）</Label>
          <Input id="spotName" name="spotName" value={spot.spotName} onChange={handleInputChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="font-semibold">国（必須）</Label>
          <select id="country" name="country" value={spot.country} onChange={handleInputChange} required className="w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border-none">
            {Object.keys(teamsByCountry).map(country => <option key={country} value={country}>{country}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="font-semibold">カテゴリー（必須）</Label>
          <select id="category" name="category" value={spot.category} onChange={handleInputChange} required className="w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border-none">
            {['レストラン', 'カフェ', 'バー', 'パブ', '観光地', 'フォトスポット'].map(category => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>

        <div>
          <Label htmlFor="url" className="font-semibold">GoogleマップのURL（任意）</Label>
          <Input id="url" name="url" type="url" value={spot.url} onChange={handleInputChange} placeholder="https://maps.app.goo.gl/..." />
        </div>

        <div>
          <Label htmlFor="comment" className="font-semibold">コメント（必須・100文字以内）</Label>
          <Textarea id="comment" name="comment" value={spot.comment} onChange={handleInputChange} placeholder="ここで試合後にファンと盛り上がれた！など" maxLength={100} required className="h-32" />
          <p className="text-sm text-muted-foreground text-right mt-1">{spot.comment.length} / 100</p>
        </div>

        <div className="space-y-2">
          <Label className="font-semibold">サムネイル画像（最大5枚）</Label>
          <div className="mt-2 flex flex-wrap gap-4">
            {spot.imageUrls.map((url, index) => (
              <div key={`existing-${index}`} className="relative group w-48 h-32">
                <Image src={url} alt={`既存の画像 ${index + 1}`} fill className="object-cover rounded-lg" sizes="12rem" />
                <button type="button" onClick={() => handleRemoveExistingImage(url)} className="absolute top-1.5 right-1.5 bg-red-600/75 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold transition-all z-10">
                  ✕
                </button>
              </div>
            ))}
            {imagePreviews.map((preview, index) => (
              <div key={`new-${index}`} className="relative group w-48 h-32">
                <Image src={preview} alt={`プレビュー画像 ${index + 1}`} fill className="object-cover rounded-lg" sizes="12rem" />
                <button type="button" onClick={() => handleRemoveNewImage(index)} className="absolute top-1.5 right-1.5 bg-red-600/75 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold transition-all z-10">
                  ✕
                </button>
              </div>
            ))}
            {((spot?.imageUrls.length || 0) + imageFiles.length) < 5 && (
              <label className="flex flex-col items-center justify-center w-48 h-32 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-center text-gray-500 dark:text-gray-400"><span className="font-semibold">画像を追加</span></p>
                </div>
                <input id="spot-image" type="file" onChange={handleFileChange} className="hidden" accept="image/*" multiple />
              </label>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-semibold">評価（必須）</Label>
          <StarRating rating={spot.rating} setRating={handleRatingChange} />
        </div>

        <Button type="submit" disabled={loading || isSubmitting} className="w-full !mt-8 font-bold py-6 text-base">
          {isSubmitting ? '更新中...' : '更新する'}
        </Button>
      </form>
    </div>
  );
};

export default EditSpotPage;
