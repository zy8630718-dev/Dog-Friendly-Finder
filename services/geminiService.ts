import { GoogleGenAI } from "@google/genai";
import { SearchResult } from "../types";

const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export const searchDogFriendlyPlaces = async (
  query: string,
  category?: string,
  location?: { lat: number; lng: number }
): Promise<SearchResult> => {
  try {
    const model = "gemini-2.5-flash";
    
    // Construct a specific prompt to encourage helpful details
    const baseQuery = category 
      ? `Find verified dog-friendly ${category} in or near ${query}`
      : `${query} dog friendly`;

    const finalQuery = `
      ${baseQuery}. 
      
      CRITICAL INSTRUCTION: You are a strict dog-friendly verifier. 
      Only return places where you can find EVIDENCE of them being dog-friendly (e.g., reviews mentioning "dogs", "pups", "water bowls", or "patio").
      
      If a place usually doesn't allow dogs (like many indoor restaurants), DO NOT list it unless you find a specific "dog-friendly" attribute or review.
      
      In your text summary, you MUST provide a verification status for each place found. Format it like this:
      - **[Place Name]**: [Policy/Verification Details] (e.g., "Large dog-friendly patio", "Allowed inside", "Reviews mention water bowls provided").
      
      If the search result is vague, assume it is NOT dog friendly. Quality over quantity.
    `;

    // Tool configuration for Maps Grounding
    const tools = [{ googleMaps: {} }];
    
    let toolConfig = undefined;
    if (location) {
      toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: location.lat,
            longitude: location.lng,
          },
        },
      };
    }

    const response = await ai.models.generateContent({
      model,
      contents: finalQuery,
      config: {
        tools,
        toolConfig,
      },
    });

    const candidate = response.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text || "No verified dog-friendly places found matching strict criteria.";
    
    // Extract map chunks if they exist
    const chunks = candidate?.groundingMetadata?.groundingChunks || [];

    // Filter only chunks that have map data to avoid empty links
    const placeChunks = chunks.filter(c => c.maps?.title && c.maps?.uri);

    return {
      text,
      places: placeChunks,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};