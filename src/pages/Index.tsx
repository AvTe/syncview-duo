import React, { useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Info, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const removePlayer = (id: number) => {
    if (players.length <= 2) {
      toast({
        title: "Cannot Remove",
        description: "Minimum of two video players required",
        variant: "destructive",
      });
      return;
    }
    setPlayers(players.filter(player => player.id !== id));
  };

  const playerPairs = players.reduce<Array<typeof players>>((result, item, index) => {
    if (index % 2 === 0) {
      result.push(players.slice(index, index + 2));
    }
    return result;
  }, []);

  return (
    <div className="min-h-screen bg-background font-poppins">
      <div className="relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81')] bg-cover bg-center">
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-red-600/20 to-red-700/20 animate-gradient" />
          </div>
        </div>
        <div className="relative">
          <div className="w-full max-w-[95%] lg:max-w-7xl mx-auto px-4 py-8 md:py-16 lg:py-24">
            <div className="backdrop-blur-md bg-blue-500/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] rounded-2xl p-6 md:p-8 lg:p-12 border border-white/10 animate-fade-in">
              <div className="text-center mb-8 md:mb-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-primary font-bebas-neue tracking-wider">
                    SyncVid
                  </h1>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Watch multiple videos simultaneously</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
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
                            <div className="relative flex-1">
                              <Input
                                type="text"
                                placeholder="Enter video URL (YouTube or direct video link)"
                                value={player.url}
                                onChange={(e) => handleUrlChange(player.id, e.target.value)}
                                className="flex-1 bg-secondary/60 backdrop-blur-sm border-muted pr-10"
                              />
                              <Tooltip>
                                <TooltipTrigger className="absolute right-3 top-1/2 -translate-y-1/2">
                                  <Info className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Paste YouTube URL or direct video link</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handlePlay(player.id)}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 sm:flex-none"
                              >
                                Play
                              </Button>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => removePlayer(player.id)}
                                    className="bg-secondary/60 border-muted hover:bg-secondary/80"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Remove video player</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
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
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={addPlayer}
                              variant="outline"
                              className="gap-2 bg-secondary/60 backdrop-blur-sm border-muted hover:bg-secondary/80"
                            >
                              <Plus size={20} />
                              Add Player
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add another video player</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;