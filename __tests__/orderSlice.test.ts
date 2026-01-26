jest.mock(
  '@api',
  () => ({
    orderBurgerApi: jest.fn()
  }),
  { virtual: true }
);

import reducer, {
  createOrder,
  clearOrder
} from '../src/services/slices/orderSlice';
import type { TOrder } from '../src/utils/types';

const order: TOrder = {
  _id: 'o1',
  status: 'done',
  name: 'Stellar Burger',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  number: 12345,
  ingredients: ['bun_1', 'main_1']
};

describe('orderSlice', () => {
  it('pending: isLoading=true, hasError=false, errorMessage=null', () => {
    const state = reducer(undefined, createOrder.pending('req1', ['x']));
    expect(state.isLoading).toBe(true);
    expect(state.hasError).toBe(false);
    expect(state.errorMessage).toBeNull();
  });

  it('fulfilled: order записан, isLoading=false', () => {
    const prev = {
      order: null,
      isLoading: true,
      hasError: false,
      errorMessage: null
    };
    const state = reducer(prev, createOrder.fulfilled(order, 'req1', ['x']));
    expect(state.isLoading).toBe(false);
    expect(state.order).toEqual(order);
  });

  it('rejected: hasError=true, errorMessage заполнен, isLoading=false', () => {
    const prev = {
      order: null,
      isLoading: true,
      hasError: false,
      errorMessage: null
    };
    const state = reducer(
      prev,
      createOrder.rejected(new Error('fail'), 'req1', ['x'])
    );
    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(true);
    expect(state.errorMessage).toBeTruthy();
  });

  it('clearOrder: order=null', () => {
    const prev = {
      order,
      isLoading: false,
      hasError: false,
      errorMessage: null
    };
    const state = reducer(prev, clearOrder());
    expect(state.order).toBeNull();
  });
});
