import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';

interface OrderState {
  order: TOrder | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

const initialState: OrderState = {
  order: null,
  isLoading: false,
  hasError: false,
  errorMessage: null
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return response.order;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage = action.error.message || 'Ошибка создания заказа';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
