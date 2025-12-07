import React from 'react';
import ReactMarkdown from 'react-markdown';
import { SearchResult } from '../types';
import { PlaceCard } from './PlaceCard';
import { Sparkles, Info } from 'lucide-react';

interface ResultListProps {
  result: SearchResult;
}

export const ResultList: React.FC<ResultListProps> = ({ result }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-20">
      
      {/* AI Summary / Verification Text */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 mb-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
        <div className="flex items-center mb-4">
          <Sparkles size={20} className="text-teal-600 mr-2" />
          <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">
            Verified Policy Details
          </h2>
        </div>
        
        <div className="prose prose-slate prose-teal max-w-none">
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a 
                  {...props} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-teal-600 hover:text-teal-800 font-medium no-underline hover:underline"
                />
              ),
              ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-5 space-y-2 mb-4" />,
              li: ({ node, ...props }) => <li {...props} className="text-slate-700" />,
              strong: ({ node, ...props }) => <strong {...props} className="text-teal-800 font-bold" />,
              p: ({ node, ...props }) => <p {...props} className="text-slate-600 leading-relaxed mb-4" />,
              h3: ({ node, ...props }) => <h3 {...props} className="text-lg font-bold text-slate-800 mt-6 mb-2" />,
            }}
          >
            {result.text}
          </ReactMarkdown>
        </div>
        <div className="mt-6 flex items-center text-xs text-slate-400 bg-slate-50 p-2 rounded-lg">
          <Info size={14} className="mr-2 flex-shrink-0" />
          <span>Policies are verified via AI analysis. Always confirm with the venue directly.</span>
        </div>
      </div>

      {/* Places Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <span className="bg-teal-100 text-teal-700 p-2 rounded-lg mr-3">
              <Sparkles size={20} />
            </span>
            Found Locations
          </h2>
        </div>

        {result.places.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.places.map((place, idx) => (
              <PlaceCard key={idx} place={place} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
             <p className="text-slate-500 mb-2">No map locations returned.</p>
             <p className="text-sm text-slate-400">Please check the text summary above for details.</p>
          </div>
        )}
      </div>

    </div>
  );
};