import {
  USER_REQUEST,
  USER_SUCCESS,
  USER_FAIL,
  USER_LOGOUT,
  USER_PROFILE,
} from '../actions/types';

export const userReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REQUEST:
      return { loading: true };
    case USER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return { loading: false, user: action.payload };
    case USER_FAIL:
      console.log(action.payload);
      localStorage.removeItem('token');
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      localStorage.removeItem('token');
      return {};
    case USER_PROFILE:
      return { loading: false, user: action.payload };
    default:
      return state;
  }
};
