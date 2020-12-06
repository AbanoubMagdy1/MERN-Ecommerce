import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { productListReducer, cartReducer } from './reducers/productReducers';
import { userReducer } from './reducers/userReducer';

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
  cart: cartReducer,
  userInfo: userReducer,
});

const store = createStore(
  reducer,
  initState,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
