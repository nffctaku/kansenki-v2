import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プレミアリーグ観戦チケットガイド2025-26 | 観戦記',
  description: '2025-26シーズンのプレミアリーグ観戦チケットの入手方法を徹底解説。公式サイト、リセール、各クラブの販売情報など、夢のスタジアム観戦を実現するための完全ガイド。',
};

const PremierLeagueTicketGuidePage = () => {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* パンくずリストは後でコンポーネント化して追加することを想定 */}
        {/* <Breadcrumbs items={[...]} /> */}

        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              プレミアリーグ観戦チケットガイド 2025-26
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              世界最高峰のリーグを現地で観戦するための完全ガイド
            </p>
          </header>

          <div className="prose dark:prose-invert max-w-none text-lg">
            <p>
              世界中のサッカーファンが憧れるプレミアリーグ。その熱気をスタジアムで直に感じることは、まさに一生の思い出になります。しかし、人気が非常に高いため、チケットの入手は簡単ではありません。このガイドでは、2025-26シーズンのプレミアリーグ観戦チケットを入手するための様々な方法を、初心者にも分かりやすく解説します。
            </p>

            <section className="mt-12">
              <h2 className="text-2xl font-bold border-l-4 border-red-500 pl-4 mb-4">チケット入手の基本戦略</h2>
              <p>
                プレミアリーグのチケットは、主にクラブの公式サイトを通じて販売されます。しかし、ほとんどの試合はシーズンチケットホルダーとクラブ会員に優先的に販売され、一般販売（General Sale）に回ってくることは稀です。そのため、まずは以下の2つのステップが基本となります。
              </p>
              <ol>
                <li><strong>行きたいクラブのメンバーシップに入会する</strong></li>
                <li><strong>チケット発売日を把握し、発売と同時に購入を試みる</strong></li>
              </ol>
              <p>
                特に人気カード（ビッグ6同士の対戦やダービーマッチ）は、メンバーシップ会員でも入手が困難な場合が多いです。
              </p>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold border-l-4 border-red-500 pl-4 mb-4">主なチケット購入方法</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold">1. クラブ公式サイト（メンバーシップ）</h3>
                  <p>最も安全で定価で購入できる方法です。各クラブは独自のメンバーシップ制度を設けており、年会費（30〜60ポンド程度）を支払うことで、チケットの先行購入権を得られます。多くの場合、これが観戦への第一歩です。</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">2. 公式リセール（チケットエクスチェンジ）</h3>
                  <p>シーズンチケットホルダーやメンバーが行けなくなった試合のチケットを、定価で他のファンに譲るための公式プラットフォームです。試合日が近づくと出品が増える傾向にあります。根気強くチェックすることが重要です。</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">3. ホスピタリティパッケージ</h3>
                  <p>チケットに食事やドリンク、ラウンジアクセスなどがセットになったプランです。価格は高額になりますが、一般販売よりも入手しやすく、特別な観戦体験ができます。記念の旅行などには最適です。</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">4. チケット転売サイト</h3>
                  <p>StubHubやViagogoなどのサードパーティサイトでもチケットは流通していますが、価格が非常に高騰している上、偽造チケットや入場トラブルのリスクも伴います。利用は自己責任で、慎重に判断する必要があります。</p>
                </div>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold border-l-4 border-red-500 pl-4 mb-4">よくある質問 (FAQ)</h2>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Q. メンバーになれば必ずチケットは買えますか？</h4>
                  <p>A. いいえ、保証はありません。特に人気カードは抽選になることも多く、運も必要になります。</p>
                </div>
                <div>
                  <h4 className="font-semibold">Q. 試合日時はいつ確定しますか？</h4>
                  <p>A. プレミアリーグの試合日時は、テレビ放映権の都合で頻繁に変更されます。通常、試合の約1〜2ヶ月前に確定します。航空券やホテルを予約する際は、日程変更のリスクを考慮しましょう。</p>
                </div>
              </div>
            </section>

          </div>
        </article>
      </div>
    </div>
  );
};

export default PremierLeagueTicketGuidePage;
