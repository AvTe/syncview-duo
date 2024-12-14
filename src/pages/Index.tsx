import React, { useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [urls, setUrls] = useState(['', '']);
  const [activeVideos, setActiveVideos] = useState(['', '']);
  const { toast } = useToast();

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handlePlay = (index: number) => {
    if (!urls[index]) {
      toast({
        title: "Error",
        description: "Please enter a valid video URL",
        variant: "destructive",
      });
      return;
    }
    const newActiveVideos = [...activeVideos];
    newActiveVideos[index] = urls[index];
    setActiveVideos(newActiveVideos);
  };

  const handleError = (error: string) => {
    toast({
      title: "Video Error",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">SyncVid</h1>
          <p className="text-lg text-muted-foreground">
            Play two videos at once - supports YouTube and direct video URLs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[0, 1].map((index) => (
            <div key={index} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter video URL (YouTube or direct video link)"
                  value={urls[index]}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  className="flex-1 bg-background border-border"
                />
                <Button 
                  onClick={() => handlePlay(index)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Play
                </Button>
              </div>
              {activeVideos[index] && (
                <VideoPlayer
                  url={activeVideos[index]}
                  title={`Video ${index + 1}`}
                  onError={handleError}
                  index={index}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;