import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

interface UserOrdersState {
  orders: TOrder[];
  isLoading: boolean;
  hasError: boolean;
}

const initialState: UserOrdersState = {
  orders: [],
  isLoading: false,
  hasError: false
};

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchUserOrders',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  }
});

export const selectUserOrders = (state: RootState) => state.userOrders.orders;
export const selectUserOrdersLoading = (state: RootState) =>
  state.userOrders.isLoading;
export const selectUserOrdersError = (state: RootState) =>
  state.userOrders.hasError;

export default userOrdersSlice.reducer;
