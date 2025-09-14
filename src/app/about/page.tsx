import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Twitter, Linkedin } from 'lucide-react';

export default function AboutPage() {
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
        {/* Page Header */}
        <section className="relative h-64 md:h-80 w-full">
          <Image
            src="/images/claimGuard banner s.png"
            alt="ClaimGuard Banner"
            fill
            style={{ objectFit: 'cover' }}
            className="absolute inset-0"
            data-ai-hint="technology abstract"
            priority
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white text-center">
              About ClaimGuard
            </h1>
          </div>
        </section>

        {/* The Mission Statement */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-primary">
                Our Mission: Bringing Clarity to a Complex Problem
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                In the world of insurance, identifying fraudulent claims is a
                constant challenge that costs invaluable time and resources. We
                believe that technology, specifically AI, can bring powerful

                clarity and efficiency to this process.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                ClaimGuard was built to empower insurance professionals by
                transforming complex datasets into clear, actionable insights,
                allowing experts to make faster and more accurate decisions.
              </p>
            </div>
          </div>
        </section>
        
        <div className='bg-muted/50'><div className='container mx-auto'><hr/></div></div>

        {/* The Founder Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">Meet the Founder</h2>
                <p className="mt-6 text-muted-foreground">
                  ClaimGuard was founded by Manas Srivastava, a software developer and AI enthusiast passionate about creating tools that solve significant real-world challenges.
                </p>
                <p className="mt-4 text-muted-foreground">
                  With a background in software engineering and a deep interest in the practical applications of machine learning, Manas identified a critical need in the insurance industry for a tool that was not only intelligent but also intuitive and accessible. He built ClaimGuard from the ground up with a simple goal: to automate the heavy lifting of data analysis, freeing up professionals to focus on what they do best—making critical, high-stakes judgments.
                </p>
              </div>
              <div className="flex justify-center">
                 <Image
                    src="/images/image.png"
                    alt="Manas Srivastava, Founder of ClaimGuard"
                    width={400}
                    height={400}
                    className="rounded-full shadow-xl object-cover aspect-square"
                    data-ai-hint="headshot portrait"
                  />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to see the difference?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Experience the power of AI-driven fraud detection firsthand.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/dashboard?demo=true">Explore the Interactive Demo</Link>
              </Button>
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
                <li><Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link></li>
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
