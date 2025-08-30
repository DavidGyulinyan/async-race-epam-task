import { CAR_BRANDS, CAR_MODELS, COLORS } from '../components/constants';

export const generateRandomCar = () => {
  const brand = CAR_BRANDS[Math.floor(Math.random() * CAR_BRANDS.length)];
  const model = CAR_MODELS[Math.floor(Math.random() * CAR_MODELS.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  
  return {
    name: `${brand} ${model}`,
    color,
  };
};

export const generateRandomCars = (count: number) => {
  return Array.from({ length: count }, () => generateRandomCar());
};