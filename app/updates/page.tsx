export default function UpdatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">更新履歴 <span className="text-lg font-normal text-gray-500 dark:text-gray-400">v0.1.0</span></h1>
      <div className="space-y-6">
        <div className="p-4 border bg-white dark:bg-slate-800/50 dark:border-slate-700 rounded-lg shadow-sm">
          <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">2025-07-03</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 dark:text-slate-300">
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
