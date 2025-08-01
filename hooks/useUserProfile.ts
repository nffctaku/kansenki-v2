'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { UserProfile } from '@/types/user';

export const useUserProfile = (user: User | null) => {
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [xLink, setXLink] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [noteLink, setNoteLink] = useState('');
  const [residence, setResidence] = useState('');
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
        setXLink(userData.xLink || '');
        setInstagramLink(userData.instagramLink || '');
        setYoutubeLink(userData.youtubeLink || '');
        setNoteLink(userData.noteLink || '');
        setResidence(userData.residence || '');
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

    let newAvatarUrl = avatarUrl;
    if (avatarFile) {
      const storageRef = ref(storage, `avatars/${user.uid}/${avatarFile.name}`);
      await uploadBytes(storageRef, avatarFile);
      newAvatarUrl = await getDownloadURL(storageRef);
      setAvatarUrl(newAvatarUrl);
    }

    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, {
      nickname,
      bio,
      xLink,
      instagramLink,
      youtubeLink,
      noteLink,
      residence,
      travelFrequency,
      overseasMatchCount,
      visitedCountries,
      // Firestoreの'avatarUrl'に保存する。
      // 'photoURL'という名前はGoogleアカウントと競合するため使用しない。
      avatarUrl: newAvatarUrl,
      updatedAt: Timestamp.now(),
    });

    setMessage('プロフィールを更新しました！');
    setTimeout(() => setMessage(''), 3000);
  };

  return {
    nickname, setNickname,
    bio, setBio,
    xLink, setXLink,
    instagramLink, setInstagramLink,
    youtubeLink, setYoutubeLink,
    noteLink, setNoteLink,
    residence, setResidence,
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
