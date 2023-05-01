import {
  productListAction,
  removeProductAction,
  productTopAction,
  cartAddAction,
  cartRemoveAction,
  cartAddressAction,
  cartPaymentMethodAction,
} from '../actions/productActions'
import { createReducer } from '@reduxjs/toolkit';

export const productListReducer = createReducer(
  { loading: false, products: [], numOfPages: 1 },
  (builder) => {
    builder
      .addCase(productListAction.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(productListAction.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.numOfPages = action.payload.numOfPages
        state.page = action.payload.page
        state.keyword = action.payload.keyword
      })
      .addCase(productListAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeProductAction, (state, action) => {
        const products = state.products.filter(
          product => product._id !== action.payload.id
        );
        state.products = products
  
      })
 }
)

export const productTopReducer = createReducer(
  { loading: false, products: [] },
  (builder) => {
    builder
      .addCase(productTopAction.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(productTopAction.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(productTopAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
 }
)

export const cartReducer = createReducer(
  { cartItems: [], loading: false, shippingAddress: {} },
  (builder) => {
    builder
      .addCase(cartAddAction.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(cartAddAction.fulfilled, (state, action) => {
        state.loading = false
        state.error = null;
        const item = action.payload;
        const existItem = state.cartItems.find(x => x.id === item.id);
        if (existItem) {
          const items = state.cartItems.map(x => (x.id === item.id ? item : x));
          state.cartItems = items
        } else {
          state.cartItems = [...state.cartItems, item]
        }
      })
      .addCase(cartAddAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message;
      })
      .addCase(cartRemoveAction, (state, action) => {
        const items = state.cartItems.filter(item => item.id !== action.payload);
        state.cartItems = items
      })
      .addCase(cartAddressAction, (state, action) => {
        state.shippingAddress = action.payload
        localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
      })
      .addCase(cartPaymentMethodAction, (state, action) => {
        state.paymentMethod = action.payload
        localStorage.setItem('paymentMethod', action.payload);
      })
      .addMatcher(
        action => action.type.startsWith('cart/items'),
        (state, action) => {
          localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        }
      )
  }
)
    
