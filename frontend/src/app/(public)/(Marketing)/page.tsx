"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Laptop, Users, ArrowRight, BarChart3 } from "lucide-react";
import Header from "@/components/layout/public/Header";
import { useGetMe } from "@/hooks";

const HomePage = () => {
  const {data, status} = useGetMe()
  const formattedRole = data?.data?.role.toLowerCase().replaceAll("_", "-");
  const forwardRoute = status === "success" ? `/${formattedRole}`: "/login"
  
  return (
    <>
    <Header/>
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <ShieldCheck className="w-4 h-4" /> Enterprise-Grade Asset Management
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Streamline Your Company Assets & Lifecycle Operations
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A centralized platform to manage hardware assignments, procurement requests, vendor maintenance records, and payment tracking with granular role-based access.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="gap-2"
            nativeButton={false}
            render={
              <Link href={forwardRoute}>
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            }
            >
            </Button>
            <Button variant="outline" size="lg">
              <Link href="/about-us">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Everything You Need to Control Your Inventory
            </h2>
            <p className="text-muted-foreground">
              Built for modern organizations to eliminate spreadsheet chaos and automate tracking workflows from request to return.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Laptop className="w-6 h-6" />
                </div>
                <CardTitle>Asset Tracking & Assignment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Easily assign hardware and equipment to employees, track history, and manage returns seamlessly with automated logs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <CardTitle>Procurement & Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Streamline purchase requests, track vendor orders, manage category classifications, and monitor expenditures in real time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <CardTitle>Role-Based Access Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Secure dashboards customized for Super Admins, Managers, and Employees to ensure proper authorization over operations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ready to Optimize Your Asset Operations?
          </h2>
          <p className="text-muted-foreground mb-8">
            Sign in now to access your dashboard and manage assignments, maintenance schedules, and financial records securely.
          </p>
          <Button size="lg">
            <Link href={forwardRoute}>Access Portal</Link>
          </Button>
        </div>
      </section>
    </div>
    </>
  );
};

export default HomePage;