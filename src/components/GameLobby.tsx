import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, Target } from 'lucide-react';
import { PlayerNameInput } from './PlayerNameInput';

interface GameLobbyProps {
  onPlayersReady: (playerNames: string[]) => void;
}

export const GameLobby = ({ onPlayersReady }: GameLobbyProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-br from-card via-card to-muted/30 border shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Welcome to EcoStrategy!
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            An educational game exploring ecological strategies and natural selection
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Game Overview */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">8 Players</h3>
              <p className="text-sm text-muted-foreground">Each with unique species strategies</p>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">6 Rounds</h3>
              <p className="text-sm text-muted-foreground">Different environmental scenarios</p>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Learn & Compete</h3>
              <p className="text-sm text-muted-foreground">Understand ecological principles</p>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-secondary/30 p-6 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              What You'll Learn
            </h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">r/K</Badge>
                  <span><strong>r/K Selection:</strong> How reproductive strategies evolve based on environmental stability</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">CSR</Badge>
                  <span><strong>CSR Triangle:</strong> Competitive, Stress-tolerant, and Ruderal strategies</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">🏆</Badge>
                  <span><strong>Strategy Selection:</strong> When different approaches succeed</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">🌍</Badge>
                  <span><strong>Environmental Influence:</strong> How habitats shape evolution</span>
                </div>
              </div>
            </div>
          </div>

          {/* Game Rules */}
          <div className="bg-accent/30 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">How to Play</h3>
            <div className="space-y-2 text-sm">
              <p><strong>1. Choose Your Species:</strong> Select from 5 ecological strategies (r-selected, K-selected, Competitive, Stress-tolerant, Ruderal)</p>
              <p><strong>2. Face Scenarios:</strong> Each round presents a new environment (forest fire, desert, fertile meadow, etc.)</p>
              <p><strong>3. Pick Your Strategy:</strong> Choose actions that match your species' strengths</p>
              <p><strong>4. Learn & Adapt:</strong> See which strategies succeed and understand why</p>
              <p><strong>5. Score Points:</strong> Population growth and survival earn points toward victory</p>
            </div>
          </div>

          {/* Player Name Input */}
          <PlayerNameInput onPlayersReady={onPlayersReady} />
        </CardContent>
      </Card>
    </div>
  );
};