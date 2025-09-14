"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  BarChart,
  BrainCircuit,
  UploadCloud,
  FileScan,
  CheckCircle,
  Lock,
  Twitter,
  Linkedin,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <Card className="text-center">
    <CardHeader>
      <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const HowItWorksStep = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center text-center">
    <div className="bg-primary/10 p-4 rounded-full mb-4">
      <Icon className="w-10 h-10 text-primary" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground max-w-xs">{description}</p>
  </div>
);

const TestimonialCard = ({
  name,
  role,
  testimonial,
  avatar,
}: {
  name: string;
  role: string;
  testimonial: string;
  avatar: string;
}) => (
    <Card className="h-full">
        <CardContent className="pt-6">
        <p className="italic text-muted-foreground">"{testimonial}"</p>
        <div className="flex items-center mt-4">
            <Avatar className="h-10 w-10">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
                <p className="font-semibold">{name}</p>
                <p className="text-sm text-muted-foreground">{role}</p>
            </div>
        </div>
        </CardContent>
    </Card>
);

export function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold">ClaimGuard</span>
            </Link>
            <Button asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Detect Insurance Fraud Faster with AI
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground text-balance">
              ClaimGuard analyzes your claim datasets to uncover hidden
              patterns, predict fraudulent activity, and provide actionable
              insights in minutes.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/dashboard">Get Started for Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard?demo=true">Explore the Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                A simple, three-step process to transform your fraud detection workflow.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              <HowItWorksStep
                icon={UploadCloud}
                title="1. Upload Data"
                description="Securely upload your claims data in CSV format. Our system handles parsing and preparation."
              />
              <HowItWorksStep
                icon={FileScan}
                title="2. AI Analysis"
                description="Our model performs automated exploratory data analysis and scores each claim for fraud likelihood."
              />
              <HowItWorksStep
                icon={CheckCircle}
                title="3. Get Insights"
                description="Receive an interactive dashboard with risk factors, visualizations, and actionable recommendations."
              />
            </div>
          </div>
        </section>

        {/* Features & Benefits Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">
                Why It Matters
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                Go beyond what ClaimGuard does and discover why it's a game-changer for your team.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={BarChart}
                title="Automated EDA"
                description="Instantly visualize your data without manual work. Uncover trends and anomalies at a glance."
              />
              <FeatureCard
                icon={BrainCircuit}
                title="AI-Powered Fraud Prediction"
                description="Pinpoint high-risk claims with high accuracy. Focus your team's efforts where they matter most."
              />
              <FeatureCard
                icon={ShieldCheck}
                title="Clear Risk Identification"
                description="Understand the 'why' behind the fraud score with plain-language explanations for each prediction."
              />
            </div>
          </div>
        </section>

        {/* Trust & Security Section */}
        <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <Lock className="w-16 h-16 text-primary mb-4" />
                        <h2 className="text-3xl md:text-4xl font-bold">Trust & Security is Our Priority</h2>
                        <p className="mt-4 text-muted-foreground text-lg">
                            We understand the sensitive nature of insurance data. ClaimGuard is built with enterprise-grade security to ensure your data is always protected.
                        </p>
                        <ul className="mt-6 space-y-4">
                            <li className="flex items-start">
                                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                <span><strong>End-to-End Encryption:</strong> All data is encrypted in transit and at rest.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                <span><strong>Data Privacy Compliance:</strong> We adhere to strict data privacy standards like GDPR and CCPA.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                <span><strong>Secure Processing:</strong> Your data is processed in a secure, isolated environment and is never shared.</span>
                            </li>
                        </ul>
                    </div>
                     <div className="md:w-1/2">
                        <Image 
                            src="/images/claimGuard banner s.png"
                            alt="Security illustration"
                            width={600}
                            height={400}
                            className="rounded-lg shadow-xl"
                            data-ai-hint="technology abstract"
                        />
                    </div>
                </div>
            </div>
        </section>


        {/* Social Proof/Testimonials Section */}
        <section id="testimonials" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">
                Trusted by Leading Insurers
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                See what our partners are saying about ClaimGuard.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                name="Sarah Johnson"
                role="Claims Manager, Apex Insurance"
                testimonial="ClaimGuard has revolutionized our fraud detection process. We're now identifying suspicious claims weeks earlier, saving us millions."
                avatar="https://picsum.photos/seed/woman/100/100"
              />
              <TestimonialCard
                name="Michael Chen"
                role="Data Scientist, SecureSure"
                testimonial="The automated EDA and clear risk factors have freed up my team to focus on more complex modeling. It's an invaluable tool for any insurance data team."
                avatar="https://picsum.photos/seed/man/100/100"
              />
              <TestimonialCard
                name="Emily Rodriguez"
                role="Head of Innovation, Veritas Group"
                testimonial="Implementing ClaimGuard was seamless. The insights were immediate and actionable. It's rare to find a tool that delivers on its promises so effectively."
                avatar="https://picsum.photos/seed/lady/100/100"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <Logo className="h-6 w-6 text-primary" />
                    <span className="font-semibold">ClaimGuard</span>
                </div>
                <p className="text-sm text-muted-foreground max-w-sm">AI-powered fraud detection for modern insurers. Built on a foundation of security and trust.</p>
                 <div className="flex items-center gap-4 mt-2">
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                        <Twitter className="h-5 w-5" />
                    </Link>
                     <Link href="#" className="text-muted-foreground hover:text-foreground">
                        <Linkedin className="h-5 w-5" />
                    </Link>
                </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><Link href="/dashboard?demo=true" className="text-sm text-muted-foreground hover:text-foreground">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Help Center</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link></li>
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link></li>
              </ul>
            </div>
             <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} ClaimGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
