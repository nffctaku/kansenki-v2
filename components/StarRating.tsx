'use client';

import React from 'react';

const StarRating = ({ rating, setRating }: { rating: number, setRating: (rating: number) => void }) => (
  <div className="flex items-center">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        className={`text-3xl cursor-pointer transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
        aria-label={`${star} star`}
      >
        ★
      </button>
    ))}
  </div>
);

export default StarRating;
