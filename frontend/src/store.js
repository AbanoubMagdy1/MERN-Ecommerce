import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { productListReducer, cartReducer} from './reducers/productReducers';

const cartItems = localStorage.getItem("cartItems") 
                  ? JSON.parse(localStorage.getItem("cartItems")) 
                  : [];

const initState = {
  cart : {
    cartItems
  }
}

const reducer = combineReducers({
  productList: productListReducer,
  cart : cartReducer
});

const store = createStore(reducer, initState, composeWithDevTools(applyMiddleware(thunk)));

export default store;
