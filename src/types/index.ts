export interface Car {
  id: number;
  name: string;
  color: string;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface WinnerWithCar extends Winner {
  car: Car;
}

export interface EngineResponse {
  velocity: number;
  distance: number;
}

export interface DriveResponse {
  success: boolean;
}

export interface RaceState {
  isRacing: boolean;
  winner: Car | null;
  raceResults: Map<number, boolean>;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
  totalCount?: number;
}

export enum RaceStatus {
  IDLE = 'idle',
  RACING = 'racing',
  FINISHED = 'finished',
}

export enum EngineStatus {
  STARTED = 'started',
  STOPPED = 'stopped',
  DRIVE = 'drive',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum WinnersSortBy {
  ID = 'id',
  WINS = 'wins',
  TIME = 'time',
}