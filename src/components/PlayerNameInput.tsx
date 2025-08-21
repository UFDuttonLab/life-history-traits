import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Play } from 'lucide-react';

interface PlayerNameInputProps {
  onPlayersReady: (playerNames: string[]) => void;
}

export const PlayerNameInput = ({ onPlayersReady }: PlayerNameInputProps) => {
  const [playerNames, setPlayerNames] = useState<string[]>(Array(8).fill(''));
  
  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleSubmit = () => {
    onPlayersReady(playerNames);
  };

  const filledNames = playerNames.filter(name => name.trim() !== '').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Users className="h-6 w-6" />
            Player Registration
          </CardTitle>
          <CardDescription>
            Enter names for all 8 players who will compete in the ecological simulation
          </CardDescription>
          <Badge variant="outline" className="mx-auto mt-2">
            {filledNames}/8 players registered
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {playerNames.map((name, index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Player {index + 1}
                </label>
                <Input
                  placeholder={`Enter name for Player ${index + 1}`}
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          <div className="text-center space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Game Overview</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <Badge variant="secondary" className="mb-1">6 Rounds</Badge>
                  <p className="text-muted-foreground">Different environments</p>
                </div>
                <div>
                  <Badge variant="secondary" className="mb-1">8 Scenarios</Badge>
                  <p className="text-muted-foreground">Unique challenges</p>
                </div>
                <div>
                  <Badge variant="secondary" className="mb-1">15 Minutes</Badge>
                  <p className="text-muted-foreground">Typical game time</p>
                </div>
              </div>
            </div>

            <Button 
              size="lg" 
              onClick={handleSubmit}
              disabled={filledNames === 0}
              className="px-8"
            >
              <Play className="h-5 w-5 mr-2" />
              {filledNames === 0 ? 'Enter at least one player name' : 
               filledNames < 8 ? `Continue with ${filledNames} players` : 
               'Start Species Selection'}
            </Button>
            
            {filledNames > 0 && filledNames < 8 && (
              <p className="text-sm text-muted-foreground">
                Remaining slots will be filled with default names
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};