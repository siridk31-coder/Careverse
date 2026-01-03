"use client";

import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

export default function VoiceCommandButton() {
  const { toast } = useToast();

  const handleVoiceCommand = () => {
    toast({
      title: "Voice Command Active",
      description: "This is a prototype. In a real app, you could speak your command now.",
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            onClick={handleVoiceCommand}
          >
            <Mic className="h-6 w-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Use Voice Command</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
