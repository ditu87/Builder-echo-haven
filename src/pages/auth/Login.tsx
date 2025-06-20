import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Login: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Sign In to RentHub</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              Login functionality will be implemented in the next iteration.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
