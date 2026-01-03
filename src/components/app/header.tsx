import Link from "next/link";
import { Hospital, User, Stethoscope } from "lucide-react";
import Logo from "./logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div className="container mx-auto flex h-16 items-center space-x-4 px-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="hidden md:flex gap-6">
             <Link href="/patient-dashboard/p1" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <User className="mr-2 h-4 w-4"/>Patient
            </Link>
            <Link href="/doctor/dashboard" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <Stethoscope className="mr-2 h-4 w-4"/>Doctor
            </Link>
            <Link href="/hospital-dashboard/hosp1" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <Hospital className="mr-2 h-4 w-4"/>Hospital
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
