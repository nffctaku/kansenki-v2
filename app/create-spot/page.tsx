'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { teamsByCountry } from '@/lib/teamData';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StarRating from '../../components/StarRating';
import Image from 'next/image';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

interface Spot {
  spotName: string;
  url: string;
  comment: string;
  rating: number; // for spot
  overallRating?: number;
  accessRating?: number;
  cleanlinessRating?: number;
  comfortRating?: number;
  facilityRating?: number;
  staffRating?: number;
  country: string;
  category: string;
  price?: number;
  bookingSite?: string;
  city?: string;
  nights?: number;
}

const CreateSpotPage = () => {
  const [user, loading, error] = useAuthState(auth);
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get('type');

  const [spot, setSpot] = useState<Spot>({
    spotName: '',
    url: '',
    comment: '',
    rating: 0,
    overallRating: 0,
    accessRating: 0,
    cleanlinessRating: 0,
    comfortRating: 0,
    facilityRating: 0,
    staffRating: 0,
    country: '',
    category: '',
    price: undefined,
    bookingSite: '',
    city: '',
    nights: 1,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authorNickname, setAuthorNickname] = useState('');

  useEffect(() => {
    if (user) {
      const fetchNickname = async () => {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setAuthorNickname(userSnap.data().nickname || '');
        }
      };
      fetchNickname();
    }
  }, [user]);

  useEffect(() => {
    // Create image previews
    const previews = imageFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);

    // Cleanup
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imageFiles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSpot(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: 'country' | 'category') => (value: string) => {
    setSpot(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating: number, name: string) => {
    setSpot(prev => {
      const newRatings = { ...prev, [name]: rating };

      if (type === 'hotel') {
        const ratingFields: (keyof Spot)[] = ['accessRating', 'cleanlinessRating', 'comfortRating', 'facilityRating', 'staffRating'];
        const ratingValues = ratingFields
          .map(field => newRatings[field] as number)
          .filter(v => typeof v === 'number' && v > 0);

        const overallRating = ratingValues.length > 0
          ? ratingValues.reduce((sum, current) => sum + current, 0) / ratingValues.length
          : 0;
        
        return { ...newRatings, overallRating: parseFloat(overallRating.toFixed(1)) };
      }
      
      return newRatings;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (newFiles) {
      setImageFiles(prevFiles => [...prevFiles, ...Array.from(newFiles)]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prevPreviews => prevPreviews.filter((_, index) => index !== indexToRemove));
  };

  const handleBookingSiteChange = (value: string) => {
    setSpot(prev => ({ ...prev, bookingSite: value }));
  };

  const handleNightsChange = (newNights: number) => {
    const value = Math.max(0, newNights);
    setSpot(prev => ({ ...prev, nights: value }));
  };

  const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      console.error('Cloudinary configuration is missing.');
      throw new Error('Cloudinary configuration is missing.');
    }

    const imagePromises = files.map(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      return fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        if (data.secure_url) {
          return data.secure_url;
        }
        throw new Error('Image upload failed.');
      });
    });

    return Promise.all(imagePromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('ログインしてください。');
      return;
    }

    // Validation
    if (type === 'hotel') {
            if (!spot.country || !spot.spotName || !spot.accessRating || !spot.cleanlinessRating || !spot.comfortRating || !spot.facilityRating || !spot.staffRating) {
        alert('必須項目を入力してください。');
        return;
      }
    } else {
      if (!spot.country || !spot.category || !spot.spotName || !spot.comment || !spot.rating) {
        alert('必須項目を入力してください。');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        try {
          imageUrls = await uploadImagesToCloudinary(imageFiles);
        } catch (uploadError) {
          console.error('Error uploading images:', uploadError);
          alert('画像アップロードに失敗しました。');
          setIsSubmitting(false); // Prevent further execution
          return;
        }
      }

      const spotData: { [key: string]: any } = {
        ...spot,
        imageUrls, // Will be an empty array for now
        authorId: user.uid,
        nickname: authorNickname,
        createdAt: new Date(),
        type: type,
      };

      // Remove undefined fields before sending to Firestore
      Object.keys(spotData).forEach(key => {
        if (spotData[key] === undefined) {
          delete spotData[key];
        }
      });



      const docRef = await addDoc(collection(db, 'spots'), spotData);
      console.log('Document written with ID: ', docRef.id);

      alert('投稿が完了しました！');
      // Reset form state after successful submission
      setSpot({
        spotName: '', url: '', comment: '', rating: 0,
        overallRating: 0, accessRating: 0, cleanlinessRating: 0,
        comfortRating: 0, facilityRating: 0, staffRating: 0,
        country: '', category: '', price: undefined, bookingSite: '',
        city: '', nights: 1,
      });
      setImageFiles([]);
      setImagePreviews([]);
      router.push('/mypage');

    } catch (error) {
      console.error('Error submitting spot to Firestore: ', error);
      alert('投稿に失敗しました。コンソールでエラー内容を確認してください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{type === 'hotel' ? '宿泊先を投稿' : 'おすすめスポットを投稿'}</CardTitle>
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
              {type === 'spot' && (
                <div>
                  <Label htmlFor="category" className="font-semibold">カテゴリー（必須）</Label>
                  <Select onValueChange={handleSelectChange('category')} value={spot.category}>
                    <SelectTrigger>
                      <SelectValue placeholder="カテゴリーを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {['レストラン', 'カフェ', 'バー', 'パブ', '観光地', 'フォトスポット','ユニフォームショップ','公式ストア'].map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="spotName" className="font-semibold">
                {type === 'hotel' ? '宿泊先名（必須）' : 'スポット名（必須）'}
              </Label>
              <Input id="spotName" name="spotName" value={spot.spotName} onChange={handleInputChange} placeholder={type === 'hotel' ? '例：ザ・サボイ' : '例：エンゼル・スタジアム'} />
            </div>

            {type === 'hotel' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="bookingSite" className="font-semibold">予約サイト（任意）</Label>
                  <Select onValueChange={handleBookingSiteChange} value={spot.bookingSite}>
                    <SelectTrigger>
                      <SelectValue placeholder="予約サイトを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Booking.com', 'Expedia', 'Agoda', 'Hotels.com', 'Trip.com', 'その他'].map(site => (
                        <SelectItem key={site} value={site}>{site}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="nights" className="font-semibold">泊数（任意）</Label>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="icon" onClick={() => handleNightsChange((spot.nights || 1) - 1)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input id="nights" name="nights" type="number" value={spot.nights || ''} onChange={(e) => handleNightsChange(parseInt(e.target.value, 10) || 0)} className="text-center w-16" placeholder="1" />
                    <Button type="button" variant="outline" size="icon" onClick={() => handleNightsChange((spot.nights || 0) + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="url" className="font-semibold">URL（任意）</Label>
              <Input id="url" name="url" value={spot.url} onChange={handleInputChange} placeholder="https://example.com" />
            </div>

            <div>
              <Label htmlFor="comment" className="font-semibold">
                {type === 'hotel' ? 'コメント（任意）' : 'コメント（必須）'}
              </Label>
              <Textarea id="comment" name="comment" value={spot.comment} onChange={handleInputChange} placeholder={type === 'hotel' ? '例：とても快適でした。' : '例：素晴らしいスタジアムでした！'} />
            </div>

            <div>
              <Label htmlFor="spot-image" className="font-semibold">画像（任意）</Label>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative w-48 h-32">
                    <Image src={preview} alt={`プレビュー ${index + 1}`} layout="fill" className="rounded-lg object-cover" />
                    <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 leading-none">
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

            <div className="space-y-4">
              <Label className="font-semibold">{type === 'hotel' ? '評価項目（すべて必須）' : '評価（必須）'}</Label>
              {type === 'hotel' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="overallRating">総合評価</Label>
                    <div className="flex items-center gap-x-4 h-10">
                      <StarRating rating={Math.round(spot.overallRating || 0)} readOnly={true} />
                      <span className="text-xl font-bold text-slate-700 dark:text-slate-200 tabular-nums">
                        {(spot.overallRating || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accessRating">アクセス</Label>
                    <StarRating rating={spot.accessRating || 0} setRating={(r) => handleRatingChange(r, 'accessRating')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cleanlinessRating">清潔さ</Label>
                    <StarRating rating={spot.cleanlinessRating || 0} setRating={(r) => handleRatingChange(r, 'cleanlinessRating')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comfortRating">快適さ</Label>
                    <StarRating rating={spot.comfortRating || 0} setRating={(r) => handleRatingChange(r, 'comfortRating')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facilityRating">設備</Label>
                    <StarRating rating={spot.facilityRating || 0} setRating={(r) => handleRatingChange(r, 'facilityRating')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staffRating">スタッフ</Label>
                    <StarRating rating={spot.staffRating || 0} setRating={(r) => handleRatingChange(r, 'staffRating')} />
                  </div>
                </div>
              ) : (
                <StarRating rating={spot.rating} setRating={(r) => handleRatingChange(r, 'rating')} />
              )}
            </div>

            <Button type="submit" disabled={loading || isSubmitting} className="w-full !mt-8 font-bold py-6 text-base">
              {isSubmitting ? '投稿中...' : '投稿する'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateSpotPage;
