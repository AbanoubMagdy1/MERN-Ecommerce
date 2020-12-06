import React, { useEffect } from 'react';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { productListAction } from '../actions/productActions';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.productList);

  //Fetch products after loading compoanent
  useEffect(() => {
    if (products.length === 0) dispatch(productListAction());
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {products.map(product => (
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
