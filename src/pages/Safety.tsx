import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Phone,
  Mail,
  MessageSquare,
  Users,
  Camera,
  Lock,
  Eye,
  Flag,
  Star,
  MapPin,
  Clock,
  CreditCard,
  FileText,
  ArrowLeft,
} from "lucide-react";

const Safety: React.FC = () => {
  const safetyTips = [
    {
      title: "Meet in Public Places",
      description:
        "Always arrange to meet in well-lit, public locations with good foot traffic. Coffee shops, shopping centers, or busy parking lots are ideal.",
      icon: MapPin,
    },
    {
      title: "Inspect Before You Pay",
      description:
        "Thoroughly examine the item before handing over any payment. Check for damage, functionality, and ensure it matches the description.",
      icon: Eye,
    },
    {
      title: "Document Everything",
      description:
        "Take photos of the item's condition before and after rental. This protects both parties in case of disputes.",
      icon: Camera,
    },
    {
      title: "Use Secure Payment Methods",
      description:
        "Avoid cash transactions when possible. Use traceable payment methods like bank transfers, PayPal, or credit cards.",
      icon: CreditCard,
    },
    {
      title: "Verify User Profiles",
      description:
        "Check the user's verification status, reviews, and profile completeness before engaging in any transaction.",
      icon: Users,
    },
    {
      title: "Trust Your Instincts",
      description:
        "If something feels off or too good to be true, trust your gut feeling and walk away from the transaction.",
      icon: AlertTriangle,
    },
  ];

  const ownerTips = [
    {
      title: "Verify Renter Identity",
      description:
        "Ask for valid ID and verify the renter's identity before handing over your item.",
    },
    {
      title: "Require Security Deposit",
      description:
        "Always collect a refundable security deposit to cover potential damages or late returns.",
    },
    {
      title: "Set Clear Terms",
      description:
        "Establish clear rental terms including duration, pickup/return times, and usage guidelines.",
    },
    {
      title: "Create Written Agreement",
      description:
        "Document the rental agreement with terms, conditions, and both parties' contact information.",
    },
  ];

  const renterTips = [
    {
      title: "Understand the Terms",
      description:
        "Read and understand all rental terms, including late fees, damage policies, and usage restrictions.",
    },
    {
      title: "Return on Time",
      description:
        "Respect the agreed return time and communicate if you need an extension.",
    },
    {
      title: "Use Items Responsibly",
      description:
        "Treat rented items with care and use them only as intended by the owner.",
    },
    {
      title: "Report Issues Immediately",
      description:
        "If you notice any damage or issues, report them to the owner immediately.",
    },
  ];

  const trustFeatures = [
    {
      title: "User Verification",
      description:
        "Identity verification through phone, email, and document upload",
      icon: Shield,
      badge: "✓ Verified",
    },
    {
      title: "Secure Messaging",
      description: "All communications are encrypted and monitored for safety",
      icon: MessageSquare,
      badge: "Protected",
    },
    {
      title: "Review System",
      description: "Rate and review users to build community trust",
      icon: Star,
      badge: "Community Driven",
    },
    {
      title: "24/7 Support",
      description: "Our support team is available around the clock",
      icon: Clock,
      badge: "Always Available",
    },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Safety & Trust Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your safety is our top priority. Learn how Rent Bazaar keeps our
              community safe and how you can protect yourself when renting.
            </p>
          </div>
        </div>

        {/* Emergency Contact */}
        <Alert className="mb-8 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Emergency:</strong> If you feel unsafe or encounter
            suspicious activity, contact local authorities immediately. For
            non-emergency issues, reach our support team at{" "}
            <a href="mailto:support@rentbazaar.com" className="underline">
              support@rentbazaar.com
            </a>{" "}
            or call (555) 123-SAFE.
          </AlertDescription>
        </Alert>

        {/* General Safety Tips */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Essential Safety Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyTips.map((tip, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <tip.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{tip.title}</h3>
                  </div>
                  <p className="text-gray-600">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* For Owners and Renters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* For Owners */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                For Item Owners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ownerTips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">{tip.title}</h4>
                      <p className="text-sm text-gray-600">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* For Renters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                For Renters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {renterTips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">{tip.title}</h4>
                      <p className="text-sm text-gray-600">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust & Safety Features */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How We Keep You Safe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFeatures.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{feature.description}</p>
                  <Badge variant="outline" className="text-primary">
                    {feature.badge}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Red Flags */}
        <section className="mb-12">
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center justify-center">
                <Flag className="h-6 w-6 mr-2" />
                Red Flags to Watch Out For
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-800 mb-3">
                    Suspicious Behavior:
                  </h4>
                  <ul className="space-y-2 text-red-700">
                    <li>• Refuses to meet in public</li>
                    <li>• Pressures you to pay immediately</li>
                    <li>• Won't let you inspect the item</li>
                    <li>• Asks for personal information upfront</li>
                    <li>• Has no reviews or verification</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-3">
                    Communication Red Flags:
                  </h4>
                  <ul className="space-y-2 text-red-700">
                    <li>• Poor grammar or obvious scam language</li>
                    <li>• Asks to communicate outside the platform</li>
                    <li>• Prices significantly below market value</li>
                    <li>• Reluctant to answer specific questions</li>
                    <li>• Requests unusual payment methods</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Reporting */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                Report Safety Concerns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <Phone className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Emergency</h3>
                  <p className="text-gray-600 mb-3">
                    For immediate danger or illegal activity
                  </p>
                  <Button variant="destructive">Call 911</Button>
                </div>
                <div>
                  <MessageSquare className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Platform Issues</h3>
                  <p className="text-gray-600 mb-3">
                    Report users, listings, or safety concerns
                  </p>
                  <Button variant="outline">Report User</Button>
                </div>
                <div>
                  <Mail className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">General Support</h3>
                  <p className="text-gray-600 mb-3">
                    Questions, suggestions, or other concerns
                  </p>
                  <Button variant="outline" asChild>
                    <a href="mailto:support@rentbazaar.com">Email Support</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Community Guidelines */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-green-800 mb-3">
                    ✅ We Encourage:
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Honest and accurate item descriptions</li>
                    <li>• Clear, high-quality photos</li>
                    <li>• Respectful communication</li>
                    <li>• Timely responses to messages</li>
                    <li>• Fair and reasonable pricing</li>
                    <li>• Following through on commitments</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-3">
                    ❌ We Prohibit:
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Illegal items or activities</li>
                    <li>• Fraudulent or misleading listings</li>
                    <li>• Harassment or abusive behavior</li>
                    <li>• Discrimination of any kind</li>
                    <li>• Spam or unsolicited messages</li>
                    <li>• Circumventing safety measures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <div className="text-center bg-primary/5 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Rent Safely?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our community of trusted renters and owners. Start by browsing
            available items or listing your own for rent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/browse">Browse Items</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/add-product">List an Item</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Safety;
