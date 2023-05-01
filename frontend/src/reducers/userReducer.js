import { createReducer } from '@reduxjs/toolkit';
import {loginAction, profileAction, logoutAction} from '../actions/userActions'

export const userReducer = createReducer({loading: false}, (builder) => {
  builder
    .addCase(
      loginAction.fulfilled,
      (state, action) => {
        localStorage.setItem('token', action.payload.token);
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      }
    )
    .addCase(
      profileAction.fulfilled,
      (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      }
    )
    .addCase(
      logoutAction,
      (state, action) => {
        localStorage.removeItem('token');
        state.loading = false;
        state.user = null;
      }
    )
    .addMatcher(
      (action) => action.type.startsWith('user') && action.type.endsWith('pending'),
      state => {
        state.loading = true;
      }
    )
    .addMatcher(
      (action) => action.type.startsWith('user') && action?.type.endsWith('rejected'),
      (state, action) => {
        localStorage.removeItem('token');
        state.loading = false;
        state.error = action.payload;
      }
    )   
})
