export interface Team {
  id: string;
  name: string;
  logo: string;
}

export interface Match {
  id: string;
  title?: string;
  mode: string;
  type: string;
  status: string;
  teamSize?: number;
  platform?: 'emulator' | 'mobile' | 'mixed' | 'tactical';
  entryFee?: number;
  prize?: number;
  playersJoined?: number;
  totalPlayers?: number;
  startTime?: string;
  maxPlayers?: number;
  currentPlayers?: number;
  createdAt?: string;
  updatedAt?: string;
  teamFormation?: 'formed' | 'random';
  paymentOption?: 'captain' | 'split';
  createdBy?: string;
  odd?: number;
} 