import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SearchBar from "@/components/common/SearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useApp } from "@/context/AppContext";
import { supabase, Product } from "@/lib/supabase";
import { sampleCategories } from "@/data/sampleCategories";
import {
  Camera,
  MapPin,
  Grid3X3,
  List,
  Filter,
  SlidersHorizontal,
  Calendar,
  Star,
  X,
} from "lucide-react";

const Browse: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
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
  } = useApp();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState([0, 500]);
  const [availableOnly, setAvailableOnly] = useState(true);

  useEffect(() => {
    // Initialize from URL params
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const state = searchParams.get("state");

    if (q) setSearchQuery(q);
    if (category) setSelectedCategory(category);
    if (city && state) setSelectedLocation({ city, state });

    fetchInitialData();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedLocation,
    priceRange,
    sortBy,
    availableOnly,
  ]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Fetch categories if not already loaded
      if (categories.length === 0) {
        const { data: categoriesData } = await supabase
          .from("categories")
          .select("*");

        if (categoriesData && categoriesData.length > 0) {
          setCategories(categoriesData);
        } else {
          // Use sample categories as fallback
          const fallbackCategories = sampleCategories.map((cat, index) => ({
            id: `sample-${index}`,
            ...cat,
            created_at: new Date().toISOString(),
          }));
          setCategories(fallbackCategories);
        }
      }

      // Fetch all products
      const { data: productsData } = await supabase
        .from("products")
        .select(
          `
          *,
          category:categories(*),
          user:users(*),
          images:product_images(*)
        `,
        )
        .order("created_at", { ascending: false });

      if (productsData) {
        setProducts(productsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category_id === selectedCategory,
      );
    }

    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter(
        (product) =>
          product.city.toLowerCase() === selectedLocation.city.toLowerCase() &&
          product.state.toLowerCase() === selectedLocation.state.toLowerCase(),
      );
    }

    // Filter by price range
    if (priceRange) {
      filtered = filtered.filter(
        (product) =>
          product.price_per_day >= priceRange.min &&
          product.price_per_day <= priceRange.max,
      );
    }

    // Filter by availability
    if (availableOnly) {
      filtered = filtered.filter((product) => product.is_available);
    }

    // Sort products
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );
        break;
      case "price-low":
        filtered.sort((a, b) => a.price_per_day - b.price_per_day);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price_per_day - a.price_per_day);
        break;
      case "popular":
        filtered.sort((a, b) => b.view_count - a.view_count);
        break;
    }

    setFilteredProducts(filtered);
  };

  const applyPriceFilter = () => {
    setPriceRange({ min: localPriceRange[0], max: localPriceRange[1] });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedLocation(null);
    setPriceRange(null);
    setLocalPriceRange([0, 500]);
    setAvailableOnly(true);
    setSearchParams({});
  };

  const activeFiltersCount = [
    searchQuery,
    selectedCategory,
    selectedLocation,
    priceRange,
  ].filter(Boolean).length;

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Search Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <SearchBar showFilters className="mb-4" />

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-sm text-gray-500">Active filters:</span>
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Search: {searchQuery}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSearchQuery("")}
                    />
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Category:{" "}
                    {categories.find((c) => c.id === selectedCategory)?.name}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedCategory(null)}
                    />
                  </Badge>
                )}
                {selectedLocation && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Location: {selectedLocation.city}, {selectedLocation.state}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedLocation(null)}
                    />
                  </Badge>
                )}
                {priceRange && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Price: ${priceRange.min} - ${priceRange.max}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setPriceRange(null)}
                    />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </Button>
              </div>

              <div
                className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}
              >
                {/* Price Range */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-4">
                      Price Range (per day)
                    </h3>
                    <div className="space-y-4">
                      <Slider
                        value={localPriceRange}
                        onValueChange={setLocalPriceRange}
                        max={500}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>${localPriceRange[0]}</span>
                        <span>${localPriceRange[1]}</span>
                      </div>
                      <Button
                        onClick={applyPriceFilter}
                        size="sm"
                        className="w-full"
                      >
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Availability */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-4">Availability</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={availableOnly}
                          onChange={(e) => setAvailableOnly(e.target.checked)}
                          className="mr-2"
                        />
                        Available now
                      </label>
                    </div>
                  </CardContent>
                </Card>

                {/* Categories */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-4">Categories</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`block w-full text-left px-2 py-1 rounded text-sm ${
                          !selectedCategory
                            ? "bg-primary text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`block w-full text-left px-2 py-1 rounded text-sm ${
                            selectedCategory === category.id
                              ? "bg-primary text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {searchQuery
                      ? `Search Results for "${searchQuery}"`
                      : "Browse Items"}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {filteredProducts.length} items found
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  {/* View Mode Toggle */}
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Sort Options */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products Grid/List */}
              {loading ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <div className={viewMode === "grid" ? "h-48" : "h-32"}>
                        <div className="bg-gray-200 rounded-t-lg h-full"></div>
                      </div>
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No items found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or browse all categories.
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="group"
                    >
                      <Card
                        className={`overflow-hidden hover:shadow-lg transition-all duration-200 group-hover:scale-105 ${
                          viewMode === "list" ? "flex" : ""
                        }`}
                      >
                        <div
                          className={`relative bg-gray-200 ${
                            viewMode === "grid"
                              ? "h-48"
                              : "w-32 h-32 flex-shrink-0"
                          }`}
                        >
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0].image_url}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Camera className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-white/90">
                              ${product.price_per_day}/day
                            </Badge>
                          </div>
                          {!product.is_available && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge variant="destructive">Unavailable</Badge>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4 flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                              {product.title}
                            </h3>
                            {product.user?.is_verified && (
                              <Badge className="bg-blue-500 h-4 w-4 rounded-full p-0 ml-2">
                                ✓
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              {product.city}, {product.state}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(
                                product.created_at,
                              ).toLocaleDateString()}
                            </div>
                          </div>
                          {viewMode === "list" && (
                            <div className="mt-3 flex items-center justify-between">
                              <Badge variant="outline">
                                {product.category?.name}
                              </Badge>
                              <div className="flex items-center text-sm text-gray-500">
                                <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                                <span>4.8</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {filteredProducts.length > 0 &&
                filteredProducts.length % 12 === 0 && (
                  <div className="text-center mt-8">
                    <Button variant="outline">Load More</Button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Browse;
