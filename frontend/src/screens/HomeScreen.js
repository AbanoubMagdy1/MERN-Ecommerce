import React, { useState, useEffect } from 'react';
import Product from '../components/Product';
import Loader from '../components/Loader';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';

const HomeScreen = () => {
  const [state, setState] = useState({
    loading: true,
    products: [],
  });

  //Get products function
  const fetchProducts = async () => {
    const res = await axios.get('/api/products');
    setState({
      loading: false,
      products: res.data,
    });
  };

  //Fetch products after loading compoanent
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <>
      <h1>Latest Products</h1>
      {state.loading ? (
        <Loader />
      ) : (
        <Row>
          {state.products.map(product => (
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
