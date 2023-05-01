import {
  productListReducer,
  cartReducer,
  productTopReducer,
} from './reducers/productReducers';
import { userReducer } from './reducers/userReducer';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

const cartItems = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const shippingAddress = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

const paymentMethod = localStorage.getItem('paymentMethod')
  ? localStorage.getItem('paymentMethod')
  : '';

const initState = {
  cart: {
    cartItems,
    shippingAddress,
    paymentMethod,
  },
};

const reducer = combineReducers({
  productList: productListReducer,
  top: productTopReducer,
  cart: cartReducer,
  userInfo: userReducer,
});

const store = configureStore({
  reducer,
  preloadedState: initState
})

export default store;
