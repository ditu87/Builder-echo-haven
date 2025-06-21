import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SearchBar from "@/components/common/SearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { supabase, Product, Category } from "@/lib/supabase";
import {
  Shield,
  Users,
  MessageSquare,
  Star,
  Camera,
  Car,
  Bike,
  Wrench,
  Home as HomeIcon,
  Music,
  Gamepad2,
  Laptop,
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
} from "lucide-react";

const Home: React.FC = () => {
  const { categories, setCategories, products, setProducts } = useApp();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("*")
        .limit(8);

      if (categoriesData) {
        setCategories(categoriesData);
      }

      // Fetch featured products (recent ones)
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
        .eq("is_available", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (productsData) {
        setProducts(productsData);
        setFeaturedProducts(productsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons = {
    Electronics: Laptop,
    Vehicles: Car,
    "Sports & Recreation": Bike,
    Tools: Wrench,
    "Home & Garden": HomeIcon,
    "Audio & Video": Music,
    Gaming: Gamepad2,
    Photography: Camera,
  };

  const features = [
    {
      icon: Shield,
      title: "Safe & Secure",
      description:
        "Verified users, secure payments, and comprehensive protection for all transactions.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Connect with trusted neighbors and build lasting relationships in your community.",
    },
    {
      icon: MessageSquare,
      title: "Easy Communication",
      description:
        "In-app messaging, WhatsApp integration, and multiple contact options.",
    },
    {
      icon: Star,
      title: "Quality Assured",
      description:
        "Rating system, verified reviews, and quality checks on all listings.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Happy Users" },
    { number: "50,000+", label: "Items Listed" },
    { number: "500+", label: "Cities" },
    { number: "99%", label: "Satisfaction Rate" },
  ];

  const safetyFeatures = [
    "Verified user profiles with ID checks",
    "Secure in-app messaging system",
    "24/7 customer support available",
    "Comprehensive insurance coverage",
    "Safe meeting location recommendations",
    "Dispute resolution process",
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Rent Anything,
              <span className="text-primary"> Anywhere</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of people sharing resources in their community.
              From cameras to cars, tools to party equipment - find what you
              need or earn by renting what you own in 2025.
            </p>

            {/* Hero Search Bar */}
            <div className="max-w-4xl mx-auto mb-8">
              <SearchBar />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/browse">Start Browsing</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/add-product">List Your Item</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-lg text-gray-600">
              Discover what's available in your area
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category) => {
              const IconComponent =
                categoryIcons[category.name as keyof typeof categoryIcons] ||
                HomeIcon;
              return (
                <Link
                  key={category.id}
                  to={`/category/${category.name.toLowerCase().replace(/ /g, "-")}`}
                  className="group"
                >
                  <Card className="h-32 hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                    <CardContent className="flex flex-col items-center justify-center h-full p-4">
                      <IconComponent className="h-8 w-8 text-primary mb-2" />
                      <span className="text-sm font-medium text-center">
                        {category.name}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/browse">
                View All Categories <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Listings */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Recently Added
            </h2>
            <p className="text-lg text-gray-600">
              Check out the latest items available for rent
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                    <div className="relative h-48 bg-gray-200">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].image_url}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Camera className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-white/90">
                          ${product.price_per_day}/day
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {product.city}, {product.state}
                        </div>
                        <div className="flex items-center">
                          {product.user?.is_verified && (
                            <Badge className="bg-blue-500 h-4 w-4 rounded-full p-0">
                              ✓
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Button asChild>
              <Link to="/browse">
                View All Listings <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How RentHub Works
            </h2>
            <p className="text-lg text-gray-600">
              Getting started is easy - just follow these simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Search & Browse</h3>
              <p className="text-gray-600">
                Find exactly what you need using our powerful search and
                category filters. Browse local listings in your area.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Arrange</h3>
              <p className="text-gray-600">
                Message the owner through our secure platform. Arrange pickup
                times and discuss any specific requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Rent & Enjoy</h3>
              <p className="text-gray-600">
                Meet safely, inspect the item, and enjoy your rental. Return it
                in the same condition when you're done.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose RentHub?
            </h2>
            <p className="text-lg text-gray-600">
              Built for trust, safety, and community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Trust */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Your Safety is Our Priority
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We've built RentHub with trust and safety at its core. From
                verified profiles to secure payments, we ensure every
                transaction is protected.
              </p>
              <ul className="space-y-3">
                {safetyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button asChild>
                  <Link to="/safety">Learn More About Safety</Link>
                </Button>
              </div>
            </div>
            <div className="lg:text-center">
              <div className="inline-block p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                <Shield className="h-32 w-32 text-primary mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-blue-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Renting?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community today and discover a new way to access the things
            you need while earning from the things you own in 2025.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/auth/register">Sign Up Now</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
              asChild
            >
              <Link to="/browse">Browse Items</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
