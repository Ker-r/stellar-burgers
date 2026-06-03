import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  setBun,
  initialState
} from '../burgerConstructorSlice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: '1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://example.com/bun.png',
  image_large: 'https://example.com/bun-large.png',
  image_mobile: 'https://example.com/bun-mobile.png'
};

const mockFilling: TIngredient = {
  _id: '2',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://example.com/filling.png',
  image_large: 'https://example.com/filling-large.png',
  image_mobile: 'https://example.com/filling-mobile.png'
};

describe('burgerConstructorSlice', () => {
  describe('addIngredient', () => {
    it('должен добавлять начинку в конструктор', () => {
      const action = addIngredient(mockFilling);
      const state = burgerConstructorReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        ingredients: [expect.objectContaining({ _id: mockFilling._id })]
      });
    });

    it('должен добавлять несколько начинок в конструктор', () => {
      let state = burgerConstructorReducer(initialState, addIngredient(mockFilling));
      state = burgerConstructorReducer(state, addIngredient(mockFilling));

      expect(state).toEqual({
        ...initialState,
        ingredients: [
          expect.objectContaining({ _id: mockFilling._id }),
          expect.objectContaining({ _id: mockFilling._id })
        ]
      });
    });
  });

  describe('removeIngredient', () => {
    it('должен удалять ингредиент из конструктора по id', () => {
      let state = burgerConstructorReducer(initialState, addIngredient(mockFilling));
      const addedId = state.ingredients[0].id;

      state = burgerConstructorReducer(state, removeIngredient(addedId));

      expect(state).toEqual({
        ...initialState,
        ingredients: []
      });
    });
  });

  describe('moveIngredient', () => {
    it('должен перемещать ингредиент вверх', () => {
      const secondFilling = { ...mockFilling, _id: '3', name: 'Второй ингредиент' };
      let state = burgerConstructorReducer(initialState, addIngredient(mockFilling));
      state = burgerConstructorReducer(state, addIngredient(secondFilling));

      const secondId = state.ingredients[1].id;
      state = burgerConstructorReducer(state, moveIngredient({ id: secondId, direction: 'up' }));

      expect(state).toEqual({
        ...initialState,
        ingredients: [
          expect.objectContaining({ name: 'Второй ингредиент' }),
          expect.objectContaining({ name: mockFilling.name })
        ]
      });
    });

    it('должен перемещать ингредиент вниз', () => {
      const secondFilling = { ...mockFilling, _id: '3', name: 'Второй ингредиент' };
      let state = burgerConstructorReducer(initialState, addIngredient(mockFilling));
      state = burgerConstructorReducer(state, addIngredient(secondFilling));

      const firstId = state.ingredients[0].id;
      state = burgerConstructorReducer(state, moveIngredient({ id: firstId, direction: 'down' }));

      expect(state).toEqual({
        ...initialState,
        ingredients: [
          expect.objectContaining({ name: 'Второй ингредиент' }),
          expect.objectContaining({ name: mockFilling.name })
        ]
      });
    });
  });

  describe('setBun', () => {
    it('должен устанавливать булку в конструктор', () => {
      const state = burgerConstructorReducer(initialState, setBun(mockBun));

      expect(state).toEqual({
        ...initialState,
        bun: mockBun
      });
    });
  });
});
