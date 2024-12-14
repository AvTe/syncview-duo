import React from 'react';
import { Sliders } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AudioEqualizerProps {
  videoIndex: number;
}

const AudioEqualizer = ({ videoIndex }: AudioEqualizerProps) => {
  const handleBassChange = (value: number[]) => {
    // Audio processing logic will be added here
    console.log(`Bass changed for video ${videoIndex}:`, value[0]);
  };

  const handleTrebleChange = (value: number[]) => {
    console.log(`Treble changed for video ${videoIndex}:`, value[0]);
  };

  const handleEQChange = (frequency: string, value: number[]) => {
    console.log(`EQ changed for video ${videoIndex} at ${frequency}Hz:`, value[0]);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 hover:bg-muted rounded-full transition-colors">
          <Sliders className="h-5 w-5 text-primary" />
        </button>
      </SheetTrigger>
      <SheetContent className="w-[400px] bg-secondary">
        <SheetHeader>
          <SheetTitle className="text-primary-foreground">Audio Equalizer - Video {videoIndex + 1}</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="basic" className="mt-6">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="basic">Basic Controls</TabsTrigger>
            <TabsTrigger value="advanced">Graphic EQ</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-primary-foreground">Bass</Label>
                <Slider
                  defaultValue={[0]}
                  max={12}
                  min={-12}
                  step={1}
                  onValueChange={handleBassChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-primary-foreground">Treble</Label>
                <Slider
                  defaultValue={[0]}
                  max={12}
                  min={-12}
                  step={1}
                  onValueChange={handleTrebleChange}
                  className="w-full"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="advanced" className="space-y-6 mt-4">
            {[60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000].map((freq) => (
              <div key={freq} className="space-y-2">
                <Label className="text-primary-foreground">{freq}Hz</Label>
                <Slider
                  defaultValue={[0]}
                  max={12}
                  min={-12}
                  step={1}
                  onValueChange={(value) => handleEQChange(freq.toString(), value)}
                  className="w-full"
                />
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default AudioEqualizer;