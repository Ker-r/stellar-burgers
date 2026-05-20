import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';

type TConstructorItem = TIngredient & { id: string };

type TBurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorItem[];
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const newItem: TConstructorItem = {
        ...action.payload,
        id: crypto.randomUUID()
      };
      state.ingredients.push(newItem);
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ id: string; direction: 'up' | 'down' }>
    ) => {
      const { id, direction } = action.payload;
      const index = state.ingredients.findIndex((item) => item.id === id);

      if (index === -1) return;

      const newIndex = direction === 'up' ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= state.ingredients.length) return;
      [state.ingredients[index], state.ingredients[newIndex]] = [
        state.ingredients[newIndex],
        state.ingredients[index]
      ];
    },

    setBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },

    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  setBun,
  resetConstructor
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
