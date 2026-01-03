import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Hospital, User } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Logo from "@/components/app/logo";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Logo />
        <Button variant="ghost" asChild>
          <Link href="/doctor/dashboard">Staff Login</Link>
        </Button>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center py-12 md:py-24">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-primary">
              CareVerse
            </h1>
            <p className="text-xl md:text-2xl font-headline text-foreground/80">
              Inclusive Digital Healthcare for Everyone.
            </p>
            <p className="text-muted-foreground max-w-prose">
              Bridging gaps in healthcare with a unified platform that connects patients, doctors, and hospitals seamlessly. Your health history, simplified and secured.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="font-bold">
                <Link href="/patient-dashboard/p1">
                  <User className="mr-2" /> Patient Portal <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild className="font-bold">
                <Link href="/hospital-dashboard/hosp1">
                  <Hospital className="mr-2" /> Hospital Portal
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-96 lg:h-full w-full rounded-2xl overflow-hidden shadow-2xl">
            {heroImage && (
               <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} CareVerse Platform. All Rights Reserved.
      </footer>
    </div>
  );
}
