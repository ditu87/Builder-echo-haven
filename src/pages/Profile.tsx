import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Shield,
  Bell,
  Lock,
  Trash2,
  CheckCircle,
  AlertCircle,
  Upload,
  Instagram,
  Save,
} from "lucide-react";

const Profile: React.FC = () => {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: userProfile?.full_name || "",
    username: userProfile?.username || "",
    phoneNumber: userProfile?.phone_number || "",
    city: userProfile?.city || "",
    state: userProfile?.state || "",
    instagramHandle: userProfile?.instagram_handle || "",
    bio: "",
  });

  const [notifications, setNotifications] = useState({
    emailMessages: true,
    emailBookings: true,
    pushMessages: true,
    pushBookings: true,
    marketingEmails: false,
  });

  const [privacy, setPrivacy] = useState({
    showPhone: true,
    showEmail: false,
    showInstagram: true,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("personal");

  const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateProfile = async () => {
    if (!user) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error: updateError } = await supabase
        .from("users")
        .update({
          full_name: formData.fullName,
          username: formData.username,
          phone_number: formData.phoneNumber,
          city: formData.city,
          state: formData.state,
          instagram_handle: formData.instagramHandle || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwords.newPassword,
      });

      if (updateError) throw updateError;

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSuccess("Password updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }

    if (
      !confirm(
        "This will permanently delete all your listings and data. Are you absolutely sure?",
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      // Delete user's products first
      await supabase.from("products").delete().eq("user_id", user?.id);

      // Delete user profile
      await supabase.from("users").delete().eq("id", user?.id);

      // Sign out and redirect
      await signOut();
      navigate("/");
    } catch (error: any) {
      setError(error.message || "Failed to delete account");
      setLoading(false);
    }
  };

  if (!user || !userProfile) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-primary text-white text-2xl">
                      {userProfile.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" className="mb-2">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-sm text-gray-600">
                      JPG, GIF or PNG. Max size of 800KB
                    </p>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">
                        Account Verification
                      </p>
                      <p className="text-sm text-blue-700">
                        {userProfile.is_verified
                          ? "Your account is verified"
                          : "Verify your account to build trust"}
                      </p>
                    </div>
                  </div>
                  {userProfile.is_verified ? (
                    <Badge className="bg-blue-600">✓ Verified</Badge>
                  ) : (
                    <Button variant="outline" size="sm">
                      Verify Account
                    </Button>
                  )}
                </div>

                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagramHandle">Instagram</Label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="instagramHandle"
                        name="instagramHandle"
                        placeholder="@username"
                        value={formData.instagramHandle}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) =>
                        handleSelectChange("state", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell others about yourself..."
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={updateProfile} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Email Notifications
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Messages</p>
                          <p className="text-sm text-gray-600">
                            Get notified when you receive new messages
                          </p>
                        </div>
                        <Switch
                          checked={notifications.emailMessages}
                          onCheckedChange={(checked) =>
                            setNotifications((prev) => ({
                              ...prev,
                              emailMessages: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Booking Updates</p>
                          <p className="text-sm text-gray-600">
                            Updates about your bookings and rentals
                          </p>
                        </div>
                        <Switch
                          checked={notifications.emailBookings}
                          onCheckedChange={(checked) =>
                            setNotifications((prev) => ({
                              ...prev,
                              emailBookings: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing Emails</p>
                          <p className="text-sm text-gray-600">
                            Tips, offers, and product updates
                          </p>
                        </div>
                        <Switch
                          checked={notifications.marketingEmails}
                          onCheckedChange={(checked) =>
                            setNotifications((prev) => ({
                              ...prev,
                              marketingEmails: checked,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Push Notifications
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Messages</p>
                          <p className="text-sm text-gray-600">
                            Instant notifications for new messages
                          </p>
                        </div>
                        <Switch
                          checked={notifications.pushMessages}
                          onCheckedChange={(checked) =>
                            setNotifications((prev) => ({
                              ...prev,
                              pushMessages: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Bookings</p>
                          <p className="text-sm text-gray-600">
                            Important booking notifications
                          </p>
                        </div>
                        <Switch
                          checked={notifications.pushBookings}
                          onCheckedChange={(checked) =>
                            setNotifications((prev) => ({
                              ...prev,
                              pushBookings: checked,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwords.currentPassword}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={updatePassword} disabled={loading}>
                      Update Password
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center">
                    <Trash2 className="h-5 w-5 mr-2" />
                    Delete Account
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={deleteAccount}
                    disabled={loading}
                  >
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Phone Number</p>
                      <p className="text-sm text-gray-600">
                        Allow other users to see your phone number
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showPhone}
                      onCheckedChange={(checked) =>
                        setPrivacy((prev) => ({ ...prev, showPhone: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Email</p>
                      <p className="text-sm text-gray-600">
                        Allow other users to see your email address
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showEmail}
                      onCheckedChange={(checked) =>
                        setPrivacy((prev) => ({ ...prev, showEmail: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Instagram</p>
                      <p className="text-sm text-gray-600">
                        Allow other users to see your Instagram handle
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showInstagram}
                      onCheckedChange={(checked) =>
                        setPrivacy((prev) => ({
                          ...prev,
                          showInstagram: checked,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Privacy Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
