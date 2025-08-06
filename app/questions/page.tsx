'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

interface Question {
  id: string;
  text: string;
  authorId: string;
  authorNickname: string;
  authorAvatarUrl: string;
  createdAt: Timestamp;
}

export default function QuestionsPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedQuestions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Question[];
      setQuestions(fetchedQuestions);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile || newQuestion.trim() === '') return;

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'questions'), {
        text: newQuestion,
        authorId: user.uid,
        authorNickname: userProfile.nickname || '匿名ユーザー',
        authorAvatarUrl: userProfile.avatarUrl || '',
        createdAt: serverTimestamp(),
      });
      setNewQuestion('');
    } catch (error) {
      console.error('質問の投稿に失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">質問箱</CardTitle>
          <CardDescription>気になることを質問してみましょう。管理者や他のユーザーが回答してくれるかもしれません。</CardDescription>
        </CardHeader>
        <CardContent>
          {authLoading ? (
            <p>読み込み中...</p>
          ) : user ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="質問内容を入力してください..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                rows={4}
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || newQuestion.trim() === ''}>
                {isLoading ? '投稿中...' : '質問を投稿する'}
              </Button>
            </form>
          ) : (
            <div className="text-center p-4 border rounded-lg">
              <p>質問を投稿するには、ログインが必要です。</p>
              <Button asChild className="mt-4">
                <Link href="/login">ログインページへ</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">みんなの質問</h2>
        {questions.length > 0 ? (
          questions.map(q => (
            <Card key={q.id}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={q.authorAvatarUrl} alt={q.authorNickname} />
                    <AvatarFallback>{q.authorNickname.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{q.authorNickname}</p>
                    <p className="text-sm text-muted-foreground">
                      {q.createdAt?.toDate().toLocaleString('ja-JP')}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{q.text}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>まだ質問はありません。</p>
        )}
      </div>
    </div>
  );
}
