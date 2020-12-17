import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_REQUEST,
  CART_FAIL,
  CART_SHIPPING_ADDRESS,
  CART_PAYMENT_METHOD,
} from './types';
import axios from 'axios';

export const productListAction = (page, perpage) => async dispatch => {
  dispatch({ type: PRODUCT_LIST_REQUEST });
  try {
    const { data } = await axios.get(
      `/api/products?page=${page}&perpage=${perpage}`
    );
    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data.products,
      numOfPages: data.numOfPages,
      page,
    });
  } catch (e) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const cartAdd = (id, qty) => async (dispatch, getState) => {
  const cartItems = getState().cart.cartItems;
  const item = cartItems.find(i => i.id === id);
  if (item) {
    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        id: item.id,
        image: item.image,
        name: item.name,
        price: item.price,
        count: item.count,
        qty: qty,
      },
    });
  } else {
    dispatch({ type: CART_REQUEST });
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      dispatch({
        type: CART_ADD_ITEM,
        payload: {
          id: data._id,
          image: data.image,
          name: data.name,
          price: data.price,
          count: data.countInStock,
          qty: qty,
        },
      });
      localStorage.setItem(
        'cartItems',
        JSON.stringify(getState().cart.cartItems)
      );
    } catch (e) {
      dispatch({
        type: CART_FAIL,
        payload:
          e.response && e.response.data.message
            ? e.response.data.message
            : e.message,
      });
    }
  }
};

export const cartRemove = id => async (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const cartAddress = data => async dispatch => {
  dispatch({
    type: CART_SHIPPING_ADDRESS,
    payload: data,
  });
  localStorage.setItem('shippingAddress', JSON.stringify(data));
};

export const cartMethod = method => async dispatch => {
  dispatch({
    type: CART_PAYMENT_METHOD,
    payload: method,
  });
  localStorage.setItem('paymentMethod', method);
};
