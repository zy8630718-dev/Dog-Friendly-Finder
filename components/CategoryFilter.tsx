import React from 'react';
import { Category } from '../types';
import { 
  Trees, Umbrella, Coffee, Utensils, ShoppingBag, 
  Home, Scissors, Stethoscope, Heart, GraduationCap, 
  Map, Ticket, Dog 
} from 'lucide-react';

interface CategoryFilterProps {
  selected: Category | null;
  onSelect: (category: Category | null) => void;
}

const categories: { label: Category; icon: React.ReactNode }[] = [
  { label: 'Parks', icon: <Trees size={16} /> },
  { label: 'Beaches', icon: <Umbrella size={16} /> },
  { label: 'Cafés', icon: <Coffee size={16} /> },
  { label: 'Restaurants', icon: <Utensils size={16} /> },
  { label: 'Shops', icon: <ShoppingBag size={16} /> },
  { label: 'Hotels', icon: <Home size={16} /> },
  { label: 'Grooming', icon: <Scissors size={16} /> },
  { label: 'Vets', icon: <Stethoscope size={16} /> },
  { label: 'Daycare', icon: <Heart size={16} /> },
  { label: 'Training', icon: <GraduationCap size={16} /> },
  { label: 'Walking Tracks', icon: <Map size={16} /> },
  { label: 'Attractions', icon: <Ticket size={16} /> },
  { label: 'Pet Stores', icon: <Dog size={16} /> },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selected, onSelect }) => {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar py-4">
      <div className="flex space-x-2 px-4 min-w-max">
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => onSelect(selected === cat.label ? null : cat.label)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
              ${selected === cat.label 
                ? 'bg-teal-600 text-white border-teal-600 shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400 hover:text-teal-600'}
            `}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
