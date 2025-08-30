import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';
import carsReducer from './carsSlice';
import winnersReducer from './winnersSlice';
import raceReducer from './raceSlice';

// Enable MapSet support in Immer
enableMapSet();

export const store = configureStore({
  reducer: {
    cars: carsReducer,
    winners: winnersReducer,
    race: raceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['race/cars'],
        ignoredPaths: ['race.cars'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;