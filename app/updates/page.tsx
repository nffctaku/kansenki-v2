export default function UpdatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">更新履歴 <span className="text-lg font-normal text-gray-500 dark:text-gray-400">v0.1.4</span></h1>
                  <div className="space-y-6">
        <div className="p-4 border bg-white dark:bg-slate-800/50 dark:border-slate-700 rounded-lg shadow-sm">
          <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">2025-07-27</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 dark:text-slate-300">
            <li><strong>マップページの改善:</strong> ページ読み込み時にスタジアム・ホテルリストがデフォルトで閉じるようにし、表示のすっきりさを向上させました。</li>
          </ul>
        </div>
        <div className="p-4 border bg-white dark:bg-slate-800/50 dark:border-slate-700 rounded-lg shadow-sm">
          <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">2025-07-06</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 dark:text-slate-300">
            <li><strong>SNSシェア機能の強化:</strong> X（旧Twitter）で投稿をシェアした際に、投稿の1枚目の画像がカードとして正しく表示されるように修正しました。</li>
            <li><strong>UIの改善:</strong> 投稿詳細ページで、かかった費用の合計が0円の場合、費用セクションが自動的に非表示になるように改善しました。</li>
            <li><strong>安定性の向上:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Next.jsのビルドが失敗する問題を解決し、デプロイが安定して行えるようになりました。</li>
                <li>その他、軽微なバグ修正とパフォーマンスの改善を行いました。</li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="p-4 border bg-white dark:bg-slate-800/50 dark:border-slate-700 rounded-lg shadow-sm">
          <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">2025-07-05</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 dark:text-slate-300">
            <li><strong>地図機能の大幅アップデート:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>スタジアムマップの地図をOpenStreetMapからGoogle Mapsにアップグレードし、表示品質を向上させました。</li>
                <li>Google Geocoding APIを導入し、登録されたホテルの住所から正確な座標を取得して、地図上にピン留めする機能を追加しました。</li>
                <li>ホテルは紫、スタジアムは赤のマーカーで表示されるようにしました。</li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="p-4 border bg-white dark:bg-slate-800/50 dark:border-slate-700 rounded-lg shadow-sm">
          <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">2025-07-04</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 dark:text-slate-300">
            <li><strong>地図機能の強化:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>複数のデータベースからホテル情報を取得する機能を追加しました。</li>
                <li>地名検索機能を強化し、日本語の都市名（例：「ロンドン」「マドリード」）に対応しました。</li>
              </ul>
            </li>
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
