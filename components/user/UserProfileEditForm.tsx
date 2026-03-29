'use client';

import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MultiSelect } from '../ui/MultiSelect';
import { countriesByContinent } from '@/lib/countriesData';
import { FavoriteClubSelect } from './FavoriteClubSelect';

type Props = {
  nickname: string;
  setNickname: (v: string) => void;
  bio: string;
  setBio: (v: string) => void;

  avatarUrl: string;
  avatarPreview: string | null;
  setAvatarFile: (file: File | null) => void;
  setAvatarPreview: (v: string | null) => void;

  favoriteClubsOpen: boolean;
  setFavoriteClubsOpen: (open: boolean) => void;
  favoriteClubIds: string[];
  setFavoriteClubIds: Dispatch<SetStateAction<string[]>>;

  xLink: string;
  setXLink: (v: string) => void;
  instagramLink: string;
  setInstagramLink: (v: string) => void;
  youtubeLink: string;
  setYoutubeLink: (v: string) => void;
  noteLink: string;
  setNoteLink: (v: string) => void;

  travelFrequency: string;
  setTravelFrequency: (v: string) => void;
  overseasMatchCount: string;
  setOverseasMatchCount: (v: string) => void;
  visitedCountries: string[];
  setVisitedCountries: Dispatch<SetStateAction<string[]>>;

  onSave: () => Promise<void>;
  onCancel: () => void;
};

export function UserProfileEditForm(props: Props) {
  const {
    nickname,
    setNickname,
    bio,
    setBio,
    avatarUrl,
    avatarPreview,
    setAvatarFile,
    setAvatarPreview,
    favoriteClubsOpen,
    setFavoriteClubsOpen,
    favoriteClubIds,
    setFavoriteClubIds,
    xLink,
    setXLink,
    instagramLink,
    setInstagramLink,
    youtubeLink,
    setYoutubeLink,
    noteLink,
    setNoteLink,
    travelFrequency,
    setTravelFrequency,
    overseasMatchCount,
    setOverseasMatchCount,
    visitedCountries,
    setVisitedCountries,
    onSave,
    onCancel,
  } = props;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>プロフィール編集</CardTitle>
      </CardHeader>
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
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ニックネーム
          </label>
          <Input id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            自己紹介
          </label>
          <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>

        <FavoriteClubSelect
          open={favoriteClubsOpen}
          setOpen={setFavoriteClubsOpen}
          favoriteClubIds={favoriteClubIds}
          setFavoriteClubIds={setFavoriteClubIds}
        />

        <div>
          <label htmlFor="xLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            X (旧Twitter) リンク
          </label>
          <Input
            id="xLink"
            value={xLink}
            onChange={(e) => setXLink(e.target.value)}
            placeholder="https://twitter.com/your_account"
          />
        </div>
        <div>
          <label htmlFor="instagramLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Instagram リンク
          </label>
          <Input
            id="instagramLink"
            value={instagramLink}
            onChange={(e) => setInstagramLink(e.target.value)}
            placeholder="https://instagram.com/your_account"
          />
        </div>
        <div>
          <label htmlFor="youtubeLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            YouTube リンク
          </label>
          <Input
            id="youtubeLink"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            placeholder="https://youtube.com/your_channel"
          />
        </div>
        <div>
          <label htmlFor="noteLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Note リンク
          </label>
          <Input
            id="noteLink"
            value={noteLink}
            onChange={(e) => setNoteLink(e.target.value)}
            placeholder="https://note.com/your_account"
          />
        </div>
        <div>
          <label htmlFor="travelFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            海外渡航回数
          </label>
          <select
            id="travelFrequency"
            value={travelFrequency}
            onChange={(e) => setTravelFrequency(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
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
          <label htmlFor="overseasMatchCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            海外観戦試合数
          </label>
          <select
            id="overseasMatchCount"
            value={overseasMatchCount}
            onChange={(e) => setOverseasMatchCount(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
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
          <label htmlFor="visitedCountries" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            行ったことのある国
          </label>
          <MultiSelect
            options={countriesByContinent}
            selected={visitedCountries}
            onChange={setVisitedCountries}
            className="w-full"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
          <Button onClick={onSave}>保存</Button>
        </div>
      </CardContent>
    </Card>
  );
}
