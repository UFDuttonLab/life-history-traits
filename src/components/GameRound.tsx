import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Player, Round, ActionType, SpeciesType } from '@/types/game';
import { SCENARIOS, ACTION_DESCRIPTIONS, SPECIES_DATA } from '@/data/gameData';
import { Clock, Lightbulb, Target, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface GameRoundProps {
  round: number;
  totalRounds: number;
  players: Player[];
  onRoundComplete: (round: Round) => void;
}

export const GameRound = ({ round, totalRounds, players, onRoundComplete }: GameRoundProps) => {
  const [currentScenario] = useState(() => {
    // Select scenario based on round number, cycling through all available scenarios
    const scenarioIndex = (round - 1) % SCENARIOS.length;
    return SCENARIOS[scenarioIndex];
  });
  
  const [playerActions, setPlayerActions] = useState<Record<string, { action: ActionType; reasoning?: string }>>({});
  const [selectedPlayer, setSelectedPlayer] = useState<string>(players[0]?.id || '');
  const [showResults, setShowResults] = useState(false);
  const [roundResults, setRoundResults] = useState<Round | null>(null);
  
  const currentPlayer = players.find(p => p.id === selectedPlayer);
  const allActionsSubmitted = players.every(p => playerActions[p.id]?.action);

  // Calculate round results
  const calculateResults = (): Round => {
    const results: Round['results'] = {};
    const winners: string[] = [];
    let maxScore = 0;

    players.forEach(player => {
      const action = playerActions[player.id]?.action;
      const species = SPECIES_DATA.find(s => s.type === player.species);
      
      let score = 50; // Base score
      let populationChange = 0;
      let explanation = '';

      if (action && species) {
        // Check if this species is advantageous in this environment
        const isAdvantaged = currentScenario.advantageousStrategies.includes(player.species);
        
        // Check if the action matches the species' preferred strategies
        const actionSuitable = ACTION_DESCRIPTIONS[action].suitableFor.includes(player.species);
        
        if (isAdvantaged && actionSuitable) {
          score = 100;
          populationChange = 30;
          explanation = `Excellent strategy! Your ${species.name.toLowerCase()} thrives in this environment using ${ACTION_DESCRIPTIONS[action].name.toLowerCase()}.`;
        } else if (isAdvantaged) {
          score = 80;
          populationChange = 15;
          explanation = `Good adaptation! Your species is well-suited to this environment, though the action could be optimized.`;
        } else if (actionSuitable) {
          score = 70;
          populationChange = 5;
          explanation = `Solid choice! While this environment is challenging, you played to your species' strengths.`;
        } else {
          score = 30;
          populationChange = -10;
          explanation = `Challenging conditions. Your strategy doesn't align well with your species or this environment.`;
        }

        // Track winners
        if (score > maxScore) {
          maxScore = score;
          winners.length = 0;
          winners.push(player.id);
        } else if (score === maxScore) {
          winners.push(player.id);
        }
      }

      results[player.id] = { score, populationChange, explanation };
    });

    return {
      number: round,
      scenario: currentScenario,
      playerActions,
      results,
      winners
    };
  };

  const handleActionSelect = (action: ActionType) => {
    if (selectedPlayer) {
      setPlayerActions(prev => ({
        ...prev,
        [selectedPlayer]: {
          ...prev[selectedPlayer],
          action
        }
      }));
      
      // Auto-advance to next player
      const currentIndex = players.findIndex(p => p.id === selectedPlayer);
      const nextPlayer = players[currentIndex + 1] || players[0];
      setSelectedPlayer(nextPlayer.id);
    }
  };

  const handleReasoningChange = (reasoning: string) => {
    if (selectedPlayer) {
      setPlayerActions(prev => ({
        ...prev,
        [selectedPlayer]: {
          ...prev[selectedPlayer],
          reasoning
        }
      }));
    }
  };

  const handleSubmitRound = () => {
    const results = calculateResults();
    setRoundResults(results);
    setShowResults(true);
    toast.success("Round complete! See how your strategies performed.");
  };

  const handleNextRound = () => {
    if (roundResults) {
      onRoundComplete(roundResults);
    }
  };

  if (showResults && roundResults) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Results Header */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Round {round} Results</CardTitle>
            <CardDescription>{currentScenario.name}</CardDescription>
          </CardHeader>
        </Card>

        {/* Explanation */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-6 w-6 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">Why These Strategies Succeeded</h3>
                <p className="text-muted-foreground mb-3">{currentScenario.explanation}</p>
                <div className="flex flex-wrap gap-2">
                  {currentScenario.advantageousStrategies.map(species => {
                    const speciesData = SPECIES_DATA.find(s => s.type === species);
                    return (
                      <Badge key={species} variant="secondary">
                        {speciesData?.icon} {speciesData?.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Player Results */}
        <div className="grid md:grid-cols-2 gap-4">
          {players.map(player => {
            const result = roundResults.results[player.id];
            const action = roundResults.playerActions[player.id];
            const species = SPECIES_DATA.find(s => s.type === player.species);
            const isWinner = roundResults.winners.includes(player.id);

            return (
              <Card key={player.id} className={isWinner ? 'ring-2 ring-primary' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{species?.icon}</span>
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {player.name}
                        {isWinner && <Badge className="bg-primary">Winner!</Badge>}
                      </h3>
                      <p className="text-sm text-muted-foreground">{species?.name}</p>
                    </div>
                  </div>

                  {action && (
                    <div className="mb-3">
                      <p className="text-sm">
                        <strong>Action:</strong> {ACTION_DESCRIPTIONS[action.action].name}
                      </p>
                      {action.reasoning && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <strong>Reasoning:</strong> {action.reasoning}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Score:</span>
                      <Badge variant={result.score >= 80 ? 'default' : result.score >= 60 ? 'secondary' : 'outline'}>
                        {result.score}/100
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Population Change:</span>
                      <span className={result.populationChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {result.populationChange > 0 ? '+' : ''}{result.populationChange}
                      </span>
                    </div>
                    <p className="text-muted-foreground italic">{result.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Next Round Button */}
        <div className="text-center">
          <Button size="lg" onClick={handleNextRound}>
            {round < totalRounds ? `Continue to Round ${round + 1}` : 'View Final Results'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Round Header */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Round {round} of {totalRounds}</CardTitle>
          <CardDescription>Choose your survival strategy for this environment</CardDescription>
        </CardHeader>
      </Card>

      {/* Scenario Description */}
      <Card className="bg-gradient-to-r from-stable/10 via-resource-rich/10 to-disturbed/10">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold mb-2">{currentScenario.name}</h2>
            <Badge className="mb-3">{currentScenario.environment}</Badge>
            <p className="text-muted-foreground">{currentScenario.description}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Player Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Player Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {players.map((player) => {
                  const species = SPECIES_DATA.find(s => s.type === player.species);
                  const hasAction = playerActions[player.id]?.action;
                  
                  return (
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
                        <div className="flex items-center gap-2">
                          <span>{species?.icon}</span>
                          <span className="font-medium">{player.name}</span>
                        </div>
                        {hasAction ? (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {species?.name} • Pop: {player.population}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Selection */}
        <div className="lg:col-span-2">
          {currentPlayer && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {SPECIES_DATA.find(s => s.type === currentPlayer.species)?.icon}
                  {currentPlayer.name}'s Turn
                </CardTitle>
                <CardDescription>
                  Playing as {SPECIES_DATA.find(s => s.type === currentPlayer.species)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 mb-4">
                  {Object.entries(ACTION_DESCRIPTIONS).map(([actionKey, actionData]) => {
                    const action = actionKey as ActionType;
                    const isSelected = playerActions[currentPlayer.id]?.action === action;
                    const isSuitable = actionData.suitableFor.includes(currentPlayer.species);
                    
                    return (
                      <div
                        key={action}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                            : isSuitable
                            ? 'border-border hover:bg-accent/50 bg-accent/20'
                            : 'border-border hover:bg-muted/50 opacity-75'
                        }`}
                        onClick={() => handleActionSelect(action)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{actionData.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {actionData.description}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {isSuitable && (
                              <Badge variant="secondary" className="text-xs">Recommended</Badge>
                            )}
                            {isSelected && (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reasoning Input */}
                {playerActions[currentPlayer.id]?.action && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Explain your strategy (optional):
                    </label>
                    <Textarea
                      placeholder="Why did you choose this action for this environment?"
                      value={playerActions[currentPlayer.id]?.reasoning || ''}
                      onChange={(e) => handleReasoningChange(e.target.value)}
                      className="text-sm"
                      rows={2}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Submit Round */}
      {allActionsSubmitted && (
        <div className="text-center">
          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="text-lg font-semibold mb-2">All Players Ready!</h3>
            <p className="text-muted-foreground mb-4">
              Time to see how your species fare in this environment
            </p>
            <Button size="lg" onClick={handleSubmitRound}>
              Calculate Results
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};