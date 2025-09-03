import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Car, PaginationParams } from '../types';
import { apiService } from '../services/api';
import { PAGINATION } from '../components/constants';

interface CarsState {
  cars: Car[];
  totalCount: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  selectedCar: Car | null;
}

const initialState: CarsState = {
  cars: [],
  totalCount: 0,
  currentPage: 1,
  isLoading: false,
  error: null,
  selectedCar: null,
};

// Async thunks
export const fetchCars = createAsyncThunk(
  'cars/fetchCars',
  async (params: PaginationParams) => {
    const response = await apiService.getCars(params);
    return response;
  },
);

export const createCar = createAsyncThunk(
  'cars/createCar',
  async (car: Omit<Car, 'id'>) => {
    const response = await apiService.createCar(car);
    return response.data;
  },
);

export const updateCar = createAsyncThunk(
  'cars/updateCar',
  async ({ id, car }: { id: number; car: Omit<Car, 'id'> }) => {
    const response = await apiService.updateCar(id, car);
    return response.data;
  },
);

export const deleteCar = createAsyncThunk(
  'cars/deleteCar',
  async ({ id, page, limit }: { id: number; page: number; limit: number }) => {
    await apiService.deleteCar(id);
    const response = await apiService.getCars({ page, limit });
    return { id, data: response.data, totalCount: response.totalCount };
  },
);

export const generateRandomCars = createAsyncThunk(
  'cars/generateRandomCars',
  async (count: number) => {
    const { CAR_BRANDS, CAR_MODELS, COLORS } = await import('../components/constants');
    
    const promises = Array.from({ length: count }, () => {
      const brand = CAR_BRANDS[Math.floor(Math.random() * CAR_BRANDS.length)];
      const model = CAR_MODELS[Math.floor(Math.random() * CAR_MODELS.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      
      return apiService.createCar({
        name: `${brand} ${model}`,
        color,
      });
    });

    const responses = await Promise.all(promises);
    return responses.map(response => response.data);
  },
);

const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSelectedCar: (state, action: PayloadAction<Car | null>) => {
      state.selectedCar = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cars
      .addCase(fetchCars.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cars = action.payload.data;
        state.totalCount = action.payload.totalCount || 0;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch cars';
      })
      // Create car
      .addCase(createCar.fulfilled, (state, action) => {
        state.cars.push(action.payload);
        state.totalCount += 1;
      })
      // Update car
      .addCase(updateCar.fulfilled, (state, action) => {
        const index = state.cars.findIndex(car => car.id === action.payload.id);
        if (index !== -1) {
          state.cars[index] = action.payload;
        }
        if (state.selectedCar?.id === action.payload.id) {
          state.selectedCar = action.payload;
        }
      })
      // Delete car
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.cars = action.payload.data;
        state.totalCount = action.payload.totalCount || 0;
        if (state.selectedCar?.id === action.payload.id) {
          state.selectedCar = null;
        }
      })
      // Generate random cars
      .addCase(generateRandomCars.fulfilled, (state, action) => {
        state.cars.push(...action.payload);
        state.totalCount += action.payload.length;
      });
  },
});

export const { setCurrentPage, setSelectedCar, clearError } = carsSlice.actions;

// Selectors
export const selectCars = (state: { cars: CarsState }) => state.cars.cars;
export const selectTotalCars = (state: { cars: CarsState }) => state.cars.totalCount;
export const selectCurrentPage = (state: { cars: CarsState }) => state.cars.currentPage;
export const selectCarsLoading = (state: { cars: CarsState }) => state.cars.isLoading;
export const selectCarsError = (state: { cars: CarsState }) => state.cars.error;
export const selectSelectedCar = (state: { cars: CarsState }) => state.cars.selectedCar;
export const selectTotalPages = (state: { cars: CarsState }) => 
  Math.ceil(state.cars.totalCount / PAGINATION.GARAGE_CARS_PER_PAGE);

export default carsSlice.reducer;