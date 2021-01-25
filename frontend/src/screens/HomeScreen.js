import React, { useEffect } from 'react';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { Row, Col, Carousel, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productListAction, productTopAction } from '../actions/productActions';

const HomeScreen = ({ match }) => {
  const dispatch = useDispatch();
  const { products, loading, error, numOfPages, page } = useSelector(
    state => state.productList
  );

  const {
    products: topProducts,
    loading: topLoading,
    error: topError,
  } = useSelector(state => state.top);
  const pageUrl = match.params.page || '1';
  //Fetch products after loading compoanent
  useEffect(() => {
    if (pageUrl !== page) {
      dispatch(productListAction(pageUrl, 8));
    }
    if (topProducts.length === 0) {
      dispatch(productTopAction());
    }
    // eslint-disable-next-line
  }, [match.params.page]);
  return (
    <>
      <h1>Top Products</h1>
      {topLoading ? (
        <Loader />
      ) : topError ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Carousel className="my-3">
          {topProducts.map(product => (
            <Carousel.Item className="bg-dark" pause="hover" key={product._id}>
              <Link to={`/product/${product._id}`}>
                <Carousel.Caption className="carousel-caption">
                  <h4>
                    {product.name} (${product.price})
                  </h4>
                </Carousel.Caption>

                <Image roundedCircle src={product.image} alt={product.name} />
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
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
