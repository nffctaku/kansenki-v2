'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useUserProfile } from '@/hooks/useUserProfile';
import { FaInstagram, FaYoutube } from 'react-icons/fa';
import { MultiSelect } from '../ui/MultiSelect';
import { countriesByContinent } from '@/lib/countriesData';
import { FaXTwitter } from 'react-icons/fa6';


type UserProfileProps = ReturnType<typeof useUserProfile>;

export const UserProfileCard = (props: UserProfileProps) => {
  const { 
    nickname, setNickname, bio, setBio, avatarUrl, setAvatarFile, handleSave, 
    loading, message, avatarPreview, setAvatarPreview,
    travelFrequency, setTravelFrequency,
    overseasMatchCount, setOverseasMatchCount,
    visitedCountries, setVisitedCountries,
    xLink, setXLink,
    instagramLink, setInstagramLink,
    youtubeLink, setYoutubeLink,
    noteLink, setNoteLink
  } = props;
  const [isEditing, setIsEditing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
      <Card>
        <CardHeader><CardTitle>プロフィール編集</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <img 
              src={avatarPreview || avatarUrl || '/default-avatar.png'} 
              alt="Avatar Preview" 
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
            />
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ニックネーム</label>
            <Input id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">自己紹介</label>
            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <div>
            <label htmlFor="xLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">X (旧Twitter) リンク</label>
            <Input id="xLink" value={xLink} onChange={(e) => setXLink(e.target.value)} placeholder="https://twitter.com/your_account" />
          </div>
          <div>
            <label htmlFor="instagramLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instagram リンク</label>
            <Input id="instagramLink" value={instagramLink} onChange={(e) => setInstagramLink(e.target.value)} placeholder="https://instagram.com/your_account" />
          </div>
          <div>
            <label htmlFor="youtubeLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">YouTube リンク</label>
            <Input id="youtubeLink" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="https://youtube.com/your_channel" />
          </div>
          <div>
            <label htmlFor="noteLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Note リンク</label>
            <Input id="noteLink" value={noteLink} onChange={(e) => setNoteLink(e.target.value)} placeholder="https://note.com/your_account" />
          </div>
          <div>
            <label htmlFor="travelFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">海外渡航回数</label>
            <select id="travelFrequency" value={travelFrequency} onChange={(e) => setTravelFrequency(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>選択してください</option>
              <option value="なし">なし</option>
              <option value="1-5回">1-5回</option>
              <option value="6-10回">6-10回</option>
              <option value="11-15回">11-15回</option>
              <option value="16-20回">16-20回</option>
              <option value="21回以上">21回以上</option>
            </select>
          </div>
          <div>
            <label htmlFor="overseasMatchCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">海外観戦試合数</label>
            <select id="overseasMatchCount" value={overseasMatchCount} onChange={(e) => setOverseasMatchCount(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>選択してください</option>
              <option value="なし">なし</option>
              <option value="1-5試合">1-5試合</option>
              <option value="6-10試合">6-10試合</option>
              <option value="11-15試合">11-15試合</option>
              <option value="16-20試合">16-20試合</option>
              <option value="21試合以上">21試合以上</option>
            </select>
          </div>
          <div>
            <label htmlFor="visitedCountries" className="block text-sm font-medium text-gray-700 dark:text-gray-300">行ったことのある国</label>
            <MultiSelect
              options={countriesByContinent}
              selected={visitedCountries}
              onChange={setVisitedCountries}
              className="w-full"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel}>キャンセル</Button>
            <Button onClick={onSave}>保存</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 text-center">
      <img 
        src={avatarUrl || '/default-avatar.png'} 
        alt="Avatar" 
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200 dark:border-gray-600"
      />
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{nickname}</h2>
            <div className="flex justify-center items-center space-x-4 my-4">
        {xLink && <a href={xLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"><FaXTwitter size={24} /></a>}
        {instagramLink && <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"><FaInstagram size={24} /></a>}
        {youtubeLink && <a href={youtubeLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"><FaYoutube size={24} /></a>}
        {noteLink && <a href={noteLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"><span className="font-bold text-lg">note</span></a>}
      </div>
      <p className="text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">{bio}</p>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
          <p className="font-semibold text-gray-500 dark:text-gray-400">海外渡航回数</p>
          <p className="text-gray-800 dark:text-white">{travelFrequency || '未設定'}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
          <p className="font-semibold text-gray-500 dark:text-gray-400">海外観戦試合数</p>
          <p className="text-gray-800 dark:text-white">{overseasMatchCount || '未設定'}</p>
        </div>
      </div>
      {visitedCountries && visitedCountries.length > 0 && (
        <div className="mt-4 text-left">
          <h3 className="font-semibold text-gray-500 dark:text-gray-400">行ったことのある国</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {visitedCountries.map((country, index) => country && (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-200 dark:text-blue-800">
                {country}
              </span>
            ))}
          </div>
        </div>
      )}
      <Button onClick={() => setIsEditing(true)} className="mt-4">プロフィールを編集</Button>
      {message && <p className="text-green-500 mt-4">{message}</p>}
    </div>
  );
};
