'use client';

import Image from 'next/image';
import { FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6';

interface UserInfo {
  nickname: string;
  id: string;
  uid: string;
  xLink?: string;
  noteLink?: string;
  youtubeUrl?: string;
  instagramLink?: string;
  photoURL?: string;
  visitedCountries?: string[];
  biography?: string;
  residence?: string;
  travelFrequency?: string;
  overseasMatchCount?: string;
}

interface Props {
  userInfo: UserInfo;
  postCount: number;
}

const UserProfile = ({ userInfo, postCount }: Props) => {
  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-6">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 -mt-16 sm:-mt-20 shadow-md flex-shrink-0">
          <Image
            src={userInfo.photoURL || '/default-avatar.svg'}
            alt={userInfo.nickname || 'User avatar'}
            fill
            style={{ objectFit: 'cover' }}
            sizes="128px"
          />
        </div>
        <div className="w-full text-center sm:text-left mt-4 sm:mt-0">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{userInfo.nickname}</h1>
            <div className="flex items-center gap-3 mt-2 sm:mt-0">
              {userInfo.xLink && (
                <a href={userInfo.xLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                  <FaXTwitter size={20} />
                </a>
              )}
              {userInfo.instagramLink && (
                <a href={userInfo.instagramLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                  <FaInstagram size={20} />
                </a>
              )}
              {userInfo.youtubeUrl && (
                <a href={userInfo.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500">
                  <FaYoutube size={20} />
                </a>
              )}
              {userInfo.noteLink && (
                <a href={userInfo.noteLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400">
                  <span className="font-bold text-lg">note</span>
                </a>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">@{userInfo.id}</p>
          <p className="mt-4 text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{userInfo.biography}</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{postCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">投稿</p>
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{userInfo.residence || 'N/A'}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">居住地</p>
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{userInfo.visitedCountries?.length || 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">訪問国</p>
        </div>
      </div>

      {userInfo.visitedCountries && userInfo.visitedCountries.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">訪問した国・地域</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {userInfo.visitedCountries.map((country, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-200 dark:text-blue-800">
                {country}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
