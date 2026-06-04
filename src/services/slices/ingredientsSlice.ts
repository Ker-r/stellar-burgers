import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const data = await getIngredientsApi();
    return data; // вернёт массив ингредиентов
  }
);

type TIngredientsState = {
  ingredients: TIngredient[]; // список ингредиентов
  isLoading: boolean; // идёт ли загрузка
  error: string | null; // текст ошибки, если произошла
};

export const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

// Создаем слайс
export const ingredientsSlice = createSlice({
  name: 'ingredients', // имя слайса
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      });
  }
});

export default ingredientsSlice.reducer;
