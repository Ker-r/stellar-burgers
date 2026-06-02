import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../slices/ingredientsSlice';
import burgerConstructorReducer from '../slices/burgerConstructorSlice';
import orderReducer from '../slices/orderSlice';
import authReducer from '../slices/authSlice';
import feedReducer from '../slices/feedSlice';
import ordersReducer from '../slices/ordersSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer,
  auth: authReducer,
  feed: feedReducer,
  orders: ordersReducer
});

describe('rootReducer', () => {
  it('при вызове с undefined и неизвестным экшеном возвращает начальное состояние', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('orders');
  });

  it('при неизвестном экшене должен вернуть состояние без изменений', () => {
    const store = configureStore({ reducer: rootReducer });
    const stateBefore = store.getState();

    store.dispatch({ type: 'UNKNOWN_ACTION' });
    const stateAfter = store.getState();

    expect(stateAfter).toEqual(stateBefore);
  });

  it('начальное состояние burgerConstructor должно быть пустым', () => {
    const store = configureStore({ reducer: rootReducer });
    const { burgerConstructor } = store.getState();

    expect(burgerConstructor.bun).toBeNull();
    expect(burgerConstructor.ingredients).toEqual([]);
  });

  it('начальное состояние ingredients должно быть пустым массивом без ошибок', () => {
    const store = configureStore({ reducer: rootReducer });
    const { ingredients } = store.getState();

    expect(ingredients.ingredients).toEqual([]);
    expect(ingredients.isLoading).toBe(false);
    expect(ingredients.error).toBeNull();
  });
});
