export const API_BASE_URL = 'http://127.0.0.1:3000';

export const ENDPOINTS = {
  GARAGE: '/garage',
  WINNERS: '/winners',
  ENGINE: '/engine',
} as const;

export const PAGINATION = {
  GARAGE_CARS_PER_PAGE: 7,
  WINNERS_PER_PAGE: 10,
} as const;

export const RACE = {
  TRACK_WIDTH: 500000,
  ANIMATION_DURATION_BASE: 100,
} as const;

export const CAR_BRANDS = [
  'Tesla', 'BMW', 'Mercedes', 'Ford', 'Toyota', 'Honda', 'Audi', 'Volkswagen',
  'Nissan', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Lexus', 'Infiniti', 'Acura',
  'Cadillac', 'Lincoln', 'Buick', 'Chevrolet', 'Dodge', 'Chrysler', 'Jeep',
  'Ram', 'GMC', 'Pontiac', 'Oldsmobile', 'Saturn', 'Hummer', 'Saab',
] as const;

export const CAR_MODELS = [
  'Sedan', 'Coupe', 'Hatchback', 'SUV', 'Crossover', 'Wagon', 'Convertible',
  'Pickup', 'Van', 'Minivan', 'Roadster', 'Sports', 'Luxury', 'Compact',
  'Midsize', 'Fullsize', 'Subcompact', 'Electric', 'Hybrid', 'Diesel',
] as const;

export const COLORS = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FFA500', '#800080', '#FFC0CB', '#A52A2A', '#808080', '#000000',
  '#FFFFFF', '#800000', '#008000', '#000080', '#808000', '#800080',
  '#008080', '#C0C0C0', '#FF6347', '#40E0D0', '#EE82EE', '#F5DEB3',
] as const;

export const MESSAGES = {
  RACE_WINNER: 'Race Winner!',
  LOADING: 'Loading...',
  NO_CARS: 'No cars in garage',
  NO_WINNERS: 'No winners yet',
} as const;