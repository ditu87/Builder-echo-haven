import React from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProductDetail: React.FC = () => {
  const { id } = useParams();

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Product Detail - {id}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Product detail functionality will be implemented in the next
              iteration.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProductDetail;
