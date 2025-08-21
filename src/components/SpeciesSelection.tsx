import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Player, SpeciesType } from '@/types/game';
import { SPECIES_DATA } from '@/data/gameData';
import { CheckCircle, Circle, Play } from 'lucide-react';

interface SpeciesSelectionProps {
  players: Player[];
  onSpeciesSelect: (playerId: string, species: SpeciesType) => void;
  onStartGame: () => void;
}

export const SpeciesSelection = ({ players, onSpeciesSelect, onStartGame }: SpeciesSelectionProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string>(players[0]?.id || '');

  const currentPlayer = players.find(p => p.id === selectedPlayer);
  const speciesDistribution = players.reduce((acc, player) => {
    if (player.species) {
      acc[player.species] = (acc[player.species] || 0) + 1;
    }
    return acc;
  }, {} as Record<SpeciesType, number>);

  const handleSpeciesSelect = (species: SpeciesType) => {
    if (selectedPlayer) {
      onSpeciesSelect(selectedPlayer, species);
      
      // Auto-advance to next player without species
      const nextPlayer = players.find(p => p.id !== selectedPlayer && !p.species);
      if (nextPlayer) {
        setSelectedPlayer(nextPlayer.id);
      }
    }
  };

  const allPlayersSelected = players.every(p => p.species);
  const selectedSpeciesCount = Object.keys(speciesDistribution).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Choose Your Species Strategy</CardTitle>
          <CardDescription>
            Each species has unique advantages in different environments. Select wisely!
          </CardDescription>
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="secondary">{selectedSpeciesCount}/5 species types selected</Badge>
            <Badge variant="outline">{players.filter(p => p.species).length}/8 players ready</Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Player Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Players</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedPlayer === player.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedPlayer(player.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{player.name}</span>
                      {player.species ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{SPECIES_DATA.find(s => s.type === player.species)?.icon}</span>
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    {player.species && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {SPECIES_DATA.find(s => s.type === player.species)?.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Species Options */}
        <div className="lg:col-span-2">
          <div className="grid gap-4">
            {SPECIES_DATA.map((species) => {
              const count = speciesDistribution[species.type] || 0;
              const isSelected = currentPlayer?.species === species.type;
              
              return (
                <Card
                  key={species.type}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                  onClick={() => handleSpeciesSelect(species.type)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`text-4xl p-3 rounded-full bg-${species.color}/20`}>
                        {species.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">{species.name}</h3>
                          <div className="flex items-center gap-2">
                            {count > 0 && (
                              <Badge variant="secondary">{count} selected</Badge>
                            )}
                            {isSelected && (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            )}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">{species.description}</p>
                        
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <h4 className="font-medium mb-1">Key Traits:</h4>
                            <ul className="text-muted-foreground space-y-0.5">
                              {species.characteristics.slice(0, 3).map((trait, idx) => (
                                <li key={idx}>• {trait}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-1">Preferred Habitats:</h4>
                            <ul className="text-muted-foreground space-y-0.5">
                              {species.preferredEnvironments.map((env, idx) => (
                                <li key={idx}>• {env}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Start Game Button */}
      {allPlayersSelected && (
        <div className="text-center">
          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="text-lg font-semibold mb-2">Ready to Begin!</h3>
            <p className="text-muted-foreground mb-4">
              All players have selected their species. Time to test your strategies in the wild!
            </p>
            <Button size="lg" onClick={onStartGame} className="px-8">
              <Play className="h-5 w-5 mr-2" />
              Start Ecological Competition
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};