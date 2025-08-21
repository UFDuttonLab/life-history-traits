import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GameState, Player, Round, SpeciesType } from '@/types/game';
import { SPECIES_DATA, SCENARIOS } from '@/data/gameData';
import { SpeciesSelection } from './SpeciesSelection';
import { GameRound } from './GameRound';
import { GameResults } from './GameResults';
import { GameLobby } from './GameLobby';
import { Leaf, Users, Trophy } from 'lucide-react';

const EcologyGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    gameId: 'eco-game-' + Date.now(),
    players: [],
    currentRound: 0,
    totalRounds: 4,
    rounds: [],
    gamePhase: 'waiting'
  });

  // Initialize game with demo players for single-player experience
  useEffect(() => {
    const demoPlayers: Player[] = Array.from({ length: 8 }, (_, i) => ({
      id: `player-${i + 1}`,
      name: `Player ${i + 1}`,
      species: 'r-selected' as SpeciesType, // Will be selected later
      population: 100,
      totalScore: 0
    }));
    
    setGameState(prev => ({
      ...prev,
      players: demoPlayers,
      gamePhase: 'species-selection'
    }));
  }, []);

  const handleSpeciesSelection = (playerId: string, species: SpeciesType) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p => 
        p.id === playerId ? { ...p, species } : p
      )
    }));
  };

  const startGame = () => {
    // Auto-assign remaining species for demo
    const usedSpecies: SpeciesType[] = [];
    const availableSpecies = SPECIES_DATA.map(s => s.type);
    
    const updatedPlayers = gameState.players.map(player => {
      if (player.species) return player;
      
      const remainingSpecies = availableSpecies.filter(s => 
        !usedSpecies.includes(s) || usedSpecies.filter(used => used === s).length < 2
      );
      const randomSpecies = remainingSpecies[Math.floor(Math.random() * remainingSpecies.length)];
      usedSpecies.push(randomSpecies);
      
      return { ...player, species: randomSpecies };
    });

    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
      gamePhase: 'round-in-progress',
      currentRound: 1
    }));
    
    toast.success("Game started! Let the ecological competition begin!");
  };

  const handleRoundComplete = (round: Round) => {
    setGameState(prev => {
      const updatedPlayers = prev.players.map(player => {
        const result = round.results[player.id];
        return {
          ...player,
          population: Math.max(0, player.population + result.populationChange),
          totalScore: player.totalScore + result.score
        };
      });

      const updatedRounds = [...prev.rounds, round];
      const nextRound = prev.currentRound + 1;
      
      if (nextRound > prev.totalRounds) {
        return {
          ...prev,
          players: updatedPlayers,
          rounds: updatedRounds,
          gamePhase: 'game-complete'
        };
      }

      return {
        ...prev,
        players: updatedPlayers,
        rounds: updatedRounds,
        currentRound: nextRound
      };
    });
  };

  const resetGame = () => {
    setGameState({
      gameId: 'eco-game-' + Date.now(),
      players: [],
      currentRound: 0,
      totalRounds: 4,
      rounds: [],
      gamePhase: 'waiting'
    });
    
    // Re-initialize with demo players
    setTimeout(() => {
      const demoPlayers: Player[] = Array.from({ length: 8 }, (_, i) => ({
        id: `player-${i + 1}`,
        name: `Player ${i + 1}`,
        species: 'r-selected' as SpeciesType,
        population: 100,
        totalScore: 0
      }));
      
      setGameState(prev => ({
        ...prev,
        players: demoPlayers,
        gamePhase: 'species-selection'
      }));
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">EcoStrategy Game</h1>
                <p className="text-muted-foreground">Learn r/K Selection & CSR Triangle</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{gameState.players.length}/8 Players</span>
              </div>
              
              {gameState.gamePhase !== 'waiting' && gameState.gamePhase !== 'species-selection' && (
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span>Round {gameState.currentRound}/{gameState.totalRounds}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Content */}
      <main className="container mx-auto px-4 py-8">
        {gameState.gamePhase === 'waiting' && (
          <GameLobby 
            players={gameState.players}
            onStartGame={startGame}
          />
        )}

        {gameState.gamePhase === 'species-selection' && (
          <SpeciesSelection
            players={gameState.players}
            onSpeciesSelect={handleSpeciesSelection}
            onStartGame={startGame}
          />
        )}

        {gameState.gamePhase === 'round-in-progress' && (
          <GameRound
            round={gameState.currentRound}
            totalRounds={gameState.totalRounds}
            players={gameState.players}
            onRoundComplete={handleRoundComplete}
          />
        )}

        {gameState.gamePhase === 'round-results' && (
          <div className="text-center">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">Round {gameState.currentRound} Results</h2>
              <p className="text-muted-foreground mb-6">Calculating ecological success...</p>
              <Button onClick={() => setGameState(prev => ({ ...prev, gamePhase: 'round-in-progress', currentRound: prev.currentRound + 1 }))}>
                Next Round
              </Button>
            </Card>
          </div>
        )}

        {gameState.gamePhase === 'game-complete' && (
          <GameResults
            players={gameState.players}
            rounds={gameState.rounds}
            onPlayAgain={resetGame}
          />
        )}
      </main>
    </div>
  );
};

export default EcologyGame;