import { Suspense } from 'react';
import CreateSpotForm from '@/components/CreateSpotForm';

function Loading() {
  return <div className="text-center p-10">読み込み中...</div>;
}

export default function CreateSpotPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CreateSpotForm />
    </Suspense>
  );
}

