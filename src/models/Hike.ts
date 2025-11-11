export type Difficulty = 'Easy' | 'Moderate' | 'Hard';

export interface Hike {
  id?: number;
  name: string;
  location: string;
  hikeDateEpoch: number; // millis
  parking: boolean;
  lengthKm: number;
  difficulty: Difficulty;
  description?: string;
  elevationGainM?: number;
  maxGroupSize?: number;
  createdAt?: number;
}
