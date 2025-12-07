// Type definitions for the application

export interface GroundingChunk {
  maps?: {
    title: string;
    uri: string;
    placeId?: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
        author?: string;
      }[];
    };
  };
  web?: {
    uri: string;
    title: string;
  };
}

export interface GroundingMetadata {
  groundingChunks: GroundingChunk[];
  groundingSupports?: any[];
  searchEntryPoint?: any;
}

export interface Candidate {
  content: {
    parts: { text: string }[];
  };
  groundingMetadata?: GroundingMetadata;
}

export interface SearchResult {
  text: string;
  places: GroundingChunk[];
}

export type Category = 
  | 'Parks'
  | 'Beaches'
  | 'Cafés'
  | 'Restaurants'
  | 'Shops'
  | 'Hotels'
  | 'Grooming'
  | 'Vets'
  | 'Daycare'
  | 'Training'
  | 'Walking Tracks'
  | 'Attractions'
  | 'Pet Stores';

export interface LocationState {
  lat: number;
  lng: number;
  label?: string;
}
