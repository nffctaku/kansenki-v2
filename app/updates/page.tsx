export default function UpdatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">更新履歴 <span className="text-lg font-normal text-gray-500 dark:text-gray-400">v0.1.2</span></h1>
            <div className="space-y-6">
        <div className="p-4 border bg-white dark:bg-slate-800/50 dark:border-slate-700 rounded-lg shadow-sm">
          <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">2025-07-04</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 dark:text-slate-300">
            <li>他のユーザーのマイページに正常に遷移できない問題を修正しました。</li>
            <li>投稿の削除が正常に機能しない問題を修正しました。</li>
            <li>投稿を削除する際に、関連する「いいね」データも同時に削除されるように改善しました。</li>
            <li>Firestoreのセキュリティルールを更新し、投稿の作成者本人が安全に投稿を削除できるように修正しました。</li>
          </ul>
        </div>
        <div className="p-4 border bg-white dark:bg-slate-800/50 dark:border-slate-700 rounded-lg shadow-sm">
          <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">2025-07-03</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 dark:text-slate-300">
            <li>メニューおよび投稿フォームに「クラブワールドカップ」「ジャパンツアー」のカテゴリーを追加しました。</li>
            <li>「クラブワールドカップ」のカテゴリーページに専用の背景画像を設定しました。</li>
            <li>投稿フォームのチーム選択に日本のクラブを11チーム追加しました。</li>
            <li>メニューに「アップデート情報」セクションを追加しました。</li>
            <li>投稿フォームの画像アップロード処理を並列化し、投稿速度を改善しました。</li>
            <li>「追加投稿」機能で、費用や移動情報などが正しく引き継がれるように修正しました。</li>
          </ul>
        </div>
        <div className="p-4 border bg-white dark:bg-slate-800/50 dark:border-slate-700 rounded-lg shadow-sm">
          <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">2025-06-28</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 dark:text-slate-300">
            <li>投稿フォームに「追加投稿」機能を追加し、過去の投稿からデータを引き継げるようになりました。</li>
            <li>軽微なUIの調整とバグ修正を行いました。</li>
          </ul>
        </div>
        <div className="p-4 border bg-white dark:bg-slate-800/50 dark:border-slate-700 rounded-lg shadow-sm">
          <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">2025-06-25</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 dark:text-slate-300">
            <li>ヘッダーのデザインを更新し、ダークモード切替ボタンを配置しました。</li>
            <li>サイト全体のパフォーマンスを改善しました。</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
