import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Player, Round } from '@/types/game';
import { SPECIES_DATA } from '@/data/gameData';
import { Trophy, Target, BarChart3, RefreshCw, Crown } from 'lucide-react';

interface GameResultsProps {
  players: Player[];
  rounds: Round[];
  onPlayAgain: () => void;
}

export const GameResults = ({ players, rounds, onPlayAgain }: GameResultsProps) => {
  // Sort players by total score
  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);
  const winner = sortedPlayers[0];
  
  // Calculate statistics
  const avgScore = players.reduce((sum, p) => sum + p.totalScore, 0) / players.length;
  const totalWins = rounds.reduce((acc, round) => {
    round.winners.forEach(winnerId => {
      acc[winnerId] = (acc[winnerId] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Game Complete Header */}
      <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl">Ecological Competition Complete!</CardTitle>
          <div className="flex justify-center gap-4 mt-4">
            <Badge className="bg-primary text-primary-foreground">
              {rounds.length} Rounds Completed
            </Badge>
            <Badge variant="secondary">
              {players.length} Species Competed
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Winner Announcement */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <Crown className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">🏆 Ecological Victory!</h2>
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-3xl">
              {SPECIES_DATA.find(s => s.type === winner.species)?.icon}
            </span>
            <div>
              <h3 className="text-xl font-semibold">{winner.name}</h3>
              <p className="text-muted-foreground">
                {SPECIES_DATA.find(s => s.type === winner.species)?.name}
              </p>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <Badge className="bg-primary text-lg px-4 py-2">
              {winner.totalScore} Total Points
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {winner.population} Final Population
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Final Standings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Final Standings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedPlayers.map((player, index) => {
                const species = SPECIES_DATA.find(s => s.type === player.species);
                const wins = totalWins[player.id] || 0;
                
                return (
                  <div
                    key={player.id}
                    className={`p-4 rounded-lg border ${
                      index === 0 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-2xl">{species?.icon}</span>
                        <div>
                          <h4 className="font-semibold">{player.name}</h4>
                          <p className="text-sm text-muted-foreground">{species?.name}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex gap-2 mb-1">
                          <Badge variant="outline">{player.totalScore} pts</Badge>
                          <Badge variant="secondary">{wins} wins</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Pop: {player.population}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Round-by-Round Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Round Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rounds.map((round, index) => (
                <div key={round.number} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Round {round.number}</h4>
                    <Badge variant="outline">{round.scenario.environment}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {round.scenario.name}
                  </p>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Winners: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {round.winners.map(winnerId => {
                          const player = players.find(p => p.id === winnerId);
                          const species = SPECIES_DATA.find(s => s.type === player?.species);
                          return (
                            <Badge key={winnerId} className="text-xs">
                              {species?.icon} {player?.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium">Successful Strategies: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {round.scenario.advantageousStrategies.map(strategy => {
                          const species = SPECIES_DATA.find(s => s.type === strategy);
                          return (
                            <Badge key={strategy} variant="secondary" className="text-xs">
                              {species?.icon} {species?.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Key Learning Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Strategy Diversity</h4>
              <p className="text-2xl font-bold text-primary mb-1">
                {new Set(players.map(p => p.species)).size}/5
              </p>
              <p className="text-sm text-muted-foreground">
                Different species strategies used
              </p>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Average Performance</h4>
              <p className="text-2xl font-bold text-primary mb-1">
                {Math.round(avgScore)}
              </p>
              <p className="text-sm text-muted-foreground">
                Points per player
              </p>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Environmental Variety</h4>
              <p className="text-2xl font-bold text-primary mb-1">
                {new Set(rounds.map(r => r.scenario.environment)).size}
              </p>
              <p className="text-sm text-muted-foreground">
                Different habitat types
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-accent/20 rounded-lg">
            <h4 className="font-semibold mb-2">What We Learned:</h4>
            <ul className="text-sm space-y-1">
              <li>• <strong>r-selected species</strong> excel in disturbed, unpredictable environments</li>
              <li>• <strong>K-selected species</strong> dominate stable, competitive environments</li>
              <li>• <strong>Stress-tolerant species</strong> survive harsh conditions others cannot</li>
              <li>• <strong>Competitive species</strong> monopolize resources when abundant</li>
              <li>• <strong>Ruderal species</strong> are first to colonize new habitats</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Play Again */}
      <div className="text-center">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Ready for Another Ecological Challenge?</h3>
          <p className="text-muted-foreground mb-4">
            Test different strategies and see how species adapt to new environments
          </p>
          <Button size="lg" onClick={onPlayAgain} className="px-8">
            <RefreshCw className="h-5 w-5 mr-2" />
            Play Again
          </Button>
        </Card>
      </div>
    </div>
  );
};