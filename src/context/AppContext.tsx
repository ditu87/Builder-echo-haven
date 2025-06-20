import React, { createContext, useContext, useState } from "react";
import { Category, Product } from "@/lib/supabase";

interface AppContextType {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
  selectedLocation: { city: string; state: string } | null;
  setSelectedLocation: (
    location: { city: string; state: string } | null,
  ) => void;
  priceRange: { min: number; max: number } | null;
  setPriceRange: (range: { min: number; max: number } | null) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    city: string;
    state: string;
  } | null>(null);
  const [priceRange, setPriceRange] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const value = {
    categories,
    setCategories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedLocation,
    setSelectedLocation,
    priceRange,
    setPriceRange,
    products,
    setProducts,
    loading,
    setLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
