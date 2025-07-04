# Kansenki-v2

フットボール観戦の記録を共有するためのウェブアプリケーションです。

## アップデート情報

### 2025-07-04
- **バグ修正:**
  - 他のユーザーのマイページに正常に遷移できない問題を修正しました。
  - 投稿の削除が正常に機能しない問題を修正しました。
- **機能改善:**
  - 投稿を削除する際に、関連する「いいね」データも同時に削除されるように改善しました。
- **セキュリティ:**
  - Firestoreのセキュリティルールを更新し、投稿の作成者本人が安全に投稿を削除できるように修正しました。

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
