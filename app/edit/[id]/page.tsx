'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MatchInfo } from '@/types/match';
import Image from 'next/image';
import Select, {
 
} from 'react-select';

const teamList = [
  'マンチェスター・シティ', 'アーセナル', 'リバプール', 'アストン・ビラ', 'トッテナム',
'チェルシー', 'ニューカッスル', 'マンチェスター・ユナイテッド', 'ウエスト・ハム',
'クリスタル・パレス', 'ブライトン', 'ボーンマス', 'フルハム', 'ウォルバーハンプトン',
'エバートン', 'ブレントフォード', 'ノッティンガム・フォレスト', 'レスター・シティ',
'イプスウィッチ', 'サウサンプトン','ルートン・タウン', 'バーンリー', 'シェフィールド・ユナイテッド', 'リーズ', 'WBA',
'ノリッジ', 'ハル・シティ', 'ミドルスブラ', 'コベントリー', 'プレストン',
'ブリストル・シティ', 'カーディフ', 'ミルウォール', 'スウォンジー', 'ワトフォード',
'サンダーランド', 'ストーク・シティ', 'QPR', 'ブラックバーン', 'シェフィールド・ウェンズデイ',
'プリマス', 'ポーツマス', 'ダービー・カウンティ', 'オックスフォード','レアル・マドリード', 'バルセロナ', 'ジローナ', 'アトレティコ・マドリー', 'アスレティック・ビルバオ',
'ソシエダ', 'ベティス', 'ビジャレアル', 'バレンシア', 'アラベス',
'オサスナ', 'ヘタフェ', 'セルタ', 'セビージャ', 'マジョルカ',
'ラス・パルマス', 'ラージョ', 'レガネス', 'バジャドリー', 'エスパニョール',
'カディス', 'アルメリア', 'グラナダ', 'エイバル', 'スポルティング・ヒホン',
'オビエド', 'ラシン', 'レバンテ', 'ブルゴス', 'ラシン・フェロル',
'エルチェ', 'テネリフェ', 'アルバセテ', 'カルタヘナ', 'サラゴサ',
'エルデンセ', 'ウエスカ', 'ミランデス', 'カステリョン', 'デポルティボ',
'マラガ', 'コルドバ','インテル', 'ミラン', 'ユベントス', 'アタランタ', 'ボローニャ',
'ローマ', 'ラツィオ', 'フィオレンティーナ', 'トリノ', 'ナポリ',
'ジェノア', 'モンツァ', 'ベローナ', 'レッチェ', 'ウディネーゼ',
'カリアリ', 'エンポリ', 'パルマ', 'コモ', 'ベネチア',
'パレルモ', 'チッタデッラ', 'バーリ', 'カルピ', 'モンツァ',
'キエーボ', 'チェゼーナ', 'ペスカーラ', 'エンポリ', 'ベネベント',
'フロジノーネ', 'クロトーネ', 'クレモネーゼ', 'ノバラ', 'テルナーナ',
'カターニア', 'リボルノ', 'アスコリ', 'ペルージャ','レバークーゼン', 'シュツットガルト', 'バイエルン', 'ライプツィヒ', 'ドルトムント',
'フランクフルト', 'ホッフェンハイム', 'ハイデンハイム', 'ブレーメン', 'フライブルク',
'アウクスブルク', 'ボルフスブルク', 'マインツ', 'ボルシアMG', 'ウニオン・ベルリン',
'ボーフム', 'ザンクト・パウリ', 'ホルシュタイン・キール', 'ケルン', 'ダルムシュタット',
'デュッセルドルフ', 'ハンブルガーSV', 'カールスルーエ', 'ハノーファー', 'パダーボルン',
'グロイター・フュルト', 'ヘルタ・ベルリン', 'シャルケ', 'エルフェアスベルク', 'ニュルンベルク',
'カイザースラウテルン', 'マクデブルク', 'ブラウンシュバイク', 'ウルム', 'プロイセン・ミュンスター',
'レーゲンスブルク','パリSG', 'モナコ', 'ブレスト', 'リール', 'ニース',
'リヨン', 'RCランス', 'マルセイユ', 'スタッド・ランス', 'レンヌ',
'トゥールーズ', 'モンペリエ', 'ストラスブール', 'ナント', 'ル・アーブル',
'オセール', 'アンジェ', 'サンテティエンヌ', 'スポルティング', 'ベンフィカ',
'ポルト', 'ブラガ', 'ビトーリア・ギマランエス', 'モレイレンセ', 'アロウカ',
'ファマリカン', 'カサピア', 'ファレンセ', 'リオ・アベ', 'ジル・ビセンテ',
'エストリル', 'エストレラ・アマドーラ', 'ボアビスタ', 'サンタクララ', 'ナシオナル',
'AVS','クラブ・ブルージュ', 'ロイヤル・ユニオン・サンジロワーズ', 'アンデルレヒト', 'セルクル・ブルージュ', 'ゲンク',
'アントワープ', 'ゲント', 'メヘレン', 'シントトロイデン', 'ルーベン',
'ウェステルロー', 'スタンダール・リエージュ', 'シャルルロワ', 'コルトレイク', 'ベールスホット',
'デンデル', 'PSV', 'フェイエノールト', 'トゥエンテ', 'AZ',
'アヤックス', 'NECナイメヘン', 'ユトレヒト', 'スパルタ・ロッテルダム', 'ゴー・アヘッド・イーグルス',
'シッタート', 'ヘーレンフェーン', 'ズウォレ', 'アルメレ・シティ', 'ヘラクレス',
'RKCワールワイク', 'ビレム', 'フローニンゲン', 'NACブレダ', 'LAギャラクシー',
'NYレッドブルズ', 'シアトル・サウンダーズ', 'バンクーバー・ホワイトキャップス', 'ポートランド・ティンバーズ', 'モントリオール・インパクト',
'レアル・ソルトレイク', 'コロラド・ラピッズ', 'サンノゼ・アースクエークス', 'トロントFC', 'デポルティボ・チーバス',
'ニューヨーク・シティ', 'フィラデルフィア・ユニオン', 'シカゴ・ファイアー', 'D.C.ユナイテッド', 'オーランド・シティ',
'シンシナティ', 'インテル・マイアミ', 'アトランタ・ユナイテッド'
].map((team) => ({ value: team, label: team }));

// CostKey の型定義を追加（← 🔴これが必須）
type CostKey = 'flight' | 'hotel' | 'ticket' | 'transport' | 'food' | 'goods' | 'other';

export default function EditPage() {
  const { id } = useParams();
  const router = useRouter();

  const [nickname, setNickname] = useState('');
  const [season, setSeason] = useState('');
  const [category, setCategory] = useState('');
  const [matches, setMatches] = useState<MatchInfo[]>([]);
  const [lifestyle, setLifestyle] = useState('');
  const [watchYear, setWatchYear] = useState('');
  const [watchMonth, setWatchMonth] = useState('');
  const [stayDuration, setStayDuration] = useState('');
  const [goFlights, setGoFlights] = useState([{ name: '', seat: '' }]);
  const [goTime, setGoTime] = useState('');
  const [goType, setGoType] = useState('');
  const [goVia, setGoVia] = useState('');
  const [returnFlights, setReturnFlights] = useState([{ name: '', seat: '' }]);
  const [returnTime, setReturnTime] = useState('');
  const [returnType, setReturnType] = useState('');
  const [returnVia, setReturnVia] = useState('');
  const [hotels, setHotels] = useState([{ url: '', comment: '', rating: 0 }]);
  const [spots, setSpots] = useState([{ url: '', comment: '', rating: 0, autoName: '', address: '' }]);
  const [cost, setCost] = useState({
    flight: 0,
    hotel: 0,
    ticket: 0,
    transport: 0,
    food: 0,
    goods: 0,
    other: 0,
  });
  const [items, setItems] = useState('');
  const [goods, setGoods] = useState('');
  const [episode, setEpisode] = useState('');
  const [firstAdvice, setFirstAdvice] = useState('');
  const [allowComments, setAllowComments] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderRadius: '1rem',
      borderColor: state.isFocused ? '#60a5fa' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px #bfdbfe' : 'none',
      '&:hover': {
        borderColor: '#60a5fa',
      },
      minHeight: '44px',
      padding: '4px 8px',
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '1rem',
      zIndex: 20,
    }),
  };

  const costItems: { key: CostKey; label: string }[] = [
    { key: 'flight', label: '航空券' },
    { key: 'hotel', label: '宿泊費' },
    { key: 'ticket', label: 'チケット代' },
    { key: 'transport', label: '交通費' },
    { key: 'food', label: '食費' },
    { key: 'goods', label: 'グッズ' },
    { key: 'other', label: 'その他' },
  ];

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      const docRef = doc(db, 'simple-posts', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();

        setNickname(data.nickname || '');
        setSeason(data.season || '');
        setCategory(data.category || '');
        setMatches(data.matches || []);
        setHotels(data.hotels || []);
        setSpots(data.spots || []);
        setLifestyle(data.lifestyle || '');
        setWatchYear(data.watchYear || '');
        setWatchMonth(data.watchMonth || '');
        setStayDuration(data.stayDuration || '');
        setGoFlights(data.goFlights || []);
        setGoTime(data.goTime || '');
        setGoType(data.goType || '');
        setGoVia(data.goVia || '');
        setReturnFlights(data.returnFlights || []);
        setReturnTime(data.returnTime || '');
        setReturnType(data.returnType || '');
        setReturnVia(data.returnVia || '');
        setItems(data.items || '');
        setGoods(data.goods || '');
        setEpisode(data.episode || '');
        setFirstAdvice(data.firstAdvice || '');
        setAllowComments(data.allowComments ?? true);
        setExistingImageUrls(data.imageUrls || []);
        setCost(
          data.cost || {
            flight: 0,
            hotel: 0,
            ticket: 0,
            transport: 0,
            food: 0,
            goods: 0,
            other: 0,
          }
        );
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('⏳ 更新中...');

    if (!category) {
      setMessage('❌ カテゴリーを選択してください');
      return;
    }

    try {
      const uploadedUrls: string[] = [];

      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', 'sakataku');

          const res = await fetch('https://api.cloudinary.com/v1_1/dkjcpkfi1/image/upload', {
            method: 'POST',
            body: formData,
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error('Cloudinary upload failed: ' + data.error?.message);
          }

          uploadedUrls.push(data.secure_url);
        }
      }

      const allImageUrls = [...existingImageUrls, ...uploadedUrls];

      await updateDoc(doc(db, 'simple-posts', id as string), {
        nickname,
        season,
        category,
        imageUrls: allImageUrls,
        matches,
        lifestyle,
        watchYear,
        watchMonth,
        stayDuration,
        goFlights,
        goTime,
        goType,
        goVia,
        returnFlights,
        returnTime,
        returnType,
        returnVia,
        hotels,
        spots,
        cost,
        items,
        goods,
        episode,
        firstAdvice,
        allowComments,
      });

      setMessage('✅ 更新完了！');
      router.push('/mypage');
    } catch (err: any) {
      console.error('❌ 更新エラー:', err.message);
      setMessage('❌ 更新に失敗しました: ' + err.message);
    }
  };



  return (
    <div className="min-h-screen flex justify-center items-start py-10 bg-gray-50 px-8">
      <div className="w-full max-w-[700px] bg-white p-6 rounded shadow-md pb-[100px]">
        <h1 className="text-2xl font-bold mb-6 text-center">#みんなの現地観戦記</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 投稿カテゴリなど他の入力フィールドもここに入れる（省略可） */}
{/* 観戦シーズン */}
      <div className="bg-blue-50 p-5 rounded-xl shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          観戦シーズン <span className="text-red-500">*</span>
        </label>
        <select
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="">観戦シーズンを選択</option>
          {Array.from({ length: 2025 - 1960 + 1 }, (_, i) => {
            const year = 1960 + i;
            const label = `${year}/${(year + 1).toString().slice(-2)}`;
            return (
              <option key={label} value={label}>
                {label}
              </option>
            );
          }).reverse()}
        </select>
</div>


        <h2 className="text-xl font-bold mt-10 mb-6 text-blue-700 tracking-wide">
  観戦した試合（最大5件）
</h2>

{matches.map((match, index) => (
  <div
    key={index}
    className="space-y-5 bg-blue-50 p-5 rounded-2xl shadow-sm"
  >
    {/* 大会名 */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">大会名</label>
      <Select
        styles={customStyles}
        options={[
          { label: 'プレミアリーグ', value: 'プレミアリーグ' },
          { label: 'ラ・リーガ', value: 'ラ・リーガ' },
          { label: 'セリエA', value: 'セリエA' },
          { label: 'ブンデスリーガ', value: 'ブンデスリーガ' },
          { label: 'リーグ・アン', value: 'リーグ・アン' },
          { label: 'UEFAチャンピオンズリーグ', value: 'UEFAチャンピオンズリーグ' },
          { label: 'その他', value: 'その他' },
        ]}
        value={match.competition ? { label: match.competition, value: match.competition } : null}
        onChange={(e) => {
          const newMatches = [...matches];
          newMatches[index].competition = e?.value || '';
          setMatches(newMatches);
        }}
      />
    </div>

    {/* 対戦カード */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">対戦カード</label>
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 space-y-3 sm:space-y-0">
        <Select
          styles={customStyles}
          options={teamList}
          isSearchable
          placeholder="ホームチーム"
          value={teamList.find((t) => t.value === match.teamA)}
          onChange={(e) => {
            const newMatches = [...matches];
            newMatches[index].teamA = e?.value || '';
            setMatches(newMatches);
          }}
          className="w-full"
        />
        <span className="text-center text-gray-600 font-semibold">vs</span>
        <Select
          styles={customStyles}
          options={teamList}
          isSearchable
          placeholder="アウェイチーム"
          value={teamList.find((t) => t.value === match.teamB)}
          onChange={(e) => {
            const newMatches = [...matches];
            newMatches[index].teamB = e?.value || '';
            setMatches(newMatches);
          }}
          className="w-full"
        />
      </div>
    </div>

    {/* スタジアム名 */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">スタジアム名</label>
      <input
        type="text"
        placeholder="例：エティハド・スタジアム"
        value={match.stadium}
        onChange={(e) => {
          const newMatches = [...matches];
          newMatches[index].stadium = e.target.value;
          setMatches(newMatches);
        }}
        className="w-full border px-4 py-2 rounded bg-white"
      />
    </div>

    {/* 座席 */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">座席</label>
      <input
        type="text"
        placeholder="例：バックスタンド2階Cブロック"
        value={match.seat}
        onChange={(e) => {
          const newMatches = [...matches];
          newMatches[index].seat = e.target.value;
          setMatches(newMatches);
        }}
        className="w-full border px-4 py-2 rounded bg-white"
      />
    </div>

    {/* 席の感想 */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">席の感想</label>
      <textarea
        placeholder="例：選手の動きが見やすかった！ただ少し遠かった"
        value={match.seatReview}
        onChange={(e) => {
          const newMatches = [...matches];
          newMatches[index].seatReview = e.target.value;
          setMatches(newMatches);
        }}
        className="w-full border px-4 py-2 rounded bg-white"
        rows={3}
      />
    </div>

    {/* チケット代 */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">チケット代（円）</label>
      <input
        type="number"
        min={0}
        placeholder="例：8500"
        value={match.ticketPrice}
        onChange={(e) => {
          const newMatches = [...matches];
          newMatches[index].ticketPrice = Number(e.target.value);
          setMatches(newMatches);
        }}
        className="w-full border px-4 py-2 rounded bg-white"
      />
    </div>
  </div>
))}

{/* 追加ボタン */}
{matches.length < 5 && (
  <button
    type="button"
    onClick={() =>
      setMatches([
        ...matches,
        {
          teamA: '',
          teamB: '',
          competition: '',
          season: '',
          nickname: '',
          stadium: '',
          seat: '',
          seatReview: '',
          ticketPrice: 0,
        },
      ])
    }
    className="text-blue-600 font-medium hover:underline transition"
  >
    ＋ 試合を追加
  </button>
)}



<h2 className="font-bold text-lg mt-6">当時のライフスタイル</h2>
<select
  value={lifestyle}
  onChange={(e) => setLifestyle(e.target.value)}
  className="w-full border p-2 rounded"
>
  <option value="">選択してください</option>
  <option value="社会人">社会人</option>
  <option value="学生">学生</option>
  <option value="留学">留学</option>
  <option value="ワーキングホリデー">ワーキングホリデー</option>
</select>

<h2 className="font-bold text-lg mt-6">観戦時期</h2>
<div className="flex gap-2">
  <select
  value={watchYear}
  onChange={(e) => setWatchYear(e.target.value)}
  className="w-full border p-2 rounded"
>
  <option value="">年を選択</option>
  {Array.from({ length: 10 }, (_, i) => 2025 - i).map((year) => (
    <option key={year} value={year}>{year}年</option>
  ))}
</select>

  <select
  value={watchMonth}
  onChange={(e) => setWatchMonth(e.target.value)}
  className="w-full border p-2 rounded"
>
  <option value="">月を選択</option>
  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
    <option key={month} value={month}>{month}月</option>
  ))}
</select>
</div>

<h2 className="font-bold text-lg mt-6">滞在期間</h2>
<select
  value={stayDuration}
  onChange={(e) => setStayDuration(e.target.value)}
  className="w-full border p-2 rounded"
>
  <option value="">選択してください</option>
  <option value="2日">2日</option>
  <option value="3日">3日</option>
  <option value="4日">4日</option>
  <option value="5日">5日</option>
  <option value="1週間">1週間</option>
  <option value="2週間">2週間</option>
  <option value="3週間">3週間</option>
  <option value="1か月">1か月</option>
  <option value="1か月半">1か月半</option>
  <option value="2か月">2か月</option>
  <option value="3か月">3か月</option>
  <option value="長期滞在">長期滞在</option>
  <option value="留学">留学</option>
  <option value="ワーホリ">ワーホリ</option>
</select>


<h2 className="text-lg font-bold text-blue-700 mt-10 mb-4">目的地までの移動情報</h2>

{['go', 'return'].map((type) => {
  const isGo = type === 'go';
  const flights = isGo ? goFlights : returnFlights;
  const setFlights = isGo ? setGoFlights : setReturnFlights;
  const time = isGo ? goTime : returnTime;
  const setTime = isGo ? setGoTime : setReturnTime;
  const flightType = isGo ? goType : returnType;
  const setFlightType = isGo ? setGoType : setReturnType;
  const via = isGo ? goVia : returnVia;
  const setVia = isGo ? setGoVia : setReturnVia;

  return (
    <div key={type} className="space-y-6 mb-10">
      <h3 className="text-md font-semibold text-blue-600">【{isGo ? '行き' : '帰り'}】</h3>

      {flights.map((flight, index) => (
        <div key={index} className="space-y-4">
          {/* 航空会社 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">航空会社</label>
            <select
              value={flight.name}
              onChange={(e) => {
                const updated = [...flights];
                updated[index].name = e.target.value;
                setFlights(updated);
              }}
               className="w-full border-1 border-red-500 px-4 py-8 rounded-full bg-green-100 text-black"
            >
              <option value="">航空会社を選択</option>
              {[
                '日本航空（JAL）', '全日本空輸（ANA）', 'エミレーツ航空', 'カタール航空',
                'シンガポール航空', 'ブリティッシュ・エアウェイズ', 'ルフトハンザ航空',
                'KLMオランダ航空', 'エールフランス航空', 'ターキッシュエアラインズ',
                'スイスインターナショナル航空', 'ユナイテッド航空', 'デルタ航空',
                'アメリカン航空', 'その他'
              ].map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* 座席タイプ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">座席タイプ</label>
            <select
              value={flight.seat}
              onChange={(e) => {
                const updated = [...flights];
                updated[index].seat = e.target.value;
                setFlights(updated);
              }}
              className="w-full border-1 border-red-500 px-4 py-8 rounded-full bg-green-100 text-black"
            >
              <option value="">座席を選択</option>
              <option value="エコノミー">エコノミー</option>
              <option value="ビジネス">ビジネス</option>
              <option value="ファースト">ファースト</option>
            </select>
          </div>
        </div>
      ))}

      {flights.length < 2 && (
        <button
          type="button"
          onClick={() => setFlights([...flights, { name: '', seat: '' }])}
          className="text-blue-600 font-medium hover:underline transition"
        >
          ＋ 航空会社を追加
        </button>
      )}

      {/* 総移動時間 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">総移動時間</label>
        <input
          type="text"
          placeholder="例: 16時間"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full border-1 border-red-500 px-4 py-8 rounded-full bg-green-100 text-black"
        />
      </div>

      {/* 直行便 or 乗継便 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">直行便 or 乗継便</label>
        <select
          value={flightType}
          onChange={(e) => setFlightType(e.target.value)}
          className="w-full border-1 border-red-500 px-4 py-8 rounded-full bg-green-100 text-black"
        >
          <option value="">選択してください</option>
          <option value="直行便">直行便</option>
          <option value="乗継便">乗継便</option>
        </select>
      </div>

      {/* 経由地 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">経由地</label>
        <input
          type="text"
          placeholder="例: ドバイ、ヘルシンキ"
          value={via}
          onChange={(e) => setVia(e.target.value)}
          className="w-full border-1 border-red-500 px-4 py-8 rounded-full bg-green-100 text-black"
        />
      </div>
    </div>
  );
})}

<h2 className="text-lg font-bold text-blue-700 mt-10 mb-4">宿泊先（最大3件）</h2>

{hotels.map((hotel, index) => (
  <div key={index} className="bg-blue-50 p-5 rounded-2xl shadow-sm space-y-4 mb-6">

    {/* 宿泊先URL */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">宿泊先のURL</label>
      <input
        type="url"
        placeholder="https://example.com"
        value={hotel.url}
        onChange={(e) => {
          const newHotels = [...hotels];
          newHotels[index].url = e.target.value;
          setHotels(newHotels);
        }}
        className="w-full border border-gray-300 px-4 py-2 rounded-2xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
      />
    </div>

    {/* コメント */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">コメント（100文字以内）</label>
      <input
        type="text"
        placeholder="快適で立地も良かったです！"
        value={hotel.comment}
        onChange={(e) => {
          const newHotels = [...hotels];
          newHotels[index].comment = e.target.value;
          setHotels(newHotels);
        }}
        className="w-full border border-gray-300 px-4 py-2 rounded-2xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
      />
    </div>

    {/* 評価 */}
    <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">評価（☆1〜5）</label>
  <select
    value={hotel.rating}
    onChange={(e) => {
      const newHotels = [...hotels];
      newHotels[index].rating = Number(e.target.value);
      setHotels(newHotels);
    }}
    className="w-32 border border-gray-300 px-4 py-2 rounded-2xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
  >
    <option value={0}>選択してください</option>
    <option value={1}>☆</option>
    <option value={2}>☆☆</option>
    <option value={3}>☆☆☆</option>
    <option value={4}>☆☆☆☆</option>
    <option value={5}>☆☆☆☆☆</option>
  </select>
</div>


  </div>
))}

{/* 追加ボタン */}
{hotels.length < 3 && (
  <button
    type="button"
    onClick={() =>
      setHotels([...hotels, { url: '', comment: '', rating: 0 }])
    }
    className="text-blue-600 font-medium hover:underline transition"
  >
    ＋ 宿泊先を追加
  </button>
)}


<h2 className="text-lg font-bold text-blue-700 mt-10 mb-4">おすすめスポット（最大5件）</h2>

{spots.map((spot, index) => (
  <div key={index} className="bg-blue-50 p-5 rounded-2xl shadow-sm space-y-4 mb-6">

    {/* URL */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">スポットのURL</label>
      <input
        type="url"
        placeholder="https://example.com"
        value={spot.url}
        onChange={(e) => {
          const newSpots = [...spots];
          newSpots[index].url = e.target.value;
          setSpots(newSpots);
        }}
        className="w-full border border-gray-300 px-4 py-2 rounded-2xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
      />
    </div>

    {/* コメント */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">コメント（100文字以内）</label>
      <input
        type="text"
        placeholder="観光におすすめ！"
        value={spot.comment}
        onChange={(e) => {
          const newSpots = [...spots];
          newSpots[index].comment = e.target.value;
          setSpots(newSpots);
        }}
        className="w-full border border-gray-300 px-4 py-2 rounded-2xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
      />
    </div>

    {/* 評価 */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">評価（☆1〜5）</label>
      <select
        value={spot.rating}
        onChange={(e) => {
          const newSpots = [...spots];
          newSpots[index].rating = Number(e.target.value);
          setSpots(newSpots);
        }}
        className="w-32 border border-gray-300 px-4 py-2 rounded-2xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
      >
        <option value={0}>選択してください</option>
        <option value={1}>☆</option>
    <option value={2}>☆☆</option>
    <option value={3}>☆☆☆</option>
    <option value={4}>☆☆☆☆</option>
    <option value={5}>☆☆☆☆☆</option>
      </select>
    </div>

  </div>
))}

{spots.length < 5 && (
  <button
    type="button"
    onClick={() =>
      setSpots([...spots, { url: '', comment: '', rating: 0, autoName: '', address: '' }])
    }
    className="text-blue-600 font-medium hover:underline transition"
  >
    ＋ おすすめスポットを追加
  </button>
)}


<h2 className="text-lg font-bold text-blue-700 mt-10 mb-4">費用内訳（円単位）</h2>

<div className="space-y-5 bg-blue-50 p-5 rounded-2xl shadow-sm">
  {costItems.map(({ key, label }) => (
    <div key={key}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="number"
        min={0}
        value={cost[key] === 0 ? '' : cost[key]}
        onChange={(e) =>
          setCost({
            ...cost,
            [key]: Number(e.target.value),
          })
        }
        placeholder="円単位で入力"
        className="appearance-none w-full border border-gray-300 px-4 py-2 rounded-2xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
      />
    </div>
  ))}

  <div className="mt-4 font-semibold text-gray-700">
    合計費用（万円）：約{' '}
    {Math.round(
      Object.values(cost).reduce((sum, v) => sum + Number(v), 0) / 10000
    )} 万円
  </div>
</div>


<h2 className="font-bold text-lg mt-6">その他の情報</h2>

{/* おススメ旅アイテム */}
<div className="mb-4">
  <label className="block text-sm font-medium mb-1">おススメ旅アイテム</label>
  <input
    type="text"
    value={items}
    onChange={(e) => setItems(e.target.value)}
    placeholder="例：モバイルバッテリー、耳栓など"
    className="w-full border p-2 rounded"
  />
</div>

{/* 現地で買ったグッズ */}
<div className="mb-4">
  <label className="block text-sm font-medium mb-1">現地で買ったグッズ</label>
  <textarea
    value={goods}
    onChange={(e) => setGoods(e.target.value)}
    placeholder="例：ユニフォーム、マフラー、マグカップなど"
    className="w-full border p-2 rounded h-24"
  />
</div>

{/* 印象的なエピソードや感想 */}
<div className="mb-4">
  <label className="block text-sm font-medium mb-1">印象的なエピソードや感想</label>
  <textarea
    value={episode}
    onChange={(e) => setEpisode(e.target.value)}
    placeholder="例：現地のサポーターとの交流など"
    className="w-full border p-2 rounded h-24"
  />
</div>

{/* 初めて行く人への一言 */}
<div className="mb-4">
  <label className="block text-sm font-medium mb-1">これから初めて現地観戦する人へ一言</label>
  <textarea
    value={firstAdvice}
    onChange={(e) => setFirstAdvice(e.target.value)}
    placeholder="例：入場時に荷物制限あるので注意！"
    className="w-full border p-2 rounded h-24"
  />
</div>
          {/* 🔻画像アップロードUI（既存画像の表示付き） */}
<div className="bg-white p-4 rounded shadow-sm space-y-2">
  <label className="block text-sm font-semibold text-gray-700">
    画像アップロード（最大5枚）
  </label>

  {/* 画像プレビューエリア */}
  <div className="flex flex-wrap gap-3">
    {/* 既存画像（Cloudinary URL） */}
    {existingImageUrls.map((imgUrl, index) => (
      <div
        key={`existing-${index}`}
        className="relative w-24 h-24 rounded border border-gray-300 overflow-hidden"
      >
        <Image
          src={imgUrl}
          alt={`existing-${index}`}
          fill
          className="object-cover"
        />
        {/* 削除ボタン（既存画像） */}
        <button
          type="button"
          onClick={() => {
            const updated = [...existingImageUrls];
            updated.splice(index, 1);
            setExistingImageUrls(updated);
          }}
          className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white text-xs rounded-full flex items-center justify-center hover:bg-red-700"
        >
          ×
        </button>
      </div>
    ))}

    {/* 新しく追加した画像プレビュー */}
    {imageFiles.map((file, index) => {
      const previewUrl = URL.createObjectURL(file);
      return (
        <div
          key={`new-${index}`}
          className="relative w-24 h-24 rounded border border-gray-300 overflow-hidden bg-white shadow-sm"
        >
          <Image
            src={previewUrl}
            alt={`new-${index}`}
            fill
            className="object-cover"
          />
          {/* 削除ボタン（新規画像） */}
          <button
            type="button"
            onClick={() => {
              const updated = [...imageFiles];
              updated.splice(index, 1);
              setImageFiles(updated);
            }}
            className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white text-xs rounded-full flex items-center justify-center hover:bg-red-700"
          >
            ×
          </button>
        </div>
      );
    })}

    {/* アップロード追加ラベル（上限未満のとき） */}
    {imageFiles.length + existingImageUrls.length < 5 && (
      <label className="border-2 border-dashed border-gray-300 rounded p-6 w-full text-center cursor-pointer hover:bg-gray-50">
        <p className="text-sm text-gray-600">写真をドラッグして追加</p>
        <p className="text-xs text-gray-400 my-1">- または -</p>
        <div className="inline-block mt-2 px-4 py-2 border border-red-500 text-red-500 font-semibold rounded hover:bg-red-50">
          <span className="mr-1">📷</span> 画像を選択する
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImageFiles((prev) => [...prev, file].slice(0, 5));
              e.target.value = '';
            }
          }}
          className="hidden"
        />
      </label>
    )}
  </div>
</div>

          {/* 投稿ボタン */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 font-semibold"
          >
            更新する
          </button>

          {message && <p className="text-center text-sm text-gray-600">{message}</p>}
        </form>
      </div>
    </div>
  );
}
