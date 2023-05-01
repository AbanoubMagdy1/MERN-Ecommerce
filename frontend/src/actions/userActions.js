import axios from 'axios';
import { createConfig, extractErrorMessage, handleAsync } from '../utils';
import {createAction, createAsyncThunk} from '@reduxjs/toolkit'

async function loginRequest({email, password}){
  return await axios.post('/api/users/login', {email, password}, createConfig());
}

async function registerRequest({email, password, name}){
  return await axios.post('/api/users/register', {email, password, name}, createConfig());
}

async function profileRequest({token}){
  return await axios.get('/api/users/profile',createConfig({token}));
}

async function updateProfileRequest({token, user}){
  return await axios.put('/api/users/profile', { ...user }, createConfig({token}));
}

export const loginAction = createAsyncThunk(
  'user/authenticate',
  async ({email, password}, thunkAPI) => {
    const [response, error] = await handleAsync(loginRequest, {email, password});
    if(error){
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
    return response.data;
  }
)

export const registerAction = createAsyncThunk(
  'user/authenticate',
  async ({email, password, name}, thunkAPI) => {
    const [response, error] = await handleAsync(registerRequest, {email, password, name});
    if(error){
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
    return response.data;
  }
)

export const profileAction = createAsyncThunk(
  'user/profile',
  async ({token}, thunkAPI) => {
    const [response, error] = await handleAsync(profileRequest, {token});
    if(error){
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
    return response.data;
  }
)

export const updateProfileAction = createAsyncThunk(
  'user/profile',
  async ({user}, thunkAPI) => {
    const token = localStorage.getItem('token');
    const [response, error] = await handleAsync(updateProfileRequest, {token, user});
    if(error){
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
    return response.data;
  }
)

export const logoutAction = createAction('user/logout');
