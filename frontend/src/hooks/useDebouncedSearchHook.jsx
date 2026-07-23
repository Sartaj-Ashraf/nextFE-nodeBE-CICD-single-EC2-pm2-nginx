    // src/hooks/useDebouncedSearch.js
    import { useState, useCallback } from "react";
    import { debounce } from "@/utils/debounce";
    
    export const useDebouncedSearchHook = (initialValue = "", delay = 700) => {
      const [searchTerm, setSearchTerm] = useState(initialValue);
      const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);
    
      // Debounce the search term update
      const debouncedSetSearch = useCallback(
        debounce((value) => {
          setDebouncedSearchTerm(value);
        }, delay),
        [delay]
      );
    
      // Update search term and trigger debounced search
      const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSetSearch(value);
      };
      return {
        searchTerm,
        debouncedSearchTerm,
        handleSearchChange,
        setSearchTerm,
      };
    };