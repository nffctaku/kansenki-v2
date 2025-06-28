'use client';

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';

import { MatchInfo } from '@/types/match';
import { collection, doc, getDoc, query, where, getDocs, serverTimestamp, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ja } from 'date-fns/locale/ja';
import 'react-datepicker/dist/react-datepicker.css';
import Select, { StylesConfig, GroupBase } from 'react-select';
import { teamList, competitionOptions, costItems, CostKey, airlineList, ticketPurchaseRouteOptions } from './data';

interface PostFormProps {
  postId?: string;
}

// Type definitions for complex state
interface FlightInfo { name: string; seat: string; }
interface HotelInfo { url: string; comment: string; rating: number; }
interface SpotInfo { url: string; comment: string; rating: number; }
interface FlightTime { departure: string; arrival: string; }

// Generic type for react-select options
interface OptionType {
  value: string;
  label: string;
}

// Type for user's travel data from Firestore
interface UserTravel {
  id: string;
  season?: string;
  travelDuration?: string;
  cities?: string;
  [key: string]: any; // Allow other properties from firestore doc
}

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = (i % 2) * 30;
  const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  return { value: time, label: time };
});

// React Selectのダークモード対応カスタムスタイル
registerLocale('ja', ja);

const getCustomStyles = (theme: string | undefined): StylesConfig<any, false, GroupBase<any>> => ({
  control: (provided, state) => ({
    ...provided,
    borderRadius: '0.5rem',
    borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
    backgroundColor: theme === 'dark' ? '#374151' : 'white',
    boxShadow: state.isFocused ? (theme === 'dark' ? '0 0 0 1px #3b82f6' : '0 0 0 1px #60a5fa') : 'none',
    '&:hover': {
      borderColor: theme === 'dark' ? '#6b7280' : '#a5b4fc',
    },
    padding: '1px',
    minHeight: '42px',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '0.5rem',
    backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
    zIndex: 20,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? (theme === 'dark' ? '#3b82f6' : '#60a5fa')
      : state.isFocused
      ? (theme === 'dark' ? '#374151' : '#f3f4f6')
      : 'transparent',
    color: theme === 'dark' ? '#f9fafb' : '#1f2937',
    '&:active': {
      backgroundColor: theme === 'dark' ? '#2563eb' : '#3b82f6',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: theme === 'dark' ? '#f9fafb' : '#1f2937',
  }),
  input: (provided) => ({
    ...provided,
    color: theme === 'dark' ? '#f9fafb' : '#1f2937',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
  }),
  groupHeading: (provided) => ({
    ...provided,
    color: theme === 'dark' ? '#d1d5db' : '#4b5563',
    backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
    padding: '8px 12px',
    fontWeight: 'bold',
  }),
});

const initialMatchState: MatchInfo = {
  competition: '',
  season: '',
  date: '',
  kickoff: '',
  homeTeam: '',
  awayTeam: '',
  homeScore: '',
  awayScore: '',
  stadium: '',
  ticketPrice: '',
  ticketPurchaseRoute: '',
  seat: '',
  seatReview: '',
};

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const FormInput = ({ label, ...props }: FormInputProps) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    )}
    <input {...props} className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-500 transition" />
  </div>
);

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const FormTextarea = ({ label, ...props }: FormTextareaProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <textarea {...props} rows={4} className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-500 transition" />
  </div>
);

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="space-y-4 pt-6 first:pt-0">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">{title}</h2>
    <div className="space-y-6">{children}</div>
  </div>
);

type SelectOptionType = { value: string; label: string };

interface FormSelectProps {
  label: string;
  options: readonly (SelectOptionType | GroupBase<SelectOptionType>)[];
  value: string;
  onChange: (_option: SelectOptionType | null) => void;
  placeholder: string;
  isRequired?: boolean;
}

const FormSelect = ({ label, options, value, onChange, placeholder, isRequired }: FormSelectProps) => {
  const { theme } = useTheme();
  const customStyles = useMemo(() => getCustomStyles(theme), [theme]);

  let allOptions: SelectOptionType[] = [];
  if (options && options.length > 0) {
    if ('options' in options[0]) {
      allOptions = (options as GroupBase<SelectOptionType>[]).flatMap(g => g.options || []);
    } else {
      allOptions = options as SelectOptionType[];
    }
  }
  const selectedValue = allOptions.find(o => o.value === value);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label} {isRequired && <span className="text-red-500">*</span>}</label>
      <Select styles={customStyles} options={options} isSearchable placeholder={placeholder} value={selectedValue} onChange={onChange} required={isRequired} />
    </div>
  );
};

const initialFlightState: FlightInfo = { name: '', seat: '' };
const initialHotelState: HotelInfo = { url: '', comment: '', rating: 0 };
const initialSpotState: SpotInfo = { url: '', comment: '', rating: 0 };

interface Travel {
  id: string;
  uid: string; // Changed from userId
  author: string;
  title: string;
  isPublic: boolean;
  season?: string; // Keep optional if not always present
  travelDuration?: string;
  cities?: string;
  flights: any[]; // Simplified from go/return flights
  hotels: any[];
  costs: any | null;
  itineraries: any[];
  createdAt: any; // Can be Timestamp or FieldValue
  updatedAt: any;

  // Fields that might be used for form population from the old structure
  goFlights?: FlightInfo[];
  returnFlights?: FlightInfo[];
  goTime?: FlightTime;
  returnTime?: FlightTime;
  goFlightType?: string;
  returnFlightType?: string;
  goVia?: string;
  returnVia?: string;
  cost?: Record<CostKey, number>;
}

interface FlightSection {
  type: 'go' | 'return';
  title: string;
  flights: FlightInfo[];
  // eslint-disable-next-line no-unused-vars
  handleChange: (index: number, field: keyof FlightInfo, value: string) => void;
  add: () => void;
  // eslint-disable-next-line no-unused-vars
  remove: (index: number) => void;
  time: FlightTime;
  setTime: React.Dispatch<React.SetStateAction<FlightTime>>;
  flightType: string;
  setFlightType: React.Dispatch<React.SetStateAction<string>>;
  via: string;
  setVia: React.Dispatch<React.SetStateAction<string>>;
}

export default function PostForm({ postId }: PostFormProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const customStyles = useMemo(() => getCustomStyles(theme), [theme]);

  // State declarations
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState('');
  const [season, setSeason] = useState('');
  const [match, setMatch] = useState<MatchInfo>(initialMatchState);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [lifestyle, setLifestyle] = useState('');
  const [watchYear, setWatchYear] = useState('');
  const [watchMonth, setWatchMonth] = useState('');
  const [stayDuration, setStayDuration] = useState('');
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

  const [cost, setCost] = useState<Record<CostKey, number>>({ flight: 0, hotel: 0, transport: 0, food: 0, goods: 0, other: 0 });
  const [items, setItems] = useState('');
  const [goods, setGoods] = useState('');
  const [episode, setEpisode] = useState('');
  const [firstAdvice, setFirstAdvice] = useState<string>('');
  const [allowComments, setAllowComments] = useState<boolean>(true);

  const [travels, setTravels] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState(!!postId);
  const [travelOption, setTravelOption] = useState(postId ? 'existing' : 'new'); 
  const [userTravels, setUserTravels] = useState<UserTravel[]>([]);
  const [selectedTravelId, setSelectedTravelId] = useState<string>('');
  const [travelDateRange, setTravelDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [cities, setCities] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [goFlights, setGoFlights] = useState<FlightInfo[]>([initialFlightState]);
  const [returnFlights, setReturnFlights] = useState<FlightInfo[]>([initialFlightState]);
  const [hotels, setHotels] = useState<HotelInfo[]>([initialHotelState]);
  const [spots, setSpots] = useState<SpotInfo[]>([initialSpotState]);

  // Flight section specific states
  const [goTime, setGoTime] = useState<FlightTime>({ departure: '', arrival: '' });
  const [returnTime, setReturnTime] = useState<FlightTime>({ departure: '', arrival: '' });
  const [goFlightType, setGoFlightType] = useState('direct');
  const [returnFlightType, setReturnFlightType] = useState('direct');
  const [goVia, setGoVia] = useState('');
  const [returnVia, setReturnVia] = useState('');

  // Handlers
  const handleMatchChange = (field: keyof MatchInfo, value: any) => {
    setMatch({ ...match, [field]: value });
  };

  const handleCostChange = (key: CostKey, value: string) => {
    setCost({ ...cost, [key]: Number(value) || 0 });
  };

  const totalCost = useMemo(() => Object.values(cost).reduce((acc, cur) => acc + cur, 0), [cost]);

  // Handlers for dynamic lists
  const handleFlightChange = (type: 'go' | 'return', index: number, field: keyof FlightInfo, value: string) => {
    const flights = type === 'go' ? [...goFlights] : [...returnFlights];
    flights[index] = { ...flights[index], [field]: value };
    if (type === 'go') setGoFlights(flights);
    else setReturnFlights(flights);
  };
  const addFlight = (type: 'go' | 'return') => {
    const flights = type === 'go' ? goFlights : returnFlights;
    if (flights.length < 2) {
      const setFlights = type === 'go' ? setGoFlights : setReturnFlights;
      setFlights([...flights, { name: '', seat: '' }]);
    }
  };
  const removeFlight = (type: 'go' | 'return', index: number) => {
    const flights = type === 'go' ? goFlights : returnFlights;
    const setFlights = type === 'go' ? setGoFlights : setReturnFlights;
    setFlights(flights.filter((_, i) => i !== index));
  };

  const handleHotelChange = (index: number, field: keyof HotelInfo, value: string | number) => {
    const newHotels = [...hotels];
    newHotels[index] = { ...newHotels[index], [field]: value };
    setHotels(newHotels);
  };
  const addHotel = () => {
    if (hotels.length < 3) setHotels([...hotels, { url: '', comment: '', rating: 0 }]);
  };
  const removeHotel = (index: number) => {
    setHotels(hotels.filter((_, i) => i !== index));
  };

  const handleSpotChange = (index: number, field: keyof SpotInfo, value: string | number) => {
    const newSpots = [...spots];
    newSpots[index] = { ...newSpots[index], [field]: value };
    setSpots(newSpots);
  };
  const addSpot = () => {
    if (spots.length < 5) setSpots([...spots, { url: '', comment: '', rating: 0 }]);
  };
  const removeSpot = (index: number) => {
    setSpots(spots.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const combinedFiles = [...imageFiles, ...newFiles].slice(0, 5);
    
    setImageFiles(combinedFiles);

    // Clean up old previews before creating new ones for the new combined list
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    
    const newPreviews = combinedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  const removeImage = (indexToRemove: number) => {
    // Create new arrays
    const newImageFiles = imageFiles.filter((_, index) => index !== indexToRemove);
    const newImagePreviews = imagePreviews.filter((_, index) => index !== indexToRemove);

    // Revoke the specific object URL to free memory
    URL.revokeObjectURL(imagePreviews[indexToRemove]);

    setImageFiles(newImageFiles);
    setImagePreviews(newImagePreviews);
  };

  useEffect(() => {
    // This effect handles the cleanup of object URLs when the component unmounts.
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setNickname(userDoc.data().nickname);
        }
        const q = query(collection(db, 'simple-travels'), where('uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const travelsData = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Travel[];
        setUserTravels(travelsData);
      } else {
        setUser(null);
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    // This hook handles auto-filling the form when a user selects an existing travel plan
    // in the "new post" flow. It does not run in edit mode.
    if (travelOption === 'existing' && selectedTravelId) {
      const selectedTravel = userTravels.find(t => t.id === selectedTravelId);
      if (selectedTravel) {
        // Auto-fill form with all data from the selected travel document
        setSeason(selectedTravel.season || '');
        
        if (selectedTravel.travelDuration) {
            const dates = selectedTravel.travelDuration.split(' - ');
            if (dates.length === 2) {
                const startDate = new Date(dates[0]);
                const endDate = new Date(dates[1]);
                if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                    setTravelDateRange([startDate, endDate]);
                } else {
                    setTravelDateRange([null, null]);
                }
            }
        } else {
          setTravelDateRange([null, null]);
        }
        
        setCities(selectedTravel.cities || '');
        setGoFlights(selectedTravel.goFlights && selectedTravel.goFlights.length > 0 ? selectedTravel.goFlights : [initialFlightState]);
        setReturnFlights(selectedTravel.returnFlights && selectedTravel.returnFlights.length > 0 ? selectedTravel.returnFlights : [initialFlightState]);
        setGoTime(selectedTravel.goTime || { departure: '', arrival: '' });
        setReturnTime(selectedTravel.returnTime || { departure: '', arrival: '' });
        setGoFlightType(selectedTravel.goFlightType || 'direct');
        setReturnFlightType(selectedTravel.returnFlightType || 'direct');
        setGoVia(selectedTravel.goVia || '');
        setReturnVia(selectedTravel.returnVia || '');
        setHotels(selectedTravel.hotels && selectedTravel.hotels.length > 0 ? selectedTravel.hotels : [initialHotelState]);
        setSpots(selectedTravel.spots && selectedTravel.spots.length > 0 ? selectedTravel.spots : [initialSpotState]);
        
        if (selectedTravel.cost && typeof selectedTravel.cost === 'object') {
            setCost(selectedTravel.cost);
        } else {
            setCost({ flight: 0, hotel: 0, transport: 0, food: 0, goods: 0, other: 0 });
        }
      }
    } else if (travelOption === 'new') {
      // Reset fields when switching back to 'new' travel, but preserve fields the user might want to keep, like season.
      setSelectedTravelId('');
      setTravelDateRange([null, null]);
      setCities('');
      setGoFlights([initialFlightState]);
      setReturnFlights([initialFlightState]);
      setHotels([initialHotelState]);
      setSpots([initialSpotState]);
      setGoTime({ departure: '', arrival: '' });
      setReturnTime({ departure: '', arrival: '' });
      setGoFlightType('direct');
      setReturnFlightType('direct');
      setGoVia('');
      setReturnVia('');
      setCost({ flight: 0, hotel: 0, transport: 0, food: 0, goods: 0, other: 0 });
    }
  }, [selectedTravelId, travelOption, userTravels]);

  useEffect(() => {
    const fetchPostData = async () => {
      if (!postId || !user) return;

      setMessage('投稿データを読み込み中...');
      try {
        const postRef = doc(db, 'simple-posts', postId);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
          setMessage('エラー: 投稿が見つかりません。');
          return;
        }

        const postData = postSnap.data();
        
        // --- Populate common post fields ---
        setTitle(postData.title || '');
        setSeason(postData.season || '');
        setCategory(postData.category || '');
        setLifestyle(postData.lifestyle || '');
        setWatchYear(postData.watchYear || '');
        setWatchMonth(postData.watchMonth || '');
        setStayDuration(postData.stayDuration || '');
        setItems(postData.items || '');
        setGoods(postData.goods || '');
        setEpisode(postData.episode || '');
        setFirstAdvice(postData.firstAdvice || '');
        setAllowComments(postData.allowComments !== false);
        setExistingImageUrls(postData.imageUrls || []);
        setImagePreviews(postData.imageUrls || []);

        // --- Populate Match Info ---
        if (postData.matches && postData.matches.length > 0) {
          const matchData = postData.matches[0] as any;
          // Backward compatibility for old match data (teamA/teamB)
          if (matchData.teamA && !matchData.homeTeam) {
            matchData.homeTeam = matchData.teamA;
          }
          if (matchData.teamB && !matchData.awayTeam) {
            matchData.awayTeam = matchData.teamB;
          }
          setMatch({
            ...initialMatchState, // Start with defaults
            ...matchData,
            season: postData.season || '', // Ensure season is populated
          });
        }

        // --- Populate Travel Info (New and Old data structure handling) ---
        let travelData: any = null;
        if (postData.travelId) {
          // New structure: travel data is in a separate document
          setSelectedTravelId(postData.travelId);
          const travelRef = doc(db, 'simple-travels', postData.travelId);
          const travelSnap = await getDoc(travelRef);
          if (travelSnap.exists()) {
            travelData = travelSnap.data();
          }
        } else {
          // Old structure: travel data is embedded in the post document
          travelData = postData;
        }

        if (travelData) {
          if (travelData.travelDuration) {
            const dates = travelData.travelDuration.split(' - ');
            if (dates.length === 2) {
              const startDate = new Date(dates[0]);
              const endDate = new Date(dates[1]);
              if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                setTravelDateRange([startDate, endDate]);
              }
            }
          }
          setCities(travelData.cities || '');
          setGoFlights(travelData.goFlights && travelData.goFlights.length > 0 ? travelData.goFlights : [initialFlightState]);
          setReturnFlights(travelData.returnFlights && travelData.returnFlights.length > 0 ? travelData.returnFlights : [initialFlightState]);
          setGoTime(travelData.goTime || { departure: '', arrival: '' });
          setReturnTime(travelData.returnTime || { departure: '', arrival: '' });
          
          const mapFlightType = (type: string) => {
            if (type === '乗継便') return 'via';
            if (type === '直行便') return 'direct';
            return type; // Assume new format if not old format
          };

          setGoFlightType(mapFlightType(travelData.goType || travelData.goFlightType || 'direct'));
          setReturnFlightType(mapFlightType(travelData.returnType || travelData.returnFlightType || 'direct'));

          setGoVia(travelData.goVia || '');
          setReturnVia(travelData.returnVia || '');
          setHotels(travelData.hotels && travelData.hotels.length > 0 ? travelData.hotels : [initialHotelState]);
          setSpots(travelData.spots && travelData.spots.length > 0 ? travelData.spots : [initialSpotState]);
          setCost(travelData.cost || { flight: 0, hotel: 0, transport: 0, food: 0, goods: 0, other: 0 });
        }
        
        setMessage(''); // Clear loading message
      } catch (error) {
        console.error("Error fetching post data:", error);
        setMessage('エラー: データの読み込みに失敗しました。');
      }
    };

    fetchPostData();
  }, [postId, user]);

  const flightSections: FlightSection[] = [
    {
      type: 'go' as const,
      title: '往路',
      flights: goFlights,
      handleChange: (index: number, field: keyof FlightInfo, value: string) => handleFlightChange('go', index, field, value),
      add: () => addFlight('go'),
      remove: (index: number) => removeFlight('go', index),
      time: goTime,
      setTime: setGoTime,
      flightType: goFlightType,
      setFlightType: setGoFlightType,
      via: goVia,
      setVia: setGoVia,
    },
    {
      type: 'return' as const,
      title: '復路',
      flights: returnFlights,
      handleChange: (index: number, field: keyof FlightInfo, value: string) => handleFlightChange('return', index, field, value),
      add: () => addFlight('return'),
      remove: (index: number) => removeFlight('return', index),
      time: returnTime,
      setTime: setReturnTime,
      flightType: returnFlightType,
      setFlightType: setReturnFlightType,
      via: returnVia,
      setVia: setReturnVia,
    },
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setMessage('エラー: ログインしていません。');
      return;
    }
    if (!season || !match.homeTeam || !match.awayTeam || !category) {
      setMessage('エラー: 必須項目（シーズン、対戦カード、カテゴリー）を入力してください。');
      return;
    }

    setMessage('投稿処理中...');

    try {
      let travelId = selectedTravelId;
      
      // Ensure the match object has the correct season from the main state.
      const finalMatchData = {
        ...match,
        season: season,
      };

      // Handle Travel Data
      if (travelOption === 'new' && !isEditMode) {
        const newTravelRef = doc(collection(db, 'simple-travels'));
        travelId = newTravelRef.id;
        const travelData = {
          uid: user.uid,
          author: nickname,
          isPublic: true,
          season: season,
          travelDuration: travelDateRange[0] && travelDateRange[1] ? `${travelDateRange[0].toLocaleDateString()} - ${travelDateRange[1].toLocaleDateString()}` : '',
          cities: cities,
          goFlights: goFlights.filter(f => f.name),
          returnFlights: returnFlights.filter(f => f.name),
          goTime: goTime,
          returnTime: returnTime,
          goFlightType: goFlightType,
          returnFlightType: returnFlightType,
          goVia: goVia,
          returnVia: returnVia,
          hotels: hotels.filter(h => h.url || h.comment),
          spots: spots.filter(s => s.url || s.comment),
          cost: cost,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(newTravelRef, travelData);
      } else if (isEditMode && travelId) {
        // Update the existing travel document when in edit mode
        const travelRef = doc(db, 'simple-travels', travelId);
        const travelDataToUpdate = {
          season: season,
          travelDuration: travelDateRange[0] && travelDateRange[1] ? `${travelDateRange[0].toLocaleDateString()} - ${travelDateRange[1].toLocaleDateString()}` : '',
          cities: cities,
          goFlights: goFlights.filter(f => f.name),
          returnFlights: returnFlights.filter(f => f.name),
          goTime: goTime,
          returnTime: returnTime,
          goFlightType: goFlightType,
          returnFlightType: returnFlightType,
          goVia: goVia,
          returnVia: returnVia,
          hotels: hotels.filter(h => h.url || h.comment),
          spots: spots.filter(s => s.url || s.comment),
          cost: cost,
          updatedAt: serverTimestamp(),
        };
        await updateDoc(travelRef, travelDataToUpdate);
      } else if (!travelId && !isEditMode) {
        setMessage('エラー: 既存の旅を選択してください。');
        return;
      }

      // Prepare Post Data
      const postData: any = {
        uid: user.uid,
        author: nickname,
        title: title || `${finalMatchData.homeTeam} vs ${finalMatchData.awayTeam}`,
        isPublic: true,
        season: season,
        category: category,
        matches: [finalMatchData],
        lifestyle: lifestyle,
        watchYear: watchYear,
        watchMonth: watchMonth,
        stayDuration: stayDuration,
        items: items,
        goods: goods,
        episode: episode,
        firstAdvice: firstAdvice,
        allowComments: allowComments,
        travelId: travelId, // This will be the existing travelId in edit mode, or the new one
        imageUrls: existingImageUrls,
        updatedAt: serverTimestamp(),
      };

      let currentPostId = postId;
      let postRef;

      if (isEditMode && currentPostId) {
        postRef = doc(db, 'simple-posts', currentPostId);
      } else {
        postRef = doc(collection(db, 'simple-posts'));
        currentPostId = postRef.id;
        postData.createdAt = serverTimestamp();
      }

      if (imageFiles.length > 0) {
        const newImageUrls = await uploadImages(imageFiles);
        postData.imageUrls = [...existingImageUrls, ...newImageUrls];
      }

      if (isEditMode) {
        await updateDoc(postRef, postData);
      } else {
        await setDoc(postRef, postData);
      }

      setMessage(isEditMode ? '投稿を更新しました！' : '投稿が完了しました！');
      setTimeout(() => {
        if(currentPostId) router.push(`/post/${currentPostId}`);
      }, 2000);

    } catch (error) {
      console.error('Form submission error:', error);
      setMessage(`エラーが発生しました: ${(error as Error).message}`);
    }
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setMessage('エラー: Cloudinaryの設定が不完全です。環境変数を確認してください。');
      throw new Error('Cloudinary configuration is missing.');
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      try {
        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Cloudinary upload error response:', errorData);
          throw new Error(`Cloudinaryへのアップロードに失敗しました: ${errorData.error.message}`);
        }

        const data = await response.json();
        return data.secure_url;
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  };

  return (
    <div className="min-h-screen flex justify-center items-start py-10 bg-gray-50 dark:bg-gray-900 px-4 sm:px-8">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg pb-20">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">{isEditMode ? '投稿を編集' : '新規投稿'}</h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          <Section title="基本情報">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ニックネーム</label>
                <input type="text" value={nickname} disabled className="w-full border border-gray-200 dark:border-gray-600 bg-gray-200 dark:bg-gray-600 rounded-md px-3 py-2 text-gray-500 dark:text-gray-400 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">観戦シーズン <span className="text-red-500">*</span></label>
                <select value={season} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSeason(e.target.value)} required className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-500 transition h-[42px]">
                  <option value="">選択してください</option>
                  {Array.from({ length: new Date().getFullYear() - 1960 + 1 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    const label = `${year}/${(year + 1).toString().slice(-2)}`;
                    return <option key={label} value={label}>{label}</option>;
                  })}
                </select>
              </div>
            </div>
          </Section>

          {!isEditMode && (
            <Section title="旅の共通情報">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="new"
                      checked={travelOption === 'new'}
                      onChange={() => setTravelOption('new')}
                      className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">新しい旅を登録</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="existing"
                      checked={travelOption === 'existing'}
                      onChange={() => setTravelOption('existing')}
                      className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                      disabled={userTravels.length === 0}
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">既存の旅を選択</span>
                  </label>
                </div>

                {travelOption === 'existing' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">既存の旅</label>
                    <select
                      value={selectedTravelId}
                      onChange={(e) => setSelectedTravelId(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-500 transition h-[42px]"
                      required
                    >
                      <option value="">選択してください</option>
                      {userTravels.map(travel => (
                        <option key={travel.id} value={travel.id}>
                          {`${travel.season} (${travel.travelDuration || travel.cities || '詳細不明'})`}
                        </option>
                      ))}
                    </select>
                    {userTravels.length === 0 && <p className="text-sm text-gray-500 mt-1">登録済みの旅はありません。</p>}
                  </div>
                )}
              </div>
            </Section>
          )}

          <Section title="観戦した試合">
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-4 border border-gray-200 dark:border-gray-600">
                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300">試合</h3>
                <FormSelect label="大会" options={competitionOptions} value={match.competition} onChange={(opt) => handleMatchChange('competition', opt?.value || '')} placeholder="大会を選択..." isRequired />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">対戦カード <span className="text-red-500">*</span></label>
                  <div className="flex flex-col items-center gap-2">
                    <Select styles={customStyles} options={[...teamList, { value: 'Other', label: 'その他' }]} isSearchable placeholder="ホーム" className="w-full" value={teamList.find((t: OptionType) => t.value === match.homeTeam)} onChange={(opt) => handleMatchChange('homeTeam', opt?.value || '')} required />
                    <span className="text-gray-600 dark:text-gray-400 font-bold">vs</span>
                    <Select styles={customStyles} options={[...teamList, { value: 'Other', label: 'その他' }]} isSearchable placeholder="アウェイ" className="w-full" value={teamList.find((t: OptionType) => t.value === match.awayTeam)} onChange={(opt) => handleMatchChange('awayTeam', opt?.value || '')} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="ホームスコア" type="number" value={match.homeScore} onChange={(e) => handleMatchChange('homeScore', e.target.value)} />
                  <FormInput label="アウェイスコア" type="number" value={match.awayScore} onChange={(e) => handleMatchChange('awayScore', e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput label="日付" type="date" value={match.date} onChange={(e) => handleMatchChange('date', e.target.value)} />
                  <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">キックオフ</label>
                  <select
                    value={match.kickoff}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleMatchChange('kickoff', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-500 transition h-[42px]"
                  >
                    <option value="">選択してください</option>
                    {Array.from({ length: (21 - 11) * 4 + 1 }, (_, i) => {
                      const totalMinutes = 11 * 60 + i * 15;
                      const hours = Math.floor(totalMinutes / 60);
                      const minutes = totalMinutes % 60;
                      const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                      return <option key={time} value={time}>{time}</option>;
                    })}
                  </select>
                </div>
                </div>
                <FormInput label="スタジアム" type="text" value={match.stadium} onChange={(e) => handleMatchChange('stadium', e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="チケット代" type="number" value={match.ticketPrice} onChange={(e) => handleMatchChange('ticketPrice', e.target.value)} placeholder="例: 10000 (円)" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">購入ルート</label>
                    <select value={match.ticketPurchaseRoute} onChange={(e) => handleMatchChange('ticketPurchaseRoute', e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-500 transition h-[42px]">
                      <option value="">選択してください</option>
                      {ticketPurchaseRouteOptions.map((opt: OptionType) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>
                <FormInput label="座席・エリア" type="text" value={match.seat} onChange={(e) => handleMatchChange('seat', e.target.value)} />
                <FormTextarea label="座席レビュー" value={match.seatReview} onChange={(e) => handleMatchChange('seatReview', e.target.value)} />
              </div>
            </div>
          </Section>

          {(travelOption === 'new' || isEditMode) && (
            <>
              <Section title="観戦旅行の概要">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">渡航期間</label>
                    <DatePicker
                      selectsRange
                      startDate={travelDateRange[0]}
                      endDate={travelDateRange[1]}
                      onChange={(update: [Date | null, Date | null]) => setTravelDateRange(update)}
                      isClearable
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      locale="ja"
                      dateFormat="yyyy/MM/dd"
                      placeholderText="開始日 - 終了日"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-500 transition h-[42px]"
                      wrapperClassName="w-full"
                    />
                  </div>
                  <FormInput label="訪問都市" type="text" placeholder="例: ロンドン、マンチェスター" value={cities} onChange={(e) => setCities(e.target.value)} />
                </div>
              </Section>

              <Section title="目的地までの移動情報">
                <div className="space-y-6">
                  {flightSections.map((item) => (
                    <div key={item.type} className="space-y-4 border-t dark:border-gray-700 pt-4 first:border-t-0">
                      <h3 className={`text-md font-semibold ${item.type === 'go' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>{item.title}</h3>
                      
                      {item.flights.map((flight, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg space-y-3 relative">
                          <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">航空会社 {index + 1}</label>
                            {item.flights.length > 1 && (
                              <button type="button" onClick={() => item.remove(index)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-xs font-medium">削除</button>
                            )}
                          </div>
                          <Select styles={customStyles} options={airlineList} isSearchable placeholder="航空会社名" value={airlineList.find((a: OptionType) => a.value === flight.name)} onChange={(opt) => item.handleChange(index, 'name', opt?.value || '')} />
                          <FormInput type="text" placeholder="座席の種類（例：エコノミー）" value={flight.seat} onChange={(e: React.ChangeEvent<HTMLInputElement>) => item.handleChange(index, 'seat', e.target.value)} />
                        </div>
                      ))}
                      
                      {item.flights.length < 2 && (
                        <button type="button" onClick={item.add} className="text-blue-600 dark:text-blue-400 font-medium hover:underline transition text-sm">＋ 航空会社を追加</button>
                      )}
                      
                      <div className="mt-4 space-y-4 border-t dark:border-gray-600 pt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">出発・到着時刻</label>
                          <div className="grid grid-cols-2 gap-4">
                            <input type="time" value={item.time?.departure || ''} onChange={(e) => item.setTime({ ...item.time, departure: e.target.value })} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md px-3 py-2" />
                            <input type="time" value={item.time?.arrival || ''} onChange={(e) => item.setTime({ ...item.time, arrival: e.target.value })} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md px-3 py-2" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">便種別</label>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center">
                              <input type="radio" name={`${item.type}FlightType`} value="direct" checked={item.flightType === 'direct'} onChange={(e) => item.setFlightType(e.target.value)} className="mr-2" />
                              直行便
                            </label>
                            <label className="flex items-center">
                              <input type="radio" name={`${item.type}FlightType`} value="via" checked={item.flightType === 'via'} onChange={(e) => item.setFlightType(e.target.value)} className="mr-2" />
                              乗継便
                            </label>
                          </div>
                        </div>

                        {item.flightType === 'via' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">経由地</label>
                            <input type="text" value={item.via} onChange={(e) => item.setVia(e.target.value)} placeholder="例: ドバイ" className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md px-3 py-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="宿泊先（最大3件）">
                <div className="space-y-6">
                  {hotels.map((hotel, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-4 border border-gray-200 dark:border-gray-600 relative">
                      <div className="flex justify-between items-center">
                          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300">宿泊先 {index + 1}</h3>
                          {hotels.length > 1 && (
                            <button type="button" onClick={() => removeHotel(index)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-xs font-medium">削除</button>
                          )}
                      </div>
                      <FormInput label="宿泊先のURL" type="url" placeholder="https://example.com" value={hotel.url} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleHotelChange(index, 'url', e.target.value)} />
                      <FormInput label="コメント" type="text" placeholder="快適で立地も良かったです！" value={hotel.comment} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleHotelChange(index, 'comment', e.target.value)} />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">評価</label>
                        <select value={hotel.rating} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleHotelChange(index, 'rating', Number(e.target.value))} className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-500 transition h-[42px]">
                          <option value={0}>選択</option>
                          <option value={1}>☆1</option>
                          <option value={2}>☆2</option>
                          <option value={3}>☆3</option>
                          <option value={4}>☆4</option>
                          <option value={5}>☆5</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  {hotels.length < 3 && (
                    <button type="button" onClick={addHotel} className="text-blue-600 dark:text-blue-400 font-medium hover:underline transition text-sm">＋ 宿泊先を追加</button>
                  )}
                </div>
              </Section>

              <Section title="費用">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {costItems.map((item: { key: CostKey; label: string }) => (
                      <FormInput
                        key={item.key}
                        label={item.label}
                        type="number"
                        placeholder="例: 50000"
                        value={cost[item.key] || ''}
                        onChange={(e) => handleCostChange(item.key, e.target.value)}
                      />
                    ))}
                  </div>
                  <div className="text-right font-bold text-lg text-gray-800 dark:text-gray-200">
                    合計: {totalCost.toLocaleString()} 円
                  </div>
                </div>
              </Section>
            </>
          )}

          <Section title="おすすめスポット（最大5件）">
            <div className="space-y-6">
              {spots.map((spot, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-4 border border-gray-200 dark:border-gray-600 relative">
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300">スポット {index + 1}</h3>
                    {spots.length > 1 && (
                      <button type="button" onClick={() => removeSpot(index)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-xs font-medium">削除</button>
                    )}
                  </div>
                  <FormInput label="スポットのURL" type="url" placeholder="https://example.com" value={spot.url} onChange={(e) => handleSpotChange(index, 'url', e.target.value)} />
                  <FormInput label="コメント" type="text" placeholder="観光におすすめ！" value={spot.comment} onChange={(e) => handleSpotChange(index, 'comment', e.target.value)} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">評価</label>
                    <select value={spot.rating} onChange={(e) => handleSpotChange(index, 'rating', Number(e.target.value))} className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-500 transition h-[42px]">
                      <option value={0}>選択</option>
                      <option value={1}>☆1</option>
                      <option value={2}>☆2</option>
                      <option value={3}>☆3</option>
                      <option value={4}>☆4</option>
                      <option value={5}>☆5</option>
                    </select>
                  </div>
                </div>
              ))}
              {spots.length < 5 && (
                <button type="button" onClick={addSpot} className="text-blue-600 dark:text-blue-400 font-medium hover:underline transition text-sm">＋ おすすめスポットを追加</button>
              )}
            </div>
          </Section>
          
          <Section title="その他の情報">
            <div className="space-y-4">
              <FormTextarea label="持ち物リスト" value={items} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setItems(e.target.value)} placeholder="観戦に役立った持ち物を共有しよう" />
              <FormTextarea label="購入したグッズ" value={goods} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGoods(e.target.value)} placeholder="スタジアムや現地で買ったグッズを自慢しよう" />
              <FormTextarea label="旅の思い出・エピソード" value={episode} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEpisode(e.target.value)} placeholder="試合以外での楽しかった思い出を教えてください" />
              <FormTextarea label="これから観戦に行く人へのアドバイス" value={firstAdvice} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFirstAdvice(e.target.value)} placeholder="初めての観戦者へのメッセージ" />
            </div>
          </Section>

          <Section title="画像とカテゴリー">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">画像アップロード（最大5枚）</label>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 dark:file:bg-blue-800 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-200 dark:hover:file:bg-blue-700 transition" />
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={preview} className="relative aspect-square">
                        <Image src={preview} alt={`プレビュー ${index + 1}`} width={150} height={150} className="w-full h-full object-cover rounded-lg shadow-md" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 leading-none hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                          aria-label="画像を削除"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">カテゴリー <span className="text-red-500">*</span></label>
                <select value={category} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)} required className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-500 transition h-[42px]">
                   <option value="">選択してください</option>
                   <option value="england">イングランド</option>
                   <option value="france">フランス</option>
                   <option value="germany">ドイツ</option>
                   <option value="spain">スペイン</option>
                   <option value="italy">イタリア</option>
                   <option value="cwc">CWC</option>
                   <option value="japan_tour">ジャパンツアー</option>
                   <option value="etc">その他</option>
                </select>
              </div>
            </div>
            </Section>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-300 shadow-md disabled:bg-gray-400 dark:disabled:bg-gray-500"
              disabled={!!message && message.includes('処理中')}
            >
              {isEditMode ? '更新する' : '投稿する'}
            </button>
          </div>

          {message && (
            <div className="mt-4 text-center">
              <p className={`text-sm ${message.includes('エラー') || message.includes('失敗') ? 'text-red-500 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>{message}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
