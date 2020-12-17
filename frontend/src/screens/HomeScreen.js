import React, { useEffect } from 'react';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { productListAction } from '../actions/productActions';

const HomeScreen = ({ match }) => {
  const dispatch = useDispatch();
  const { products, loading, error, numOfPages, page } = useSelector(
    state => state.productList
  );

  const pageUrl = match.params.page || 1;
  //Fetch products after loading compoanent
  useEffect(() => {
    if (pageUrl !== page) {
      dispatch(productListAction(match.params.page, 1));
    }
    // eslint-disable-next-line
  }, [match.params.page]);
  return (
    <>
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map(product => (
              <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                <Product key={product._id} product={product} />
              </Col>
            ))}
          </Row>
          <Paginate url="" page={parseInt(pageUrl)} numOfPages={numOfPages} />
        </>
      )}
    </>
  );
};

export default HomeScreen;
