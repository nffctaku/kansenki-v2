'use client';

import { useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserProfileEditForm } from './UserProfileEditForm';
import { UserProfileView } from './UserProfileView';


type UserProfileProps = ReturnType<typeof useUserProfile>;

export const UserProfileCard = (props: UserProfileProps) => {
  const { 
    nickname, setNickname, bio, setBio, avatarUrl, setAvatarFile, handleSave, 
    loading, message, avatarPreview, setAvatarPreview,
    favoriteClubIds, setFavoriteClubIds,
    travelFrequency, setTravelFrequency,
    overseasMatchCount, setOverseasMatchCount,
    visitedCountries, setVisitedCountries,
    xLink, setXLink,
    instagramLink, setInstagramLink,
    youtubeLink, setYoutubeLink,
    noteLink, setNoteLink
  } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [favoriteClubsOpen, setFavoriteClubsOpen] = useState(false);

  const onSave = async () => {
    await handleSave();
    setIsEditing(false);
    setAvatarPreview(null);
  };

  const onCancel = () => {
    setIsEditing(false);
    setAvatarPreview(null);
    // TODO: キャンセル時に状態をリセットする
  };

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 text-center flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-300">プロフィールを読み込み中...</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <UserProfileEditForm
        nickname={nickname}
        setNickname={setNickname}
        bio={bio}
        setBio={setBio}
        avatarUrl={avatarUrl}
        avatarPreview={avatarPreview}
        setAvatarFile={setAvatarFile}
        setAvatarPreview={setAvatarPreview}
        favoriteClubsOpen={favoriteClubsOpen}
        setFavoriteClubsOpen={setFavoriteClubsOpen}
        favoriteClubIds={favoriteClubIds}
        setFavoriteClubIds={setFavoriteClubIds}
        xLink={xLink}
        setXLink={setXLink}
        instagramLink={instagramLink}
        setInstagramLink={setInstagramLink}
        youtubeLink={youtubeLink}
        setYoutubeLink={setYoutubeLink}
        noteLink={noteLink}
        setNoteLink={setNoteLink}
        travelFrequency={travelFrequency}
        setTravelFrequency={setTravelFrequency}
        overseasMatchCount={overseasMatchCount}
        setOverseasMatchCount={setOverseasMatchCount}
        visitedCountries={visitedCountries}
        setVisitedCountries={setVisitedCountries}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
  }

  return (
    <UserProfileView
      avatarUrl={avatarUrl}
      nickname={nickname}
      bio={bio}
      xLink={xLink}
      instagramLink={instagramLink}
      youtubeLink={youtubeLink}
      noteLink={noteLink}
      favoriteClubIds={favoriteClubIds}
      travelFrequency={travelFrequency}
      overseasMatchCount={overseasMatchCount}
      visitedCountries={visitedCountries}
      onEdit={() => setIsEditing(true)}
      message={message}
    />
  );
};
