jest.mock(
  '@api',
  () => ({
    getOrdersApi: jest.fn()
  }),
  { virtual: true }
);

import reducer, {
  fetchUserOrders
} from '../src/services/slices/userOrdersSlice';
import type { TOrder } from '../src/utils/types';

const order1: TOrder = {
  _id: 'o1',
  status: 'done',
  name: 'Order 1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  number: 1,
  ingredients: ['bun_1']
};

describe('userOrdersSlice', () => {
  it('pending: isLoading=true, hasError=false', () => {
    const state = reducer(
      undefined,
      fetchUserOrders.pending('req1', undefined)
    );
    expect(state.isLoading).toBe(true);
    expect(state.hasError).toBe(false);
  });

  it('fulfilled: orders записаны, isLoading=false', () => {
    const prev = { orders: [], isLoading: true, hasError: false };
    const state = reducer(
      prev,
      fetchUserOrders.fulfilled([order1], 'req1', undefined)
    );

    expect(state.orders).toEqual([order1]);
    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(false);
  });

  it('rejected: hasError=true, isLoading=false', () => {
    const prev = { orders: [], isLoading: true, hasError: false };
    const state = reducer(
      prev,
      fetchUserOrders.rejected(new Error('fail'), 'req1', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(true);
  });
});
