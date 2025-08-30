import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Car, RaceStatus, EngineStatus } from '../types';
import { apiService } from '../services/api';

interface CarRaceState {
  id: number;
  isStarted: boolean;
  isDriving: boolean;
  isFinished: boolean;
  velocity: number;
  distance: number;
  time: number;
  position: number; // Current position as percentage (0-100)
  isStopped: boolean; // Whether car was manually stopped
}

interface RaceState {
  status: RaceStatus;
  cars: Record<number, CarRaceState>;
  winner: Car | null;
  raceTime: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: RaceState = {
  status: RaceStatus.IDLE,
  cars: {},
  winner: null,
  raceTime: 0,
  isLoading: false,
  error: null,
};

// Async thunks
export const startEngine = createAsyncThunk(
  'race/startEngine',
  async (carId: number) => {
    const response = await apiService.startStopEngine(carId, EngineStatus.STARTED);
    return {
      carId,
      velocity: response.data.velocity,
      distance: response.data.distance,
    };
  },
);

export const stopEngine = createAsyncThunk(
  'race/stopEngine',
  async (carId: number) => {
    await apiService.startStopEngine(carId, EngineStatus.STOPPED);
    return carId;
  },
);

export const startDriving = createAsyncThunk(
  'race/startDriving',
  async (carId: number) => {
    await apiService.switchToDriveMode(carId);
    return {
      carId,
      success: true,
    };
  },
);

export const startRace = createAsyncThunk(
  'race/startRace',
  async (cars: Car[], { dispatch }) => {
    const MILLISECONDS_TO_SECONDS = 1000;
    const finishTimes: { car: Car; time: number }[] = [];

    // Start all engines
    const enginePromises = cars.map(car => dispatch(startEngine(car.id)));
    await Promise.all(enginePromises);

    // Start driving for all cars and track completion times
    const drivePromises = cars.map(async (car) => {
      const driveStartTime = Date.now();
      await dispatch(startDriving(car.id)).unwrap();
      const completionTime = (Date.now() - driveStartTime) / MILLISECONDS_TO_SECONDS;
      finishTimes.push({ car, time: completionTime });
    });

    await Promise.allSettled(drivePromises);

    // Find the actual winner (fastest completion time)
    let winner: Car | null = null;
    let winnerTime = Infinity;

    finishTimes.forEach(({ car, time }) => {
      if (time < winnerTime) {
        winner = car;
        winnerTime = time;
      }
    });

    return {
      winner,
      raceTime: winnerTime === Infinity ? 0 : winnerTime,
    };
  },
);

export const resetRace = createAsyncThunk(
  'race/resetRace',
  async (cars: Car[], { dispatch }) => {
    // Stop all engines
    const stopPromises = cars.map(car => dispatch(stopEngine(car.id)));
    await Promise.all(stopPromises);
    
    return cars.map(car => car.id);
  },
);

const raceSlice = createSlice({
  name: 'race',
  initialState,
  reducers: {
    initializeCar: (state, action: PayloadAction<number>) => {
      const carId = action.payload;
      if (!state.cars[carId]) {
        state.cars[carId] = {
          id: carId,
          isStarted: false,
          isDriving: false,
          isFinished: false,
          velocity: 0,
          distance: 0,
          time: 0,
          position: 0,
          isStopped: false,
        };
      }
    },
    finishCar: (state, action: PayloadAction<number>) => {
      const carId = action.payload;
      const car = state.cars[carId];
      if (car) {
        car.isFinished = true;
      }
    },
    removeCar: (state, action: PayloadAction<number>) => {
      delete state.cars[action.payload];
    },
    setRaceStatus: (state, action: PayloadAction<RaceStatus>) => {
      state.status = action.payload;
    },
    clearWinner: (state) => {
      state.winner = null;
      state.raceTime = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateCarPosition: (state, action: PayloadAction<{ carId: number; position: number }>) => {
      const { carId, position } = action.payload;
      const car = state.cars[carId];
      if (car) {
        car.position = Math.min(100, Math.max(0, position));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Start engine
      .addCase(startEngine.fulfilled, (state, action) => {
        const { carId, velocity, distance } = action.payload;
        const car = state.cars[carId];
        if (car) {
          car.isStarted = true;
          car.velocity = velocity;
          car.distance = distance;
          // Calculate animation time for the car
          car.time = (distance / velocity) / 1000; // Convert to seconds
        }
      })
      .addCase(startEngine.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to start engine';
      })
      // Stop engine
      .addCase(stopEngine.fulfilled, (state, action) => {
        const carId = action.payload;
        const car = state.cars[carId];
        if (car) {
          car.isStarted = false;
          car.isDriving = false;
          car.isFinished = false;
          car.velocity = 0;
          car.time = 0;
          car.isStopped = true;
          // Keep the current position when stopped
        }
      })
      // Start driving
      .addCase(startDriving.fulfilled, (state, action) => {
        const { carId } = action.payload;
        const car = state.cars[carId];
        if (car) {
          car.isDriving = true;
        }
      })
      // Start race
      .addCase(startRace.pending, (state) => {
        state.status = RaceStatus.RACING;
        state.isLoading = true;
        state.error = null;
        state.winner = null;
      })
      .addCase(startRace.fulfilled, (state, action) => {
        state.status = RaceStatus.FINISHED;
        state.isLoading = false;
        state.winner = action.payload.winner;
        state.raceTime = action.payload.raceTime;
      })
      .addCase(startRace.rejected, (state, action) => {
        state.status = RaceStatus.IDLE;
        state.isLoading = false;
        state.error = action.error.message || 'Race failed';
      })
      // Reset race
      .addCase(resetRace.fulfilled, (state, action) => {
        state.status = RaceStatus.IDLE;
        state.winner = null;
        state.raceTime = 0;
        
        action.payload.forEach(carId => {
          const car = state.cars[carId];
          if (car) {
            car.isStarted = false;
            car.isDriving = false;
            car.isFinished = false;
            car.velocity = 0;
            car.time = 0;
            car.position = 0;
            car.isStopped = false;
          }
        });
      });
  },
});

export const {
  initializeCar,
  removeCar,
  setRaceStatus,
  clearWinner,
  clearError,
  updateCarPosition,
  finishCar
} = raceSlice.actions;

// Selectors
export const selectRaceStatus = (state: { race: RaceState }) => state.race.status;
export const selectRaceCars = (state: { race: RaceState }) => state.race.cars;
export const selectRaceWinner = (state: { race: RaceState }) => state.race.winner;
export const selectRaceTime = (state: { race: RaceState }) => state.race.raceTime;
export const selectRaceLoading = (state: { race: RaceState }) => state.race.isLoading;
export const selectRaceError = (state: { race: RaceState }) => state.race.error;
export const selectCarRaceState = (carId: number) => (state: { race: RaceState }) =>
  state.race.cars[carId];

export default raceSlice.reducer;