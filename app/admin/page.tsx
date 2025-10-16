'use client';

'use client';

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchOgp } from '@/actions/fetchOgp';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  order: number;
}

const AdminPage = () => {
  const { user, loading } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<Partial<Banner> | null>(null);
  const [isFetchingOgp, setIsFetchingOgp] = useState(false);

  const fetchBanners = useCallback(async () => {
    const q = query(collection(db, 'banners'), orderBy('order'));
    const querySnapshot = await getDocs(q);
    const bannersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner));
    setBanners(bannersData);
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const adminUid = 'WrNiMMdeVZTNtxZPNa102qZGI8y1'; // Temporarily hardcoded


  const handleSave = async () => {
    if (!currentBanner) return;

    const dataToSave = {
      ...currentBanner,
      order: Number(currentBanner.order || 0),
      updatedAt: serverTimestamp(),
    };

    if (currentBanner.id) {
      const bannerDoc = doc(db, 'banners', currentBanner.id);
      await updateDoc(bannerDoc, dataToSave);
    } else {
      await addDoc(collection(db, 'banners'), { ...dataToSave, createdAt: serverTimestamp() });
    }
    
    fetchBanners();
    setIsDialogOpen(false);
    setCurrentBanner(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('本当にこのバナーを削除しますか？')) {
      await deleteDoc(doc(db, 'banners', id));
      fetchBanners();
    }
  };

  const openDialog = (banner: Partial<Banner> | null = null) => {
    setCurrentBanner(banner || { title: '', subtitle: '', imageUrl: '', link: '', order: banners.length + 1 });
    setIsDialogOpen(true);
  };

  const handleUrlBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (!url || !url.startsWith('http')) return;

    setIsFetchingOgp(true);
    try {
      const ogpData = await fetchOgp(url);
      if (ogpData) {
        setCurrentBanner(prev => ({
          ...prev,
          title: ogpData.title || '',
          subtitle: ogpData.description || '',
          imageUrl: ogpData.imageUrl || '',
        }));
      }
    } catch (error) {
      console.error('Failed to fetch OGP data:', error);
      alert('OGP情報の取得に失敗しました。');
    } finally {
      setIsFetchingOgp(false);
    }
  };



  if (loading) {
    return <div className="text-center text-white p-10">読み込み中...</div>;
  }

  if (!user || user.uid !== adminUid) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-6">アクセスが拒否されました</h1>
        <p className="text-white">このページにアクセスする権限がありません。</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-6">管理者ページ</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">お知らせ管理</h2>
          <Button onClick={() => openDialog()}>新規追加</Button>
        </div>

        <div className="space-y-4">
          {banners.map(banner => (
            <div key={banner.id} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-bold text-lg text-gray-900 dark:text-white">{banner.title} (順番: {banner.order})</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{banner.subtitle}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => openDialog(banner)}>編集</Button>
                <Button variant="destructive" onClick={() => handleDelete(banner.id)}>削除</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentBanner?.id ? 'お知らせを編集' : 'お知らせを新規追加'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input 
              placeholder="Noteの記事URLを貼り付け" 
              value={currentBanner?.link || ''} 
              onChange={e => setCurrentBanner(prev => ({ ...prev, link: e.target.value }))} 
              onBlur={handleUrlBlur}
            />
            {isFetchingOgp && <p className="text-sm text-blue-500 mt-2">記事情報を読み込み中...</p>}
            {/* OGPプレビューと他の入力欄はここに動的に表示されるようになる */}
            {currentBanner?.title && (
              <div className='space-y-4 border-t pt-4 mt-4'>
                <Input placeholder="タイトル" value={currentBanner?.title || ''} onChange={e => setCurrentBanner(prev => ({ ...prev, title: e.target.value }))} />
                <Textarea placeholder="サブタイトル" value={currentBanner?.subtitle || ''} onChange={e => setCurrentBanner(prev => ({ ...prev, subtitle: e.target.value }))} />
                {currentBanner?.imageUrl && <img src={currentBanner.imageUrl} alt="Preview" className="rounded-lg max-h-40" />}
                <Input type="number" placeholder="表示順" value={currentBanner?.order || ''} onChange={e => setCurrentBanner(prev => ({ ...prev, order: Number(e.target.value) }))} />
              </div>
            )}
            <Button onClick={handleSave} className="w-full">保存</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
