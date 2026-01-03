import { cn } from '@/lib/utils';
import { HeartPulse } from 'lucide-react';

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2 text-primary", className)}>
      <HeartPulse className="h-8 w-8" />
      <span className="text-xl font-headline font-bold">CareVerse</span>
    </div>
  );
};

export default Logo;
