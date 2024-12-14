import React, { useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

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
      title: "Error",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">SyncVid</h1>
          <p className="text-lg text-muted-foreground">Play two videos at once</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[0, 1].map((index) => (
            <div key={index} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter video URL"
                  value={urls[index]}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={() => handlePlay(index)}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Play
                </Button>
              </div>
              {activeVideos[index] && (
                <VideoPlayer
                  url={activeVideos[index]}
                  title={`Video ${index + 1}`}
                  onError={handleError}
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