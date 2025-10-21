'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { UserProfile } from '@/types/user';

export const useUserProfile = (user: User | null) => {
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [xLink, setXLink] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [noteLink, setNoteLink] = useState('');
  const [travelFrequency, setTravelFrequency] = useState('');
  const [overseasMatchCount, setOverseasMatchCount] = useState('');
  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fetchUserProfile = useCallback(async (uid: string) => {
    console.log('[useUserProfile] Fetching profile for UID:', uid);
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        console.log('[useUserProfile] User doc exists:', true);
        const userData = userDocSnap.data();
        setNickname(userData.nickname || '');
        setBio(userData.bio || '');
        setXLink(userData.xLink || userData.twitter || '');
        setInstagramLink(userData.instagramLink || userData.instagram || '');
        setYoutubeLink(userData.youtubeLink || userData.youtube || '');
        setNoteLink(userData.noteLink || userData.note || '');
        setTravelFrequency(userData.travelFrequency || '');
        setOverseasMatchCount(userData.overseasMatchCount || '');
        setVisitedCountries(userData.visitedCountries || []);
        // Firestoreの'avatarUrl'を正として読み込む。
        // Googleアカウントの'photoURL'とは完全に分離されているため、ログイン時に上書きされることはない。
        setAvatarUrl(userData.avatarUrl || '');
        setProfile(userDocSnap.data() as UserProfile);
      } else {
        console.log('[useUserProfile] User doc does not exist.');
      }
    } catch (error) {
      console.error('[useUserProfile] Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserProfile(user.uid);
    }
    // userオブジェクトの変更時のみ実行するため、fetchUserProfileを依存配列から削除
  }, [user]);

    const handleSave = async () => {
    if (!user) return;

    try {
      setMessage('プロフィールを更新中...');
      const userDocRef = doc(db, 'users', user.uid);
      const updateData: { [key: string]: any } = {};

      // 画像が選択されている場合のみCloudinaryにアップロードしてURLを更新データに含める
      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: 'POST',
              body: formData,
            }
          );

          const data = await response.json();
          if (data.secure_url) {
            const newAvatarUrl = data.secure_url;
            updateData.avatarUrl = newAvatarUrl;
            setAvatarUrl(newAvatarUrl); // UIを即時反映
          } else {
            throw new Error('Cloudinaryへのアップロードに失敗しました。');
          }
        } catch (error) {
          console.error("Cloudinary upload error:", error);
          setMessage('画像のアップロードに失敗しました。');
          return; // エラーが発生した場合は処理を中断
        }
      } else {
        // 画像が選択されていない場合は、現在のavatarUrlを維持する（もし他のフィールドと同時に更新される場合）
        // ただし、他のフィールドが変更されていない場合は何もしない
        if(avatarUrl !== profile?.avatarUrl) {
            updateData.avatarUrl = avatarUrl;
        }
      }

      // 他のプロフィール項目を更新データに含める
      const fields: (keyof UserProfile)[] = ['nickname', 'bio', 'xLink', 'instagramLink', 'youtubeLink', 'noteLink', 'travelFrequency', 'overseasMatchCount', 'visitedCountries'];
      const state: { [key: string]: any } = { nickname, bio, xLink, instagramLink, youtubeLink, noteLink, travelFrequency, overseasMatchCount, visitedCountries };
      
      fields.forEach(field => {
        // Firestoreのデータと比較し、変更があったフィールドのみを更新対象に追加
        if (state[field] !== (profile?.[field] || '')) {
            if(Array.isArray(state[field])){
                if(JSON.stringify(state[field]) !== JSON.stringify(profile?.[field] || [])){
                    updateData[field] = state[field];
                }
            } else {
                updateData[field] = state[field];
            }
        }
      });

      // 更新するデータがある場合のみFirestoreを更新
      if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = Timestamp.now();
        await updateDoc(userDocRef, updateData);
        setMessage('プロフィールを更新しました！');
        // プロフィール情報を再取得して同期
        await fetchUserProfile(user.uid);
      } else {
        setMessage('変更点はありません。');
      }

    } catch (error) {
        console.error("プロフィール更新エラー:", error);
        setMessage('エラーが発生しました。');
    } finally {
        setTimeout(() => setMessage(''), 3000);
    }
  };

  return {
    nickname, setNickname,
    bio, setBio,
    xLink, setXLink,
    instagramLink, setInstagramLink,
    youtubeLink, setYoutubeLink,
    noteLink, setNoteLink,
    travelFrequency, setTravelFrequency,
    overseasMatchCount, setOverseasMatchCount,
    visitedCountries, setVisitedCountries,
    avatarUrl,
    avatarFile, setAvatarFile,
    avatarPreview, setAvatarPreview,
    message, setMessage,
    loading,
    handleSave,
    profile,
  };
};
