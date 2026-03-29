'use client';

import { Button } from '../ui/button';
import { FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FavoriteClubBadges } from './FavoriteClubBadges';

type Props = {
  avatarUrl: string;
  nickname: string;
  bio: string;
  xLink: string;
  instagramLink: string;
  youtubeLink: string;
  noteLink: string;
  favoriteClubIds: string[];
  travelFrequency: string;
  overseasMatchCount: string;
  visitedCountries: string[];
  onEdit: () => void;
  message: string;
};

export function UserProfileView(props: Props) {
  const {
    avatarUrl,
    nickname,
    bio,
    xLink,
    instagramLink,
    youtubeLink,
    noteLink,
    favoriteClubIds,
    travelFrequency,
    overseasMatchCount,
    visitedCountries,
    onEdit,
    message,
  } = props;

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 text-center">
      <img
        src={avatarUrl || '/default-avatar.png'}
        alt="Avatar"
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200 dark:border-gray-600"
      />
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{nickname}</h2>
      <div className="flex justify-center items-center space-x-4 my-4">
        {xLink && (
          <a
            href={xLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <FaXTwitter size={24} />
          </a>
        )}
        {instagramLink && (
          <a
            href={instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <FaInstagram size={24} />
          </a>
        )}
        {youtubeLink && (
          <a
            href={youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <FaYoutube size={24} />
          </a>
        )}
        {noteLink && (
          <a
            href={noteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <span className="font-bold text-lg">note</span>
          </a>
        )}
      </div>
      <p className="text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">{bio}</p>

      <FavoriteClubBadges favoriteClubIds={favoriteClubIds} />

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
            {visitedCountries.map(
              (country, index) =>
                country && (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-200 dark:text-blue-800"
                  >
                    {country}
                  </span>
                )
            )}
          </div>
        </div>
      )}
      <Button onClick={onEdit} className="mt-4">
        プロフィールを編集
      </Button>
      {message && <p className="text-green-500 mt-4">{message}</p>}
    </div>
  );
}
