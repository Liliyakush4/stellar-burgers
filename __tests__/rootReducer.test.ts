import { expect } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../src/services/store';
import userReducer from '../src/services/slices/userSlice';
import ingredientsReducer from '../src/services/slices/ingredientsSlice';
import burgerConstructorReducer from '../src/services/slices/burgerConstructorSlice';
import orderReducer from '../src/services/slices/orderSlice';
import feedReducer from '../src/services/slices/feedSlice';
import userOrdersReducer from '../src/services/slices/userOrdersSlice';

describe('Инициализация корневого редьюсера', () => {
  it('Создает ожидаемое начальное состояние', () => {
    const store = configureStore({ reducer: rootReducer });

    expect(store.getState()).toEqual({
      user: userReducer(undefined, { type: '@@INIT' }),
      ingredients: ingredientsReducer(undefined, { type: '@@INIT' }),
      burgerConstructor: burgerConstructorReducer(undefined, {
        type: '@@INIT'
      }),
      order: orderReducer(undefined, { type: '@@INIT' }),
      feed: feedReducer(undefined, { type: '@@INIT' }),
      userOrders: userOrdersReducer(undefined, { type: '@@INIT' })
    });
  });
});
