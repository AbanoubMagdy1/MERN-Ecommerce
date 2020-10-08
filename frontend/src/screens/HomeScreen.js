import React, { useState, useEffect } from 'react';
import Product from '../components/Product';
import Loader from '../components/Loader';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { productListAction } from '../actions/productActions';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const productList = useSelector(state => state.productList);

  //Fetch products after loading compoanent
  useEffect(() => {
    if (productList.products.length === 0) dispatch(productListAction());
  }, []);
  return (
    <>
      <h1>Latest Products</h1>
      {productList.loading ? (
        <Loader />
      ) : (
        <Row>
          {productList.products.map(product => (
            <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
              <Product key={product._id} product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default HomeScreen;
