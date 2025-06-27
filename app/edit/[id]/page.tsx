'use client';

import { useParams } from 'next/navigation';
import CloudinaryPostForm from '@/app/form/page';

export default function EditPage() {
  const { id } = useParams();

  // idが配列の場合は最初の要素を、文字列の場合はそのまま使用
  const postId = Array.isArray(id) ? id[0] : id;

  return <CloudinaryPostForm postId={postId} />;
}
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
