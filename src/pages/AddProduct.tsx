import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { supabase, Category } from "@/lib/supabase";
import {
  Upload,
  X,
  Camera,
  MapPin,
  DollarSign,
  Package,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

const AddProduct: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { categories, setCategories } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    pricePerDay: "",
    pricePerWeek: "",
    pricePerMonth: "",
    city: userProfile?.city || "",
    state: userProfile?.state || "",
    address: "",
  });

  const [images, setImages] = useState<ImageFile[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
      return;
    }
    fetchCategories();
  }, [user, navigate]);

  const fetchCategories = async () => {
    if (categories.length === 0) {
      try {
        const { data } = await supabase.from("categories").select("*");
        if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (images.length + files.length > 4) {
      setErrors((prev) => ({
        ...prev,
        images: "You can upload maximum 4 images",
      }));
      return;
    }

    const newImages: ImageFile[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }));

    setImages((prev) => [...prev, ...newImages]);
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return updated;
    });
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    if (images.length < 2) {
      newErrors.images = "Please upload at least 2 images";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.pricePerDay) {
      newErrors.pricePerDay = "Daily price is required";
    } else if (
      isNaN(Number(formData.pricePerDay)) ||
      Number(formData.pricePerDay) <= 0
    ) {
      newErrors.pricePerDay = "Please enter a valid price";
    }

    if (
      formData.pricePerWeek &&
      (isNaN(Number(formData.pricePerWeek)) ||
        Number(formData.pricePerWeek) <= 0)
    ) {
      newErrors.pricePerWeek = "Please enter a valid weekly price";
    }

    if (
      formData.pricePerMonth &&
      (isNaN(Number(formData.pricePerMonth)) ||
        Number(formData.pricePerMonth) <= 0)
    ) {
      newErrors.pricePerMonth = "Please enter a valid monthly price";
    }

    if (!formData.city) {
      newErrors.city = "City is required";
    }

    if (!formData.state) {
      newErrors.state = "State is required";
    }

    if (!formData.address) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImages = async (productId: string) => {
    const uploadPromises = images.map(async (image, index) => {
      const fileExt = image.file.name.split(".").pop();
      const fileName = `${productId}_${index}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, image.file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      return {
        product_id: productId,
        image_url: urlData.publicUrl,
        is_primary: index === 0,
        order_index: index,
      };
    });

    const imageData = await Promise.all(uploadPromises);

    const { error: insertError } = await supabase
      .from("product_images")
      .insert(imageData);

    if (insertError) throw insertError;
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    setUploadProgress(0);

    try {
      // Create the product
      const { data: productData, error: productError } = await supabase
        .from("products")
        .insert([
          {
            user_id: user?.id,
            title: formData.title,
            description: formData.description,
            category_id: formData.categoryId,
            price_per_day: Number(formData.pricePerDay),
            price_per_week: formData.pricePerWeek
              ? Number(formData.pricePerWeek)
              : null,
            price_per_month: formData.pricePerMonth
              ? Number(formData.pricePerMonth)
              : null,
            city: formData.city,
            state: formData.state,
            address: formData.address,
            is_available: true,
            view_count: 0,
          },
        ])
        .select()
        .single();

      if (productError) throw productError;

      setUploadProgress(50);

      // Upload images
      if (images.length > 0) {
        await uploadImages(productData.id);
      }

      setUploadProgress(100);
      setSuccess(true);

      // Redirect to dashboard after success
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error creating listing:", error);
      setErrors({ submit: "Failed to create listing. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p>Please sign in to create a listing.</p>
        </div>
      </Layout>
    );
  }

  if (success) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Listing Created Successfully!
              </h2>
              <p className="text-gray-600 mb-4">
                Your item is now live on Rent Bazaar and available for rent.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to dashboard...
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Listing</h1>
          <p className="text-gray-600 mt-2">
            Create a new listing to rent out your item
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {step} of 2
            </span>
            <span className="text-sm text-gray-500">
              {step === 1 ? "Item Details" : "Pricing & Location"}
            </span>
          </div>
          <Progress value={step * 50} className="h-2" />
        </div>

        {errors.submit && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.submit}</AlertDescription>
          </Alert>
        )}

        {step === 1 && (
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="What are you renting out?"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your item in detail. Include condition, features, and any important information for renters."
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      handleSelectChange("categoryId", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.categoryId ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="text-sm text-red-600">{errors.categoryId}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Photos (2-4 required)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={images.length >= 4}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB each
                      </p>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.preview}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          {index === 0 && (
                            <Badge className="absolute top-2 left-2 bg-primary">
                              Primary
                            </Badge>
                          )}
                          <button
                            onClick={() => removeImage(image.id)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {errors.images && (
                    <p className="text-sm text-red-600">{errors.images}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={() => {
                  if (validateStep1()) {
                    setStep(2);
                  }
                }}
                size="lg"
              >
                Next Step
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricePerDay">Daily Rate *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="pricePerDay"
                        name="pricePerDay"
                        type="number"
                        placeholder="0.00"
                        value={formData.pricePerDay}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors.pricePerDay ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.pricePerDay && (
                      <p className="text-sm text-red-600">
                        {errors.pricePerDay}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricePerWeek">Weekly Rate (Optional)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="pricePerWeek"
                        name="pricePerWeek"
                        type="number"
                        placeholder="0.00"
                        value={formData.pricePerWeek}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors.pricePerWeek ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.pricePerWeek && (
                      <p className="text-sm text-red-600">
                        {errors.pricePerWeek}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricePerMonth">
                      Monthly Rate (Optional)
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="pricePerMonth"
                        name="pricePerMonth"
                        type="number"
                        placeholder="0.00"
                        value={formData.pricePerMonth}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors.pricePerMonth ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.pricePerMonth && (
                      <p className="text-sm text-red-600">
                        {errors.pricePerMonth}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Your city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="Your state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={errors.state ? "border-red-500" : ""}
                    />
                    {errors.state && (
                      <p className="text-sm text-red-600">{errors.state}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Street address or general area"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600">{errors.address}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    This won't be shown publicly until booking is confirmed
                  </p>
                </div>
              </CardContent>
            </Card>

            {loading && (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="mb-2">Creating your listing...</p>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Previous
              </Button>
              <Button onClick={handleSubmit} disabled={loading} size="lg">
                {loading ? "Creating Listing..." : "Create Listing"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AddProduct;
