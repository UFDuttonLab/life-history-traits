export type SpeciesType = 'r-selected' | 'K-selected' | 'C-competitive' | 'S-stress-tolerant' | 'R-ruderal';

export type EnvironmentType = 'stable-mature' | 'disturbed' | 'resource-rich' | 'resource-poor' | 'variable';

export type ActionType = 
  | 'reproduce-quickly' 
  | 'invest-in-offspring' 
  | 'compete-aggressively' 
  | 'conserve-resources' 
  | 'colonize-quickly'
  | 'build-defenses'
  | 'form-partnerships'
  | 'wait-and-observe';

export interface Player {
  id: string;
  name: string;
  species: SpeciesType;
  population: number;
  totalScore: number;
  currentAction?: ActionType;
  reasoning?: string;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  environment: EnvironmentType;
  imagePrompt: string;
  advantageousStrategies: SpeciesType[];
  explanation: string;
}

export interface Round {
  number: number;
  scenario: Scenario;
  playerActions: Record<string, { action: ActionType; reasoning?: string }>;
  results: Record<string, { populationChange: number; score: number; explanation: string }>;
  winners: string[];
}

export interface GameState {
  gameId: string;
  players: Player[];
  currentRound: number;
  totalRounds: number;
  rounds: Round[];
  gamePhase: 'waiting' | 'species-selection' | 'round-in-progress' | 'round-results' | 'game-complete';
  roundTimer?: number;
}

export interface SpeciesInfo {
  type: SpeciesType;
  name: string;
  description: string;
  characteristics: string[];
  preferredEnvironments: string[];
  strategies: ActionType[];
  color: string;
  icon: string;
}