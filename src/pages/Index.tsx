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

  // Group players into pairs
  const playerPairs = players.reduce<Array<typeof players>>((result, item, index) => {
    if (index % 2 === 0) {
      result.push(players.slice(index, index + 2));
    }
    return result;
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">SyncVid</h1>
          <p className="text-lg text-muted-foreground">
            Play multiple videos at once - supports YouTube and direct video URLs
          </p>
        </div>

        <div className="space-y-8">
          {playerPairs.map((pair, pairIndex) => (
            <div key={pairIndex} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {pair.map((player) => (
                  <div key={player.id} className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter video URL (YouTube or direct video link)"
                        value={player.url}
                        onChange={(e) => handleUrlChange(player.id, e.target.value)}
                        className="flex-1 bg-background border-border"
                      />
                      <Button 
                        onClick={() => handlePlay(player.id)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
                <div className="flex justify-center">
                  <Button
                    onClick={addPlayer}
                    variant="outline"
                    className="gap-2"
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
  );
};

export default Index;