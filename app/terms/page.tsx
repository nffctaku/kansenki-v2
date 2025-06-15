// app/terms/page.tsx

export default function TermsPage() {
  return (
    <div
      className="px-6 py-12 max-w-2xl mx-auto text-gray-800 pb-0"
      style={{ paddingBottom: '400px' }}
    >
      <h1 className="text-2xl font-bold mb-4">利用規約</h1>
      <p className="mb-4">
        本サービスをご利用いただく前に、以下の利用規約をよくお読みください。
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">第1条（適用）</h2>
      <p className="mb-4">
        本規約は、ユーザーと当社との間のすべての関係に適用されます。<br />
        本サービスを利用することで、ユーザーは本規約に同意したものとみなされます。
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">第2条（登録とログイン）</h2>
      <p className="mb-4">
        本サービスの利用には、Googleアカウントによるログインが必要です。<br />
        ユーザーは正確な情報を登録し、不正な利用を行わないものとします。
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">第3条（投稿コンテンツ）</h2>
      <p className="mb-4">
        ユーザーは、自己の責任で観戦記・画像などのコンテンツを投稿できます。<br />
        以下に該当する投稿は禁止します：<br />
        ・他人の権利（著作権・肖像権等）を侵害する内容<br />
        ・誹謗中傷や差別的表現、公序良俗に反する内容<br />
        ・虚偽の情報や悪意ある誘導行為<br />
        当社は、違反や不適切と判断した投稿を事前の通知なく削除できるものとします。
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">第4条（投稿の削除・編集）</h2>
      <p className="mb-4">
        投稿の削除は、ログイン後マイページから本人がいつでも実行できます。<br />
        Firestore上のデータおよびCloudinary上の画像は完全に削除されます。<br />
        ご自身で削除できない場合は footballtop.info@gmail.com までご連絡ください。
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">第5条（知的財産権）</h2>
      <p className="mb-4">
        投稿された文章・画像等の著作権は原則として投稿者本人に帰属します。<br />
        当社は、サービスの運営・宣伝・改善を目的として、投稿内容を無償で利用できるものとします。
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">第6条（個人情報とプライバシー）</h2>
      <p className="mb-4">
        本サービスでは、Googleアカウント情報（ニックネーム・UID等）、投稿内容、操作ログを取得します。<br />
        これらの情報は、サービス提供・不正防止・改善・連絡対応に使用されます。<br />
        当社は個人情報を厳重に管理し、法令に基づく場合を除き第三者に提供しません。<br />
        外部サービス（Firebase, Cloudinary等）の利用に伴い、各サービスのポリシーにも準拠します。
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">第7条（禁止事項）</h2>
      <p className="mb-4">
        ・本サービスの運営を妨げる行為<br />
        ・他ユーザーの情報を収集・詐称する行為<br />
        ・スパム・宣伝・商用目的での投稿（事前許可がない場合）<br />
        ・不正アクセス、システムの改ざんなど
        ・投稿者本人の望まない形での投稿内容の共有・拡散
        ・投稿者本人以外の削除されている内容のスクリーンショットの引用
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">第8条（サービスの停止・変更）</h2>
      <p className="mb-4">
        当社は以下の場合に、事前通知なくサービスを停止・変更できます：<br />
        ・システムメンテナンス<br />
        ・運営上の都合<br />
        ・災害や不可抗力
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">第9条（免責事項）</h2>
      <p className="mb-4">
        投稿内容に関する責任はすべて投稿者にあります。<br />
        当社はユーザー間のトラブル、または本サービスに関連して発生した損害について責任を負いません。
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">第10条（規約の変更）</h2>
      <p className="mb-4">
        本規約は、必要に応じて当社が変更することがあります。<br />
        変更後の内容はサービス上で掲示され、掲示後も利用を継続することで同意とみなされます。
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">第11条（準拠法および管轄）</h2>
      <p className="mb-4">
        本規約の解釈には日本法が適用されます。<br />
        紛争が生じた場合、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
      </p>

      <div className="mt-10 text-sm text-gray-500">
        制定日：2025年6月15日<br />
        運営：株式会社Loco（FOOTBALLTOP運営チーム）<br />
        お問い合わせ：footballtop.info@gmail.com
      </div>
    </div>
  );
}
