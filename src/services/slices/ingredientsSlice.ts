import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

interface IngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  hasError: boolean;
}

const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  hasError: false
};

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async () => {
    const ingredients = await getIngredientsApi();
    return ingredients;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
      })
      .addCase(getIngredients.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  }
});

export default ingredientsSlice.reducer;
