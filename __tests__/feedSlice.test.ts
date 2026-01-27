jest.mock(
  '@api',
  () => ({
    getFeedsApi: jest.fn()
  }),
  { virtual: true }
);

import reducer, { getFeeds } from '../src/services/slices/feedSlice';
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

describe('feedSlice', () => {
  it('pending: isLoading=true, hasError=false, errorMessage=null', () => {
    const state = reducer(undefined, getFeeds.pending('req1', undefined));
    expect(state.isLoading).toBe(true);
    expect(state.hasError).toBe(false);
    expect(state.errorMessage).toBeNull();
  });

  it('fulfilled: записывает orders/total/totalToday и isLoading=false', () => {
    const payload = { orders: [order1], total: 10, totalToday: 2 };
    const prev = {
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: true,
      hasError: false,
      errorMessage: null
    };

    const state = reducer(prev, getFeeds.fulfilled(payload, 'req1', undefined));

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual([order1]);
    expect(state.total).toBe(10);
    expect(state.totalToday).toBe(2);
  });

  it('rejected: hasError=true и isLoading=false', () => {
    const prev = {
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: true,
      hasError: false,
      errorMessage: null
    };

    const state = reducer(
      prev,
      getFeeds.rejected(new Error('fail'), 'req1', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(true);
    expect(state.errorMessage).toBeTruthy();
  });
});
