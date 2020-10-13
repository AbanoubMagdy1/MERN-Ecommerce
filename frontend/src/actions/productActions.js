import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  CART_ADD_ITEM,
  CART_REMOVE_ITEM
} from './types';
import axios from 'axios';

export const productListAction = () => async dispatch => {
  dispatch({ type: PRODUCT_LIST_REQUEST });
  try {
    const { data } = await axios.get(`/api/products`);
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
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

export const cartAdd = (id, qty) => async(dispatch, getState) => {
  const {data} = await axios.get(`/api/products/${id}`);
  dispatch({
    type : CART_ADD_ITEM,
    payload : {
      id : data._id,
      image : data.image,
      name : data.name,
      price : data.price,
      count : data.countInStock,
      qty : qty
    }
  })
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems))
}

export const cartRemove = (id) => async(dispatch, getState) => {
  dispatch({
    type : CART_REMOVE_ITEM,
    payload : id
  })
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems))
}
