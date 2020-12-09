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
  CART_EMPTY,
} from '../actions/types';

export const productListReducer = (
  state = { loading: true, products: [] },
  action
) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true, products: [] };
    case PRODUCT_LIST_SUCCESS:
      return { loading: false, products: action.payload };
    case PRODUCT_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const cartReducer = (
  state = { cartItems: [], loading: false, shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case CART_REQUEST:
      return { ...state, loading: true };
    case CART_FAIL:
      return { ...state, loading: false, error: action.payload };
    case CART_ADD_ITEM:
      const item = action.payload;
      const existItem = state.cartItems.find(x => x.id === item.id);
      if (existItem) {
        const items = state.cartItems.map(x => (x.id === item.id ? item : x));
        return {
          ...state,
          loading: false,
          cartItems: items,
        };
      } else {
        return {
          ...state,
          loading: false,
          cartItems: [...state.cartItems, item],
        };
      }
    case CART_REMOVE_ITEM:
      const items = state.cartItems.filter(item => item.id !== action.payload);
      return {
        ...state,
        cartItems: items,
      };
    case CART_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      };

    case CART_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      };
    case CART_EMPTY:
      return {
        ...state,
        cartItems: [],
      };
    default:
      return state;
  }
};
