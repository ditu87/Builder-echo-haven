import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { supabase, Product } from "@/lib/supabase";
import {
  Plus,
  Package,
  MessageSquare,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Camera,
  MapPin,
  Clock,
  AlertCircle,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const { userProfile, user } = useAuth();
  const [stats, setStats] = useState({
    activeListings: 0,
    totalViews: 0,
    totalMessages: 0,
    totalEarnings: 0,
  });
  const [listings, setListings] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch user's listings
      const { data: listingsData } = await supabase
        .from("products")
        .select(
          `
          *,
          category:categories(*),
          images:product_images(*)
        `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (listingsData) {
        setListings(listingsData);

        // Calculate stats
        const activeListings = listingsData.filter(
          (p) => p.is_available,
        ).length;
        const totalViews = listingsData.reduce(
          (sum, p) => sum + p.view_count,
          0,
        );

        setStats((prev) => ({
          ...prev,
          activeListings,
          totalViews,
        }));
      }

      // Fetch message count
      const { data: messagesData } = await supabase
        .from("messages")
        .select("id")
        .eq("receiver_id", user.id);

      if (messagesData) {
        setStats((prev) => ({
          ...prev,
          totalMessages: messagesData.length,
        }));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", listingId);

      if (error) throw error;

      setListings((prev) => prev.filter((listing) => listing.id !== listingId));
      setStats((prev) => ({
        ...prev,
        activeListings: prev.activeListings - 1,
      }));
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  const toggleListingAvailability = async (
    listingId: string,
    currentStatus: boolean,
  ) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_available: !currentStatus })
        .eq("id", listingId);

      if (error) throw error;

      setListings((prev) =>
        prev.map((listing) =>
          listing.id === listingId
            ? { ...listing, is_available: !currentStatus }
            : listing,
        ),
      );

      setStats((prev) => ({
        ...prev,
        activeListings: currentStatus
          ? prev.activeListings - 1
          : prev.activeListings + 1,
      }));
    } catch (error) {
      console.error("Error updating listing:", error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {userProfile?.full_name?.split(" ")[0]}!
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your listings and track your rental business
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild size="lg">
              <Link to="/add-product">
                <Plus className="h-4 w-4 mr-2" />
                Add New Listing
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Listings</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.activeListings}
                  </p>
                </div>
                <Package className="h-12 w-12 text-primary bg-primary/10 p-3 rounded-lg" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalViews}
                  </p>
                </div>
                <Eye className="h-12 w-12 text-blue-500 bg-blue-50 p-3 rounded-lg" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Messages</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalMessages}
                  </p>
                </div>
                <MessageSquare className="h-12 w-12 text-green-500 bg-green-50 p-3 rounded-lg" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Est. Earnings</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${stats.totalEarnings}
                  </p>
                </div>
                <DollarSign className="h-12 w-12 text-yellow-500 bg-yellow-50 p-3 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Your Listings ({listings.length})
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  Sort
                </Button>
              </div>
            </div>

            {listings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No listings yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start earning by listing your first item for rent.
                  </p>
                  <Button asChild>
                    <Link to="/add-product">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Listing
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <Card key={listing.id} className="overflow-hidden">
                    <div className="relative h-48 bg-gray-200">
                      {listing.images && listing.images.length > 0 ? (
                        <img
                          src={listing.images[0].image_url}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Camera className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={
                            listing.is_available ? "default" : "secondary"
                          }
                        >
                          {listing.is_available ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg truncate flex-1">
                          {listing.title}
                        </h3>
                        <Badge variant="outline" className="ml-2">
                          ${listing.price_per_day}/day
                        </Badge>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {listing.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {listing.city}, {listing.state}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Eye className="h-4 w-4 mr-1" />
                          {listing.view_count} views
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(listing.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          asChild
                        >
                          <Link to={`/product/${listing.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          asChild
                        >
                          <Link to={`/edit-product/${listing.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            toggleListingAvailability(
                              listing.id,
                              listing.is_available,
                            )
                          }
                        >
                          {listing.is_available ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <TrendingUp className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteListing(listing.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No messages yet
                  </h3>
                  <p className="text-gray-600">
                    Messages from interested renters will appear here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Views Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Analytics Coming Soon
                    </h3>
                    <p className="text-gray-600">
                      Detailed analytics and insights will be available here.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Category Insights
                    </h3>
                    <p className="text-gray-600">
                      See which categories perform best for your listings.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-bold">
                        {userProfile?.full_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {userProfile?.full_name}
                      </h3>
                      <p className="text-gray-600">@{userProfile?.username}</p>
                      {userProfile?.is_verified && (
                        <Badge className="bg-blue-500">✓ Verified</Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <p className="text-gray-900">{userProfile?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <p className="text-gray-900">
                        {userProfile?.phone_number}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <p className="text-gray-900">
                        {userProfile?.city}, {userProfile?.state}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Instagram
                      </label>
                      <p className="text-gray-900">
                        {userProfile?.instagram_handle || "Not connected"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button asChild>
                      <Link to="/profile">Edit Profile</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
