import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../store';
import ingredientsReducer from '../slices/ingredientsSlice';
import burgerConstructorReducer from '../slices/burgerConstructorSlice';
import orderReducer from '../slices/orderSlice';
import authReducer from '../slices/authSlice';
import feedReducer from '../slices/feedSlice';
import ordersReducer from '../slices/ordersSlice';

describe('rootReducer', () => {
  it('при вызове с undefined и неизвестным экшеном возвращает корректное начальное состояние', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state.ingredients).toEqual(
      ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' })
    );
    expect(state.burgerConstructor).toEqual(
      burgerConstructorReducer(undefined, { type: 'UNKNOWN_ACTION' })
    );
    expect(state.order).toEqual(
      orderReducer(undefined, { type: 'UNKNOWN_ACTION' })
    );
    expect(state.auth).toEqual(
      authReducer(undefined, { type: 'UNKNOWN_ACTION' })
    );
    expect(state.feed).toEqual(
      feedReducer(undefined, { type: 'UNKNOWN_ACTION' })
    );
    expect(state.orders).toEqual(
      ordersReducer(undefined, { type: 'UNKNOWN_ACTION' })
    );
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
