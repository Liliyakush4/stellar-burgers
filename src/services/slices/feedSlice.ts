// слайс для ленты заказов
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TOrder, TOrdersData } from '@utils-types';
import { getFeedsApi } from '@api';

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  hasError: false,
  errorMessage: null
};

export const getFeeds = createAsyncThunk(
  'feed/getFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return {
        orders: response.orders,
        total: response.total,
        totalToday: response.totalToday
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setOrdersData: (state, action: PayloadAction<TOrdersData>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    clearFeedData: (state) => {
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage =
          action.error.message || 'Ошибка загрузки ленты заказов';
      });
  }
});

export const { setOrdersData, clearFeedData } = feedSlice.actions;
export default feedSlice.reducer;
