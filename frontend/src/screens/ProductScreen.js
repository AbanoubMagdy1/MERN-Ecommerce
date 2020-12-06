import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Button,
  ListGroup,
  Image,
  Card,
  Form,
} from 'react-bootstrap';
import Rating from '../components/Rating';
import Message from '../components/Message';
import Loader from '../components/Loader';
import axios from 'axios';

const ProductScreen = ({ match, history }) => {
  const [qty, setQty] = useState(1);
  const [state, setState] = useState({
    loading: true,
    product: {},
    error: '',
  });
  const { product, loading, error } = state;

  //Get product data function
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${match.params.id}`);
      setState({
        loading: false,
        product: res.data,
      });
    } catch (e) {
      setState({
        loading: false,
        error:
          e.response && e.response.data.message
            ? e.response.data.message
            : e.message,
      });
    }
  };

  //Fetch product data after loading compoanent
  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = () => {
    history.push(`/cart/${product._id}?qty=${qty}`);
  };

  return (
    <>
      <Link to="/" className="btn btn-light my-2">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating rating={product.rating} reviews={product.numReviews} />{' '}
                reviews
              </ListGroup.Item>
              <ListGroup.Item>Brand : {product.brand}</ListGroup.Item>
              <ListGroup.Item>Category : {product.category}</ListGroup.Item>
              <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
              <ListGroup.Item>
                Description : {product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty:</Col>
                      <Col>
                        <Form.Control
                          as="select"
                          onChange={({ target }) => setQty(target.value)}
                        >
                          {[...Array(product.countInStock).keys()].map(val => (
                            <option key={val} value={val + 1}>
                              {val + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Button
                    className="btn btn-block"
                    disabled={product.countInStock === 0}
                    onClick={handleSubmit}
                  >
                    ADD TO CART
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductScreen;
