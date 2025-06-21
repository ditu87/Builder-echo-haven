import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { supabase, Product } from "@/lib/supabase";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Eye,
  Star,
  MessageCircle,
  Phone,
  Instagram,
  Mail,
  Heart,
  Share2,
  Flag,
  Shield,
  Clock,
  DollarSign,
  Package,
  Camera,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (id) {
      fetchProduct();
      incrementViewCount();
    }
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;

    try {
      // Fetch product with related data
      const { data: productData, error } = await supabase
        .from("products")
        .select(
          `
          *,
          category:categories(*),
          user:users(*),
          images:product_images(*)
        `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      setProduct(productData);

      // Fetch related products
      if (productData.category_id) {
        const { data: relatedData } = await supabase
          .from("products")
          .select(
            `
            *,
            category:categories(*),
            user:users(*),
            images:product_images(*)
          `,
          )
          .eq("category_id", productData.category_id)
          .eq("is_available", true)
          .neq("id", id)
          .limit(3);

        if (relatedData) {
          setRelatedProducts(relatedData);
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      navigate("/404");
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async () => {
    if (!id) return;

    try {
      await supabase.rpc("increment_view_count", { product_id: id });
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const handleContactOwner = () => {
    if (!user) {
      navigate("/auth/login");
      return;
    }
    // Navigate to messages or open contact modal
    navigate(`/messages?product=${id}&user=${product?.user_id}`);
  };

  const handleWhatsAppContact = () => {
    if (!product?.user?.phone_number) return;

    const message = encodeURIComponent(
      `Hi! I'm interested in renting your ${product.title} from Rent Bazaar.`,
    );
    const phoneNumber = product.user.phone_number.replace(/\D/g, "");
    window.open(`https://wa.me/1${phoneNumber}?text=${message}`, "_blank");
  };

  const handleEmailContact = () => {
    if (!product?.user?.email) return;

    const subject = encodeURIComponent(
      `Interested in renting: ${product.title}`,
    );
    const body = encodeURIComponent(
      `Hi ${product.user.full_name},\n\nI'm interested in renting your ${product.title} that I found on Rent Bazaar.\n\nCould you please provide more details about availability and pickup arrangements?\n\nThanks!`,
    );
    window.open(`mailto:${product.user.email}?subject=${subject}&body=${body}`);
  };

  const nextImage = () => {
    if (!product?.images) return;
    setCurrentImageIndex((prev) => (prev + 1) % (product.images?.length || 1));
  };

  const prevImage = () => {
    if (!product?.images) return;
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + (product.images?.length || 1)) %
        (product.images?.length || 1),
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Product not found
            </h1>
            <p className="text-gray-600 mb-4">
              The listing you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/browse">Browse Other Items</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const isOwner = user?.id === product.user_id;

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-gray-200 rounded-lg overflow-hidden aspect-square">
              {product.images && product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[currentImageIndex]?.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Camera className="h-16 w-16 text-gray-400" />
                </div>
              )}

              {/* Image indicators */}
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.title}
                </h1>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {product.city}, {product.state}
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {product.view_count} views
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(product.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="outline">{product.category?.name}</Badge>
                <Badge variant={product.is_available ? "default" : "secondary"}>
                  {product.is_available ? "Available" : "Not Available"}
                </Badge>
              </div>
            </div>

            {/* Pricing */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Pricing
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Daily rate:</span>
                    <span className="text-2xl font-bold text-primary">
                      ${product.price_per_day}/day
                    </span>
                  </div>
                  {product.price_per_week && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Weekly rate:</span>
                      <span className="text-lg font-semibold">
                        ${product.price_per_week}/week
                      </span>
                    </div>
                  )}
                  {product.price_per_month && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Monthly rate:</span>
                      <span className="text-lg font-semibold">
                        ${product.price_per_month}/month
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Options */}
            {!isOwner && product.is_available && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Contact the Owner
                  </h3>
                  <div className="space-y-3">
                    <Button
                      onClick={handleContactOwner}
                      className="w-full"
                      size="lg"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={handleWhatsAppContact}
                        className="flex-1"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleEmailContact}
                        className="flex-1"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Owner Actions */}
            {isOwner && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Your Listing</h3>
                  <div className="space-y-3">
                    <Button asChild className="w-full">
                      <Link to={`/edit-product/${product.id}`}>
                        Edit Listing
                      </Link>
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" asChild>
                        <Link to="/dashboard">Dashboard</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to="/messages">Messages</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {product.description}
            </p>
          </CardContent>
        </Card>

        {/* Owner Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About the Owner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-white text-xl">
                  {product.user?.full_name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-semibold">
                    {product.user?.full_name}
                  </h3>
                  {product.user?.is_verified && (
                    <Badge className="bg-blue-500">✓ Verified</Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-3">
                  @{product.user?.username} • Member since{" "}
                  {new Date(product.user?.created_at || "").getFullYear()}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                    4.8 rating
                  </div>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    12 listings
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Usually responds in 1 hour
                  </div>
                </div>
                {product.user?.instagram_handle && (
                  <div className="mt-3">
                    <a
                      href={`https://instagram.com/${product.user.instagram_handle.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:text-primary/80"
                    >
                      <Instagram className="h-4 w-4 mr-1" />
                      {product.user.instagram_handle}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Safety Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">For Your Safety:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Meet in a public place</li>
                  <li>• Inspect the item before payment</li>
                  <li>• Take photos of item condition</li>
                  <li>• Use secure payment methods</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Report Issues:</h4>
                <Button variant="outline" size="sm">
                  <Flag className="h-4 w-4 mr-2" />
                  Report this listing
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Similar Items
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                    <div className="relative h-48 bg-gray-200">
                      {relatedProduct.images &&
                      relatedProduct.images.length > 0 ? (
                        <img
                          src={relatedProduct.images[0].image_url}
                          alt={relatedProduct.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Camera className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-white/90">
                          ${relatedProduct.price_per_day}/day
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {relatedProduct.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {relatedProduct.city}, {relatedProduct.state}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
