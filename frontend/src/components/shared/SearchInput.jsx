import React, { memo } from "react";
import { Search } from "lucide-react";
import { SearchTextInput } from "@/components";

const SearchInput = memo(({ searchTerm, handleSearchChange, placeholder }) => (
  <div className="relative w-full md:max-w-sm">
    <div className="absolute top-1/2 -translate-y-1/2 left-4 flex items-center pointer-events-none">
      <Search size={18} className="text-gray-400" />
    </div>
    <SearchTextInput
      name="search"
      placeholder={placeholder}
      value={searchTerm}
      onChange={handleSearchChange}
    />
  </div>
));
export default SearchInput;
