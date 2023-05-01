import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { extractErrorMessage, handleAsync } from '../utils';

async function getProducts({page, perpage, keyword}){
  return await axios.get(`/api/products?page=${page}&perpage=${perpage}&keyword=${keyword}`)
}

async function getProduct({id}){
  return await axios.get(`/api/products/${id}`)
}

async function getTopProducts(){
  return await axios.get('/api/products/top')
}

export const productListAction = createAsyncThunk(
  'products/fetch',
  async (params, thunkAPI) => {
    const [response, error] = await handleAsync(getProducts, params);
    if (error) return thunkAPI.rejectWithValue(extractErrorMessage(error));
    return {
      products: response.data.products,
      numOfPages: response.data.numOfPages,
      page: params.page,
      keyword: params.keyword
    }
  }
)

export const removeProductAction = createAction('product/remove')

export const productTopAction = createAsyncThunk(
  'products-top/fetch',
  async(params, thunkAPI) => {
    const [response, error] = await handleAsync(getTopProducts)
    if(error) thunkAPI.rejectWithValue(extractErrorMessage(error))
    return response.data
  }
)

export const cartAddAction = createAsyncThunk(
  'cart/items/add',
  async ({id, qty}, thunkAPI) => {
    let product;
    const cartItems = thunkAPI.getState().cart.cartItems;

    if(cartItems.find(i => i.id === id)){
      product = cartItems.find(i => i.id === id)
    } else {
      const [response, error] = await handleAsync(getProduct, {id})
      if(error) thunkAPI.rejectWithValue(extractErrorMessage(error))
      product = response.data
    }
    
    return {
      id: product._id ?? product.id,
      image: product.image,
      name: product.name,
      price: product.price,
      count: product.countInStock ?? product.count,
      qty,
    }
    /*
    //TODO: move this to the reducer
    localStorage.setItem(
      'cartItems',
      JSON.stringify(getState().cart.cartItems)
    );*/
  }
)

export const cartRemoveAction = createAction('cart/items/remove')

export const cartAddressAction = createAction('cart/address')

export const cartPaymentMethodAction = createAction('cart/payment-method')


