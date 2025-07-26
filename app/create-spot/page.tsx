'use client';

import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { teamsByCountry } from '@/lib/teamData';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import StarRating from '@/components/StarRating';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

interface Spot {
  spotName: string;
  url: string;
  comment: string;
  rating: number;
  country: string;
  category: string;
}

const CreateSpotPage = () => {
  const [user, loading, error] = useAuthState(auth);
  const searchParams = useSearchParams();
  const type = searchParams.get('type');

  const [spot, setSpot] = useState<Spot>({
    spotName: '',
    url: '',
    comment: '',
    rating: 0,
    country: '',
    category: '',
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapUrl, setMapUrl] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSpot(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: 'country' | 'category') => (value: string) => {
    setSpot(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setSpot(prev => ({ ...prev, rating }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (newFiles) {
      setImageFiles(prevFiles => [...prevFiles, ...Array.from(newFiles)]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      console.error('Cloudinary configuration is missing.');
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
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    return results.filter((url): url is string => url !== null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      alert('ログインが必要です。');
      setIsSubmitting(false);
      return;
    }

    if (!spot.spotName || !spot.comment || spot.rating === 0 || !spot.country || !spot.category) {
      alert('必須項目をすべて入力してください。');
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        imageUrls = await uploadImagesToCloudinary(imageFiles);
        if (imageUrls.length !== imageFiles.length) {
          console.warn('Some images failed to upload.');
        }
      }

      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const authorNickname = userDocSnap.exists() ? userDocSnap.data().nickname : user.displayName;

      await addDoc(collection(db, 'spots'), {
        ...spot,
        imageUrls,
        authorId: user.uid,
        authorNickname: authorNickname || '匿名ユーザー',
        createdAt: new Date(),
      });

      alert('投稿が完了しました！');
      setSpot({
        spotName: '',
        url: '',
        comment: '',
        rating: 0,
        country: '',
        category: '',
      });
      setImageFiles([]);

    } catch (error) {
      console.error('Error submitting spot: ', error);
      alert('投稿中にエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageTitle = type === 'hotel' ? '宿泊先の投稿' : 'おススメスポットの投稿';

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{pageTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="country" className="font-semibold">国（必須）</Label>
                <Select onValueChange={handleSelectChange('country')} value={spot.country}>
                  <SelectTrigger>
                    <SelectValue placeholder="国を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(teamsByCountry).map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category" className="font-semibold">カテゴリー（必須）</Label>
                <Select onValueChange={handleSelectChange('category')} value={spot.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="カテゴリーを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {['レストラン', 'カフェ', 'バー', 'パブ', '観光地', 'フォトスポット'].map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="spotName" className="font-semibold">スポット名（必須）</Label>
              <Input id="spotName" name="spotName" value={spot.spotName} onChange={handleInputChange} placeholder="例：スタンフォードブリッジ周辺のカフェ" required />
            </div>

            <div>
              <Label htmlFor="url" className="font-semibold">GoogleマップのURL（任意）</Label>
              <Input id="url" name="url" type="url" value={spot.url} onChange={handleInputChange} placeholder="お店のウェブサイトや参考記事のURL" />
            </div>

            <div>
              <Label htmlFor="comment" className="font-semibold">コメント（必須・100文字以内）</Label>
              <Textarea id="comment" name="comment" value={spot.comment} onChange={handleInputChange} placeholder="ここで試合後にファンと盛り上がれた！など" maxLength={100} required className="h-32" />
              <p className="text-sm text-muted-foreground text-right mt-1">{spot.comment.length} / 100</p>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">サムネイル画像</Label>
              <div className="mt-2 flex flex-wrap gap-4">
                {imageFiles.map((file, index) => (
                  <div key={index} className="relative group w-48 h-32">
                    <Image src={URL.createObjectURL(file)} alt={`プレビュー画像 ${index + 1}`} fill className="object-cover rounded-lg" sizes="12rem" />
                    <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1.5 right-1.5 bg-red-600/75 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold transition-all z-10">
                      ✕
                    </button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center w-48 h-32 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-center text-gray-500 dark:text-gray-400"><span className="font-semibold">画像を追加</span></p>
                  </div>
                  <input id="spot-image" type="file" onChange={handleFileChange} className="hidden" accept="image/*" multiple />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">評価（必須）</Label>
              <StarRating rating={spot.rating} setRating={handleRatingChange} />
            </div>

            <Button type="submit" disabled={loading || isSubmitting} className="w-full !mt-8 font-bold py-6 text-base">
              {isSubmitting ? '投稿中...' : '投稿する'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};



export default CreateSpotPage;
