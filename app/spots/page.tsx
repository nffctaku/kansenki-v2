'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRecentSpots } from '@/hooks/useRecentSpots';
import PostCard from '@/components/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { toUnifiedPost, UnifiedPost } from '@/types/post';

const SpotsPage = () => {
  const { spots, authorProfiles, loading, error } = useRecentSpots(100); // Fetch even more spots for filtering
  const [unifiedSpots, setUnifiedSpots] = useState<UnifiedPost[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  useEffect(() => {
    if (spots.length > 0 && authorProfiles.size > 0) {
      const transformedSpots = spots
        .map(spot => toUnifiedPost(spot, 'spots', null, null, authorProfiles))
        .filter((post): post is UnifiedPost => post !== null);
      setUnifiedSpots(transformedSpots);
    }
  }, [spots, authorProfiles]);

  const filteredSpots = useMemo(() => {
    return unifiedSpots.filter(spot => {
      const typeMatch = !selectedType || spot.originalData.category === selectedType || spot.originalData.type === selectedType;
      const countryMatch = !selectedCountry || spot.originalData.country === selectedCountry;
      return typeMatch && countryMatch;
    });
  }, [unifiedSpots, selectedType, selectedCountry]);

  const typeOptions = useMemo(() => {
    const types = new Set<string>();
    unifiedSpots.forEach(spot => {
      if (spot.originalData.type) types.add(spot.originalData.type);
      if (spot.originalData.category) types.add(spot.originalData.category);
    });
    return Array.from(types);
  }, [unifiedSpots]);

  const countryOptions = useMemo(() => {
    const countries = new Set<string>();
    unifiedSpots.forEach(spot => {
      if (spot.originalData.country) countries.add(spot.originalData.country);
    });
    return Array.from(countries);
  }, [unifiedSpots]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">宿・ホテル・スポット情報</h1>

      {/* Filter UI */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded-lg shadow-lg"
        >
          <option value="">すべての種類</option>
          {typeOptions.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded-lg shadow-lg"
        >
          <option value="">すべての国</option>
          {countryOptions.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>
      
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-[300px] w-full rounded-lg" />
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredSpots.map(spot => (
            <PostCard key={spot.id} post={spot} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SpotsPage;
