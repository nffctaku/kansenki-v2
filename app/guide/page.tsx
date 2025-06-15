// app/guide/page.tsx

export default function GuidePage() {
  return (
    <div
      className="px-6 py-12 max-w-2xl mx-auto text-gray-800"
      style={{ paddingBottom: '300px' }}
    >
      <h1 className="text-2xl font-bold mb-4">ご利用ガイド</h1>
      <p className="mb-4">
        FOOTBALLTOPは、海外サッカーの現地観戦体験をシェアする投稿型アプリです。
        初めての方でも簡単に観戦記を投稿できます。以下の手順に沿ってご利用ください。
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">1. ログイン</h2>
      <p className="mb-4">
        Googleアカウントでログインすることで、投稿・マイページ機能が使えるようになります。
        投稿や「いいね」をするにはログインが必要です。
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">2. 観戦記を読む</h2>
      <p className="mb-4">
        他のユーザーが投稿した観戦記は、トップページやカテゴリ別ページから閲覧できます。
        気になる投稿には「♡いいね」やSNSシェアもできます。
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">3. 投稿する</h2>
      <p className="mb-4">
        ログイン後、画面下部の「＋投稿」ボタンから観戦記を投稿できます。<br />
        入力項目は以下の通りです：
        <ul className="list-disc list-inside mt-2">
          <li>観戦した試合（クラブ名・大会名）</li>
          <li>航空会社・宿泊先・おすすめスポット</li>
          <li>費用の内訳・エピソード・写真（最大5枚）</li>
          <li>コメント許可設定・ハッシュタグ選択</li>
        </ul>
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">4. 投稿の編集・削除</h2>
      <p className="mb-4">
        マイページでは、投稿した観戦記をいつでも編集・削除できます。<br />
        不具合がある場合は footballtop.info@gmail.com
 までご連絡ください。
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">5. 注意事項</h2>
      <p className="mb-4">
        他人の画像や文章を無断転載する行為は禁止です。<br />
        投稿前に必ず利用規約をご確認ください。
      </p>

      <div className="mt-10 text-sm text-gray-500">
        運営：株式会社Loco（FOOTBALLTOP運営チーム）<br />
        お問い合わせ：footballtop.info@gmail.com

      </div>
    </div>
  );
}
