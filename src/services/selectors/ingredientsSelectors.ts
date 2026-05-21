import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;

export const selectIngredientsIsLoading = (state: RootState) =>
  state.ingredients.isLoading;

export const selectBuns = createSelector(selectIngredients, (ingredients) =>
  ingredients.filter((item) => item.type === 'bun')
);

export const selectMains = createSelector(selectIngredients, (ingredients) =>
  ingredients.filter((item) => item.type === 'main')
);

export const selectSauces = createSelector(selectIngredients, (ingredients) =>
  ingredients.filter((item) => item.type === 'sauce')
);
