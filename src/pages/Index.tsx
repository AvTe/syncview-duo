import React, { useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

const Index = () => {
  const [players, setPlayers] = useState([
    { id: 0, url: '', active: false },
    { id: 1, url: '', active: false }
  ]);
  const { toast } = useToast();

  const handleUrlChange = (id: number, value: string) => {
    setPlayers(players.map(player => 
      player.id === id ? { ...player, url: value } : player
    ));
  };

  const handlePlay = (id: number) => {
    const player = players.find(p => p.id === id);
    if (!player?.url) {
      toast({
        title: "Error",
        description: "Please enter a valid video URL",
        variant: "destructive",
      });
      return;
    }
    setPlayers(players.map(player => 
      player.id === id ? { ...player, active: true } : player
    ));
  };

  const handleError = (error: string) => {
    toast({
      title: "Video Error",
      description: error,
      variant: "destructive",
    });
  };

  const addPlayer = () => {
    const newId = Math.max(...players.map(p => p.id)) + 1;
    setPlayers([...players, { id: newId, url: '', active: false }]);
  };

  const playerPairs = players.reduce<Array<typeof players>>((result, item, index) => {
    if (index % 2 === 0) {
      result.push(players.slice(index, index + 2));
    }
    return result;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-muted/20 backdrop-blur-sm">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm" />
        <div className="relative w-full max-w-[95%] lg:max-w-7xl mx-auto px-4 py-8 md:py-16 lg:py-24">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
              SyncVid
            </h1>
            <p className="mt-3 md:mt-4 text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Play multiple videos at once - supports YouTube and direct video URLs. Perfect for comparing content or watching multiple streams simultaneously.
            </p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {playerPairs.map((pair, pairIndex) => (
              <div key={pairIndex} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                  {pair.map((player) => (
                    <div key={player.id} className="space-y-3 md:space-y-4">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          type="text"
                          placeholder="Enter video URL (YouTube or direct video link)"
                          value={player.url}
                          onChange={(e) => handleUrlChange(player.id, e.target.value)}
                          className="flex-1 bg-background/60 backdrop-blur-sm border-border"
                        />
                        <Button 
                          onClick={() => handlePlay(player.id)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                        >
                          Play
                        </Button>
                      </div>
                      {player.active && (
                        <VideoPlayer
                          url={player.url}
                          title={`Video ${player.id + 1}`}
                          onError={handleError}
                          index={player.id}
                        />
                      )}
                    </div>
                  ))}
                </div>
                {pairIndex === playerPairs.length - 1 && (
                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={addPlayer}
                      variant="outline"
                      className="gap-2 bg-background/60 backdrop-blur-sm"
                    >
                      <Plus size={20} />
                      Add Player
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;