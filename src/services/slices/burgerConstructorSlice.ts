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
        id: Math.random().toString(36).substring(2, 9)
      };
      state.ingredients.push(newItem);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
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

export const { addIngredient, removeIngredient, setBun, resetConstructor } =
  burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
