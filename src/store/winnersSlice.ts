import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Winner, WinnerWithCar, WinnersSortBy, SortOrder } from '../types';
import { apiService } from '../services/api';
import { PAGINATION } from '../components/constants';

interface WinnersState {
  winners: WinnerWithCar[];
  totalCount: number;
  currentPage: number;
  sortBy: WinnersSortBy;
  sortOrder: SortOrder;
  isLoading: boolean;
  error: string | null;
}

const initialState: WinnersState = {
  winners: [],
  totalCount: 0,
  currentPage: 1,
  sortBy: WinnersSortBy.ID,
  sortOrder: SortOrder.ASC,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchWinners = createAsyncThunk(
  'winners/fetchWinners',
  async (params: { page?: number; limit?: number; sort?: WinnersSortBy; order?: SortOrder }) => {
    const [winnersResponse, carsResponse] = await Promise.all([apiService.getWinners(params), apiService.getCars()]);

    const winnersWithCars: WinnerWithCar[] = winnersResponse.data.map((winner) => {
      const car = carsResponse.data.find((c) => c.id === winner.id);
      return {
        ...winner,
        car: car || { id: winner.id, name: 'Unknown', color: '#000000' },
      };
    });

    return {
      data: winnersWithCars,
      totalCount: winnersResponse.totalCount,
    };
  }
);

export const createWinner = createAsyncThunk('winners/createWinner', async (winner: Winner) => {
  const response = await apiService.createWinner(winner);
  const carResponse = await apiService.getCar(winner.id);

  return {
    ...response.data,
    car: carResponse.data,
  };
});

export const updateWinner = createAsyncThunk(
  'winners/updateWinner',
  async ({ id, winner }: { id: number; winner: Omit<Winner, 'id'> }) => {
    const response = await apiService.updateWinner(id, winner);
    const carResponse = await apiService.getCar(id);

    return {
      ...response.data,
      car: carResponse.data,
    };
  }
);

export const deleteWinner = createAsyncThunk('winners/deleteWinner', async (id: number) => {
  await apiService.deleteWinner(id);
  return id;
});

export const saveWinnerResult = createAsyncThunk(
  'winners/saveWinnerResult',
  async ({ carId, time }: { carId: number; time: number }) => {
    try {
      // Try to get existing winner
      const existingWinner = await apiService.getWinner(carId);

      // Update existing winner
      const updatedWinner = {
        wins: existingWinner.data.wins + 1,
        time: Math.min(existingWinner.data.time, time),
      };

      const response = await apiService.updateWinner(carId, updatedWinner);
      const carResponse = await apiService.getCar(carId);

      return {
        ...response.data,
        car: carResponse.data,
      };
    } catch {
      // Create new winner if doesn't exist
      const newWinner = {
        id: carId,
        wins: 1,
        time,
      };

      const response = await apiService.createWinner(newWinner);
      const carResponse = await apiService.getCar(carId);

      return {
        ...response.data,
        car: carResponse.data,
      };
    }
  }
);

const winnersSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSortBy: (state, action: PayloadAction<WinnersSortBy>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<SortOrder>) => {
      state.sortOrder = action.payload;
    },
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch winners
      .addCase(fetchWinners.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWinners.fulfilled, (state, action) => {
        state.isLoading = false;
        state.winners = action.payload.data;
        state.totalCount = action.payload.totalCount || 0;
      })
      .addCase(fetchWinners.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch winners';
      })
      // Create winner
      .addCase(createWinner.fulfilled, (state, action) => {
        state.winners.push(action.payload);
        state.totalCount += 1;
      })
      // Update winner
      .addCase(updateWinner.fulfilled, (state, action) => {
        const index = state.winners.findIndex((winner) => winner.id === action.payload.id);
        if (index !== -1) {
          state.winners[index] = action.payload;
        }
      })
      // Delete winner
      .addCase(deleteWinner.fulfilled, (state, action) => {
        state.winners = state.winners.filter((winner) => winner.id !== action.payload);
        state.totalCount -= 1;
      })
      // Save winner result
      .addCase(saveWinnerResult.fulfilled, (state, action) => {
        const index = state.winners.findIndex((winner) => winner.id === action.payload.id);
        if (index !== -1) {
          state.winners[index] = action.payload;
        } else {
          state.winners.push(action.payload);
          state.totalCount += 1;
        }
      });
  },
});

export const { setCurrentPage, setSortBy, setSortOrder, toggleSortOrder, clearError } = winnersSlice.actions;

// Selectors
export const selectWinners = (state: { winners: WinnersState }) => state.winners.winners;
export const selectTotalWinners = (state: { winners: WinnersState }) => state.winners.totalCount;
export const selectWinnersCurrentPage = (state: { winners: WinnersState }) => state.winners.currentPage;
export const selectWinnersSortBy = (state: { winners: WinnersState }) => state.winners.sortBy;
export const selectWinnersSortOrder = (state: { winners: WinnersState }) => state.winners.sortOrder;
export const selectWinnersLoading = (state: { winners: WinnersState }) => state.winners.isLoading;
export const selectWinnersError = (state: { winners: WinnersState }) => state.winners.error;
export const selectWinnersTotalPages = (state: { winners: WinnersState }) =>
  Math.ceil(state.winners.totalCount / PAGINATION.WINNERS_PER_PAGE);

export default winnersSlice.reducer;
