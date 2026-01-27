jest.mock(
  '@api',
  () => ({
    loginUserApi: jest.fn(),
    registerUserApi: jest.fn(),
    logoutApi: jest.fn(),
    getUserApi: jest.fn(),
    updateUserApi: jest.fn()
  }),
  { virtual: true }
);

import reducer, {
  loginUser,
  checkUserAuth
} from '../src/services/slices/userSlice';
import type { TUser } from '../src/utils/types';

const user: TUser = { email: 'test@test.ru', name: 'Тест' };

describe('userSlice', () => {
  it('loginUser.pending: isLoading=true, error=null', () => {
    const state = reducer(
      undefined,
      loginUser.pending('req1', { email: 'x', password: 'y' } as any)
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('loginUser.fulfilled: user записан, isLoading=false', () => {
    const prev = {
      user: null,
      isAuthChecked: false,
      isLoading: true,
      error: null
    };
    const state = reducer(
      prev,
      loginUser.fulfilled(user, 'req1', { email: 'x', password: 'y' } as any)
    );

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(user);
  });

  it('loginUser.rejected: error записан, isLoading=false', () => {
    const prev = {
      user: null,
      isAuthChecked: false,
      isLoading: true,
      error: null
    };
    const state = reducer(
      prev,
      loginUser.rejected(new Error('fail'), 'req1', {
        email: 'x',
        password: 'y'
      } as any)
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeTruthy();
  });

  it('checkUserAuth.fulfilled: isAuthChecked=true (и user = payload)', () => {
    const prev = {
      user: null,
      isAuthChecked: false,
      isLoading: true,
      error: null
    };
    const state = reducer(
      prev,
      checkUserAuth.fulfilled(user, 'req1', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(user);
    expect(state.isAuthChecked).toBe(true);
  });
});
