
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Hospital, User } from "lucide-react";
import Logo from "@/components/app/logo";

export default function Home() {
  const heroImage = {
      imageUrl: "https://images.unsplash.com/photo-1659353888906-adb3e0041693?q=80&w=2070&auto=format&fit=crop",
      description: "Indian doctor with a patient",
      imageHint: "indian doctor patient"
    };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Logo />
        <Button asChild variant="outline">
          <Link href="/login">
            Portal Login <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center py-12 md:py-24">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-primary">
              CareVerse
            </h1>
            <p className="text-xl md:text-2xl font-headline text-foreground/80">
              Inclusive Digital Healthcare for Everyone.
            </p>
            <p className="text-muted-foreground max-w-prose mx-auto lg:mx-0">
              Bridging gaps in healthcare with a unified platform that connects patients, doctors, and hospitals seamlessly. Your health history, simplified and secured.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" asChild className="font-bold">
                <Link href="/login">
                  <User className="mr-2" /> Get Started Now <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-80 md:h-96 lg:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl order-first lg:order-last">
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
