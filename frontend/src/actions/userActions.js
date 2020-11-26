import axios from 'axios';
import {
  USER_REQUEST,
  USER_SUCCESS,
  USER_FAIL,
  USER_PROFILE,
  USER_LOGOUT,
} from '../actions/types';

export const loginAction = (email, password) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  dispatch({ type: USER_REQUEST });
  try {
    const { data } = await axios.post(
      '/api/users/login',
      { email, password },
      config
    );
    dispatch({ type: USER_SUCCESS, payload: data });
  } catch (e) {
    dispatch({
      type: USER_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const registerAction = (email, name, password) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  dispatch({ type: USER_REQUEST });
  try {
    const { data } = await axios.post(
      '/api/users/register',
      { email, password, name },
      config
    );
    dispatch({ type: USER_SUCCESS, payload: data });
  } catch (e) {
    dispatch({
      type: USER_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const profileAction = token => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  };
  dispatch({ type: USER_REQUEST });
  try {
    const { data } = await axios.get('/api/users/profile', config);
    dispatch({ type: USER_PROFILE, payload: data });
  } catch (e) {
    dispatch({
      type: USER_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const updateProfileAction = user => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
  };
  dispatch({ type: USER_REQUEST });
  try {
    const { data } = await axios.put('/api/users/profile', { ...user }, config);
    dispatch({ type: USER_PROFILE, payload: data });
  } catch (e) {
    dispatch({
      type: USER_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const logoutAction = () => dispatch => {
  dispatch({ type: USER_LOGOUT });
};
