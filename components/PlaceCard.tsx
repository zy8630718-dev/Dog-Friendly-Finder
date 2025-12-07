import React, { useState, useEffect } from 'react';
import { GroundingChunk } from '../types';
import { MapPin, Star, ExternalLink, CheckCircle, Dog, Coffee, Home } from 'lucide-react';

interface PlaceCardProps {
  place: GroundingChunk;
  index: number;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, index }) => {
  const mapsData = place.maps;
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  // Generate a consistent ID for local storage based on place ID or title
  const storageId = mapsData?.placeId 
    ? `rating_${mapsData.placeId}` 
    : `rating_${mapsData?.title?.replace(/\s+/g, '_').toLowerCase()}`;

  // Load rating from local storage
  useEffect(() => {
    const saved = localStorage.getItem(storageId);
    if (saved) {
      setUserRating(parseInt(saved, 10));
    }
  }, [storageId]);

  const handleRate = (rating: number) => {
    setUserRating(rating);
    localStorage.setItem(storageId, rating.toString());
  };

  if (!mapsData) return null;

  const reviewSnippet = mapsData.placeAnswerSources?.reviewSnippets?.[0]?.content;
  const snippetLower = reviewSnippet?.toLowerCase() || "";
  
  // Tags Logic
  const hasPatioMention = snippetLower.match(/(patio|terrace|outdoor|outside|garden|deck)/);
  const hasIndoorMention = snippetLower.match(/(inside|indoor|interior)/);
  
  // Verification Logic: Only show the "Verified" badge if explicit keywords are found
  const hasVerificationKeywords = snippetLower.match(/(dog|pup|pet|canine|four-legged|furry|water bowl|treats)/);

  return (
    <div className="h-full bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-teal-400 transition-all duration-300 flex flex-col relative group">
      
      {/* Verified Badge - Only shown if review snippet confirms it */}
      {hasVerificationKeywords && (
        <div className="absolute top-0 right-0 bg-teal-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-bl-lg z-10 flex items-center shadow-sm">
          <CheckCircle size={10} className="mr-1" /> Verified Review
        </div>
      )}

      <div className={`h-2 w-full ${hasVerificationKeywords ? 'bg-gradient-to-r from-teal-500 to-emerald-400' : 'bg-slate-200'}`}></div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-slate-800 leading-tight pr-6">
            {mapsData.title}
          </h3>
          <a 
            href={mapsData.uri} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-teal-600 transition-colors"
            title="Open in Google Maps"
          >
            <ExternalLink size={18} />
          </a>
        </div>

        <a 
          href={mapsData.uri} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-slate-500 text-sm mb-4 hover:text-teal-600 transition-colors w-fit"
        >
          <MapPin size={14} className="mr-1" />
          <span className="truncate">Open in Maps</span>
        </a>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {hasPatioMention && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-medium">
              <Coffee size={10} className="mr-1" /> Patio Seating
            </span>
          )}
          {hasIndoorMention && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
              <Home size={10} className="mr-1" /> Indoor Allowed
            </span>
          )}
          {/* Always show Dog Friendly tag if user searched for it, but style it differently if verified */}
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${hasVerificationKeywords ? 'bg-teal-50 text-teal-700 border-teal-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
            <Dog size={10} className="mr-1" /> {hasVerificationKeywords ? 'Confirmed Dog Friendly' : 'Likely Dog Friendly'}
          </span>
        </div>

        {/* Review Snippet */}
        {reviewSnippet ? (
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
            <div className="flex items-start">
              <div className="text-amber-400 mr-2 mt-0.5 flex-shrink-0">
                 <Star size={12} fill="currentColor" />
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed line-clamp-4">
                "{reviewSnippet}"
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic mb-4">No specific review snippet available.</p>
        )}

        {/* User Rating System */}
        <div className="mt-auto pt-4 border-t border-slate-100">
           <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rate Experience</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                    title={`Rate ${star} stars`}
                  >
                    <Star 
                      size={18} 
                      className={`${(hoverRating || userRating) >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} transition-colors`}
                    />
                  </button>
                ))}
              </div>
           </div>
           {userRating > 0 && (
             <p className="text-[10px] text-right text-teal-600 font-medium mt-1 animate-pulse">Thanks for ranking this place!</p>
           )}
        </div>

      </div>
    </div>
  );
};