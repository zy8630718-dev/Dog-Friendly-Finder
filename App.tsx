import React, { useState, useCallback } from 'react';
import { Search, MapPin, Loader2, Dog, Navigation } from 'lucide-react';
import { CategoryFilter } from './components/CategoryFilter';
import { ResultList } from './components/ResultList';
import { searchDogFriendlyPlaces } from './services/geminiService';
import { SearchResult, Category, LocationState } from './types';

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [location, setLocation] = useState<LocationState | null>(null);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle Geolocation
  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: 'Current Location'
        });
        setLoading(false);
        // If we have a category selected, trigger search immediately for better UX
        if (category) {
          handleSearch(query, category, { 
            lat: position.coords.latitude, 
            lng: position.coords.longitude 
          });
        }
      },
      (err) => {
        setLoading(false);
        setError("Unable to retrieve your location. Please check permissions.");
        console.error(err);
      }
    );
  }, [category, query]);

  const handleSearch = async (
    searchQuery: string, 
    searchCategory: Category | null,
    searchLocation: LocationState | null
  ) => {
    if ((!searchQuery && !searchLocation) && !searchCategory) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Build an effective query string
      let effectiveQuery = searchQuery;
      if (!searchQuery && searchLocation) {
        effectiveQuery = "places near me"; 
      } else if (!searchQuery && !searchLocation) {
        // Fallback if user just clicks a category without typing or location
        // We prompt for location or input
        setError("Please enter a location or allow GPS access.");
        setLoading(false);
        return;
      }

      const res = await searchDogFriendlyPlaces(
        effectiveQuery, 
        searchCategory || undefined, 
        searchLocation ? { lat: searchLocation.lat, lng: searchLocation.lng } : undefined
      );
      setResult(res);
    } catch (err) {
      setError("Failed to fetch dog-friendly places. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onCategorySelect = (newCategory: Category | null) => {
    setCategory(newCategory);
    if (newCategory) {
      handleSearch(query, newCategory, location);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query, category, location);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* Header & Hero */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-teal-600">
            <div className="bg-teal-600 text-white p-2 rounded-lg">
                <Dog size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Dog Friendly Finder</h1>
          </div>
        </div>

        {/* Search Bar Container */}
        <div className="max-w-3xl mx-auto px-4 pb-4">
          <form onSubmit={onSubmit} className="relative flex items-center shadow-lg rounded-2xl bg-white border border-slate-200 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
            <div className="pl-4 text-slate-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={location ? "Search specifically... (e.g. 'quiet parks')" : "Enter a city or location..."}
              className="w-full py-4 px-3 text-lg outline-none bg-transparent placeholder:text-slate-400 text-slate-700"
            />
            
            {/* Location Button */}
            <button
              type="button"
              onClick={handleGetLocation}
              className={`mr-2 p-2 rounded-xl flex items-center space-x-2 transition-colors
                ${location ? 'bg-teal-50 text-teal-700' : 'hover:bg-slate-100 text-slate-500'}
              `}
              title="Use my location"
            >
              {loading && !result ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Navigation size={20} className={location ? "fill-current" : ""} />
                  {location && <span className="text-xs font-semibold hidden sm:inline">Located</span>}
                </>
              )}
            </button>

            <button 
              type="submit" 
              className="mr-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
            >
              Go
            </button>
          </form>
          {location && (
            <div className="flex items-center text-xs text-slate-500 mt-2 ml-2">
              <MapPin size={12} className="mr-1" />
              Using coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </div>
          )}
        </div>

        <CategoryFilter selected={category} onSelect={onCategorySelect} />
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-8">
        
        {/* Initial Empty State */}
        {!result && !loading && !error && (
          <div className="flex flex-col items-center justify-center mt-20 px-4 text-center opacity-80">
            <div className="bg-teal-100 p-6 rounded-full mb-6">
                <Dog size={64} className="text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Where to next?</h2>
            <p className="text-slate-500 max-w-md">
              Find the perfect dog-friendly spot. Use the categories above or type a location to get started. 
              We use accurate Google Maps data to ensure you don't get turned away.
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center mt-20">
            <Loader2 size={48} className="text-teal-500 animate-spin mb-4" />
            <p className="text-slate-500 animate-pulse">Sniffing out the best spots...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-lg mx-auto mt-10 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
            <p>{error}</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <ResultList result={result} />
        )}
      </main>

      <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-200 mt-auto bg-white">
        <p>© 2024 Dog Friendly Finder. Powered by Gemini & Google Maps.</p>
      </footer>
    </div>
  );
}