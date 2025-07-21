import { teamsByCountry } from '@/lib/teamData';

const allTeams = Object.values(teamsByCountry).flat();
export const teamList = allTeams.map((team) => ({ value: team, label: team }));

export const competitionOptions = [
  {
    label: 'イングランド',
    options: [
      { label: 'プレミアリーグ', value: 'プレミアリーグ' },
      { label: 'チャンピオンシップ', value: 'チャンピオンシップ' },
      { label: 'FAカップ', value: 'FAカップ' },
      { label: 'リーグカップ', value: 'リーグカップ' },
    ],
  },
  {
    label: 'イタリア',
    options: [
      { label: 'セリエA', value: 'セリエA' },
      { label: 'セリエB', value: 'セリエB' },
      { label: 'コッパ・イタリア', value: 'コッパ・イタリア' },
    ],
  },
  {
    label: 'スペイン',
    options: [
      { label: 'ラ・リーガ', value: 'ラ・リーガ' },
      { label: 'ラ・リーガ2', value: 'ラ・リーガ2' },
      { label: 'コパ・デル・レイ', value: 'コパ・デル・レイ' },
    ],
  },
  {
    label: 'ドイツ',
    options: [
      { label: 'ブンデスリーガ', value: 'ブンデスリーガ' },
      { label: '2.ブンデスリーガ', value: '2.ブンデスリーガ' },
      { label: 'DFBポカール', value: 'DFBポカール' },
    ],
  },
  {
    label: 'フランス',
    options: [
      { label: 'リーグ・アン', value: 'リーグ・アン' },
      { label: 'リーグ・ドゥ', value: 'リーグ・ドゥ' },
      { label: 'クープ・ドゥ・フランス', value: 'クープ・ドゥ・フランス' },
    ],
  },
  {
    label: '欧州大会',
    options: [
      { label: 'UEFAチャンピオンズリーグ', value: 'UEFAチャンピオンズリーグ' },
      { label: 'UEFAヨーロッパリーグ', value: 'UEFAヨーロッパリーグ' },
      { label: 'UEFAカンファレンスリーグ', value: 'UEFAカンファレンスリーグ' },
    ],
  },
  {
    label: 'デンマーク',
    options: [
      { label: 'スーペルリーガ', value: 'スーペルリーガ' },
      { label: 'デンマークカップ', value: 'デンマークカップ' },
    ],
  },
  {
    label: 'その他の国',
    options: [
      { label: 'エールディヴィジ', value: 'エールディヴィジ' },
      { label: 'MLS', value: 'MLS' },
      { label: 'アルゼンチン プリメーラ・ディビシオン', value: 'アルゼンチン プリメーラ・ディビシオン' },
      { label: 'カンピオナート・ブラジレイロ・セリエA', value: 'カンピオナート・ブラジレイロ・セリエA' },
    ],
  },
  {
    label: '分類なし',
    options: [
      { label: 'クラブワールドカップ', value: 'クラブワールドカップ' },
      { label: 'ジャパンツアー', value: 'ジャパンツアー' },
      { label: 'プレシーズンマッチ', value: 'プレシーズンマッチ' },
      { label: '代表戦', value: '代表戦' },
      { label: '国内カップ戦(その他)', value: '国内カップ戦(その他)' },
      { label: '親善試合', value: '親善試合' },
      { label: 'その他', value: 'その他' },
    ],
  },
];

export type CostKey = 'flight' | 'hotel' | 'transport' | 'food' | 'goods' | 'other';


export const costItems: { key: CostKey; label: string }[] = [
  { key: 'flight', label: '航空券' },
  { key: 'hotel', label: '宿泊費' },
  { key: 'transport', label: '交通費' },
  { key: 'food', label: '食費' },
  { key: 'goods', label: 'グッズ' },
  { key: 'other', label: 'その他' },
];

export const seatClassOptions = [
  { value: 'economy', label: 'エコノミークラス' },
  { value: 'premium_economy', label: 'プレミアムエコノミー' },
  { value: 'business', label: 'ビジネスクラス' },
  { value: 'first', label: 'ファーストクラス' },
];

export const airlineOptions = [
  { label: "日本航空 (JAL) - 日本", value: "JAL" },
  { label: "全日本空輸 (ANA) - 日本", value: "ANA" },
  { label: "スカイマーク - 日本", value: "Skymark" },
  { label: "AIRDO - 日本", value: "AIRDO" },
  { label: "ソラシドエア - 日本", value: "Solaseed" },
  { label: "スターフライヤー - 日本", value: "StarFlyer" },
  { label: "Peach Aviation - 日本", value: "Peach" },
  { label: "ジェットスター・ジャパン - 日本", value: "JetstarJapan" },
  { label: "スプリング・ジャパン - 日本", value: "SpringJapan" },
  { label: "大韓航空 - 韓国", value: "KoreanAir" },
  { label: "アシアナ航空 - 韓国", value: "Asiana" },
  { label: "シンガポール航空 - シンガポール", value: "SingaporeAirlines" },
  { label: "カタール航空 - カタール", value: "QatarAirways" },
  { label: "エミレーツ航空 - アラブ首長国連邦", value: "Emirates" },
  { label: "ユナイテッド航空 - アメリカ", value: "United" },
  { label: "デルタ航空 - アメリカ", value: "Delta" },
  { label: "アメリカン航空 - アメリカ", value: "AmericanAirlines" },
  { label: "ルフトハンザドイツ航空 - ドイツ", value: "Lufthansa" },
  { label: "エールフランス - フランス", value: "AirFrance" },
  { label: "ブリティッシュ・エアウェイズ - イギリス", value: "BritishAirways" },
  { label: "KLMオランダ航空 - オランダ", value: "KLM" },
  { label: "スイス航空 - スイス", value: "Swiss" },
  { label: "イベリア航空 - スペイン", value: "Iberia" },
  { label: "スカンジナビア航空 - 北欧", value: "SAS" },
  { label: "TAPポルトガル航空 - ポルトガル", value: "TAPPortugal" },
  { label: "オーストリア航空 - オーストリア", value: "Austrian" },
  { label: "フィンエアー - フィンランド", value: "Finnair" },
  { label: "ライアンエアー - アイルランド", value: "Ryanair" },
  { label: "イージージェット - イギリス", value: "easyJet" },
  { label: "ウィズエアー - ハンガリー", value: "WizzAir" },
  { label: "ブエリング - スペイン", value: "Vueling" },
  { label: "トランサヴィア - オランダ／フランス", value: "Transavia" },
  { label: "ユーロウィングス - ドイツ", value: "Eurowings" },
  { label: "中国国際航空 - 中国", value: "AirChina" },
  { label: "中国東方航空 - 中国", value: "ChinaEastern" },
  { label: "中国南方航空 - 中国", value: "ChinaSouthern" },
  { label: "春秋航空 - 中国", value: "SpringAirlines" },
  { label: "香港航空 - 香港", value: "HongKongAirlines" },
  { label: "キャセイパシフィック航空 - 香港", value: "CathayPacific" },
  { label: "チャイナエアライン - 台湾", value: "ChinaAirlines" },
  { label: "エバー航空 - 台湾", value: "EVAair" },
  { label: "ITA Airways（イタリア航空） - イタリア", value: "ITAAirways" },
  { label: "Neos（ネオス航空） - イタリア", value: "Neos" },
  { label: "Air Dolomiti（エア・ドロミティ） - イタリア", value: "AirDolomiti" },
  { label: "Aeroitalia（アエロイタリア） - イタリア", value: "Aeroitalia" }
];

export const seatOptions = [
  { value: 'メインスタンド', label: 'メインスタンド' },
  { value: 'バックスタンド', label: 'バックスタンド' },
  { value: 'ホームゴール裏', label: 'ホームゴール裏' },
  { value: 'アウェイゴール裏', label: 'アウェイゴール裏' },
  { value: 'メインスタンド2階', label: 'メインスタンド2階' },
  { value: 'バックスタンド2階', label: 'バックスタンド2階' },
  { value: 'ホームゴール裏2階', label: 'ホームゴール裏2階' },
  { value: 'アウェイゴール裏2階', label: 'アウェイゴール裏2階' },
  { value: 'メインスタンド3階', label: 'メインスタンド3階' },
  { value: 'バックスタンド3階', label: 'バックスタンド3階' },
  { value: 'ホームゴール裏3階', label: 'ホームゴール裏3階' },
  { value: 'アウェイゴール裏3階', label: 'アウェイゴール裏3階' },
  { value: 'メインスタンド4階', label: 'メインスタンド4階' },
  { value: 'バックスタンド4階', label: 'バックスタンド4階' },
  { value: 'ホームゴール裏4階', label: 'ホームゴール裏4階' },
  { value: 'アウェイゴール裏4階', label: 'アウェイゴール裏4階' },
];

export const ticketPurchaseRouteOptions = [
  { value: 'club_official', label: 'クラブ公式サイト' },
  { value: 'league_official', label: 'リーグ公式サイト' },
  { value: 'resale', label: 'チケットリセールサイト' },
  { value: 'agency', label: '旅行代理店・ツアー' },
  { value: 'friend', label: '知人・友人' },
  { value: 'other', label: 'その他' },
];

export const travelDurationOptions = Array.from({ length: 80 }, (_, i) => {
  const totalMinutes = (i + 1) * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hourText = hours > 0 ? `${hours}時間` : '';
  const minuteText = minutes > 0 ? `${minutes}分` : '';
  const value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  return { value: value, label: `${hourText}${minuteText}` };
});

export const travelFrequencyOptions = [
  { value: '0', label: '未選択' },
  { value: '1-5', label: '1〜5回' },
  { value: '6-10', label: '6〜10回' },
  { value: '11-20', label: '11〜20回' },
  { value: '21-30', label: '21〜30回' },
  { value: '31-50', label: '31〜50回' },
  { value: '51+', label: '51回以上' },
];

export const countryOptions = [
  { value: '未選択', label: '未選択' },
  { value: 'Japan', label: '日本' },
  { value: 'United Kingdom', label: 'イギリス' },
  { value: 'Spain', label: 'スペイン' },
  { value: 'Germany', label: 'ドイツ' },
  { value: 'Italy', label: 'イタリア' },
  { value: 'France', label: 'フランス' },
  { value: 'Portugal', label: 'ポルトガル' },
  { value: 'Netherlands', label: 'オランダ' },
  { value: 'Belgium', label: 'ベルギー' },
  { value: 'United States', label: 'アメリカ' },
  { value: 'Brazil', label: 'ブラジル' },
  { value: 'Argentina', label: 'アルゼンチン' },
  { value: 'South Korea', label: '韓国' },
  { value: 'China', label: '中国' },
  { value: 'Australia', label: 'オーストラリア' },
  { value: 'Thailand', label: 'タイ' },
  { value: 'Singapore', label: 'シンガポール' },
  { value: 'Malaysia', label: 'マレーシア' },
  { value: 'Other', label: 'その他' },
];

export const overseasMatchCountOptions = [
  { value: '0', label: '未選択' },
  { value: '1-5', label: '1〜5試合' },
  { value: '6-10', label: '6〜10試合' },
  { value: '11-20', label: '11〜20試合' },
  { value: '21-30', label: '21〜30試合' },
  { value: '31-50', label: '31〜50試合' },
  { value: '51-100', label: '51〜100試合' },
  { value: '101+', label: '101試合以上' },
];
