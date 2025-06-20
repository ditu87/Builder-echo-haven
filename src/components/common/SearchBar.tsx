import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import { Search, MapPin, Filter } from "lucide-react";

interface SearchBarProps {
  showFilters?: boolean;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  showFilters = false,
  className = "",
}) => {
  const navigate = useNavigate();
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedLocation,
    setSelectedLocation,
    categories,
  } = useApp();

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [localCategory, setLocalCategory] = useState(selectedCategory || "");
  const [localCity, setLocalCity] = useState(selectedLocation?.city || "");
  const [localState, setLocalState] = useState(selectedLocation?.state || "");

  const handleSearch = () => {
    setSearchQuery(localSearchQuery);
    setSelectedCategory(localCategory || null);
    setSelectedLocation(
      localCity && localState ? { city: localCity, state: localState } : null,
    );

    // Navigate to browse page with search params
    const searchParams = new URLSearchParams();
    if (localSearchQuery) searchParams.set("q", localSearchQuery);
    if (localCategory) searchParams.set("category", localCategory);
    if (localCity) searchParams.set("city", localCity);
    if (localState) searchParams.set("state", localState);

    navigate(`/browse?${searchParams.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col md:flex-row gap-2 md:gap-0 bg-white rounded-lg shadow-lg border p-2">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="What are you looking for?"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 border-0 focus:ring-0 focus:outline-none"
          />
        </div>

        {/* Location Input */}
        <div className="flex-1 relative border-l md:border-l-gray-200">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <div className="flex">
            <Input
              placeholder="City"
              value={localCity}
              onChange={(e) => setLocalCity(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 border-0 focus:ring-0 focus:outline-none rounded-r-none"
            />
            <Input
              placeholder="State"
              value={localState}
              onChange={(e) => setLocalState(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-0 border-l focus:ring-0 focus:outline-none rounded-l-none"
            />
          </div>
        </div>

        {/* Category Filter */}
        {showFilters && (
          <div className="flex-1 border-l md:border-l-gray-200">
            <Select value={localCategory} onValueChange={setLocalCategory}>
              <SelectTrigger className="border-0 focus:ring-0 focus:outline-none">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Search Button */}
        <div className="md:ml-2">
          <Button onClick={handleSearch} className="w-full md:w-auto px-6">
            Search
          </Button>
        </div>
      </div>

      {/* Quick Suggestions */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-sm text-gray-500">Popular searches:</span>
        {[
          "Camera",
          "Car",
          "Bike",
          "Tools",
          "Party Equipment",
          "Electronics",
        ].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => {
              setLocalSearchQuery(suggestion);
              setSearchQuery(suggestion);
              navigate(`/browse?q=${suggestion}`);
            }}
            className="text-sm text-primary hover:underline"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
