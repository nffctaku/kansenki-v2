import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;

  try {
    let postData: DocumentData | null = null;
    const postRef = doc(db, 'posts', id);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      postData = postSnap.data();
    } else {
      const simplePostRef = doc(db, 'simple-posts', id);
      const simplePostSnap = await getDoc(simplePostRef);
      if (simplePostSnap.exists()) {
        postData = simplePostSnap.data();
      }
    }

    if (!postData) {
      return {
        title: '投稿が見つかりません',
      };
    }

    const imageUrls = postData.images || postData.imageUrls || postData.existingImageUrls || [];
    const firstImage = imageUrls.length > 0 ? imageUrls[0] : 'https://kansenki.footballtop.net/default-og-image.png';

    const title = postData.title || '無題の投稿';
    const description = (postData.content || postData.memories || postData.text || '').substring(0, 150);

    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        images: [
          {
            url: firstImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        type: 'article',
        url: `https://kansenki.footballtop.net/posts/${id}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: [firstImage],
      },
    };
  } catch (error) {
    console.error(`Error generating metadata for post ${id}:`, error);
    return {
      title: '観戦記',
      description: '海外サッカーの現地観戦体験をシェアする投稿型アプリ',
    };
  }
}

export default function PostDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
