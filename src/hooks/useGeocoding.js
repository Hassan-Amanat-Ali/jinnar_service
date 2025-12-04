import { useState, useEffect } from "react";

const GEOCODE_API_KEY = import.meta.env.VITE_GEOCODE_KEY;
const GEOCODE_BASE_URL = "https://geocode.maps.co";

/**
 * A custom hook to handle geocoding search with debouncing.
 * @param {string} searchTerm The location text to search for.
 * @param {number} delay The debounce delay in milliseconds.
 * @returns {{suggestions: Array<any>, isLoading: boolean}}
 */
export const useGeocoding = (searchTerm, delay = 500) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    const handler = setTimeout(() => {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(
            `${GEOCODE_BASE_URL}/search?q=${encodeURIComponent(
              searchTerm
            )}&api_key=${GEOCODE_API_KEY}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch location suggestions");
          }
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error("Geocoding error:", error);
          setSuggestions([]); // Clear suggestions on error
        } finally {
          setIsLoading(false);
        }
      };

      fetchSuggestions();
    }, delay);

    return () => clearTimeout(handler);
  }, [searchTerm, delay]);

  return { suggestions, isLoading };
};