import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";

// Page imports
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import ProductDetail from "./pages/ProductDetail";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Safety from "./pages/Safety";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";

// Placeholder components for routes to be implemented
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const queryClient = new QueryClient();

const AdminDashboard: React.FC = () => (
  <Layout>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Admin functionality will be implemented in the next iteration.
          </p>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

const CategoryPage: React.FC = () => (
  <Layout>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Category Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Category pages will be implemented in the next iteration.
          </p>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

const SafetyPage: React.FC = () => (
  <Layout>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Safety Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Safety guidelines will be implemented in the next iteration.
          </p>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AppProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/safety" element={<Safety />} />

              {/* Authentication routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />

              {/* Protected routes (will implement auth guards later) */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/profile" element={<Profile />} />

              {/* Admin routes */}
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
