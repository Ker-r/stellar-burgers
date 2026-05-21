import type { RootState } from '../store';

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.auth.isAuthChecked;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.user !== null;
