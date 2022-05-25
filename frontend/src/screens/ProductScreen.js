import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Row,
  Col,
  Button,
  ListGroup,
  Image,
  Card,
  Form,
  Modal,
} from 'react-bootstrap';
import Rating from '../components/Rating';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Stars from '../components/Stars';
import axios from 'axios';

const ProductScreen = ({ match, history }) => {
  const { page } = useSelector(state => state.productList);
  const { user } = useSelector(state => state.userInfo);
  const [qty, setQty] = useState(1);
  const [state, setState] = useState({
    loading: true,
    product: { reviews: [] },
    error: '',
  });
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { product, loading, error } = state;
  const pageUrl = page || 1;
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
    if (!product.name) {
      fetchProduct();
    } else {
      detectMyReview();
    }

    // eslint-disable-next-line
  }, [product]);

  const handleSubmit = () => {
    history.push(`/cart/${product._id}?qty=${qty}`);
  };

  const detectMyReview = () => {
    if (user) {
      const myReview = product.reviews.find(r => r.user === user._id);
      if (myReview) {
        product.reviews.sort((a, b) => (a.user === user._id ? -1 : 0));
        setRating(myReview.rating);
        setComment(myReview.comment);
      }
    }
  };

  const createReview = async () => {
    handleClose();
    if (!user) {
      history.push(`/login?redirect=product/${product._id}`);
    } else if (!comment || !rating) {
      setMessage('You need to make a rating and write comment');
    } else {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      };
      try {
        setState({ ...state, loading: true });
        const { data } = await axios.post(
          `/api/products/${match.params.id}/review`,
          { rating, comment },
          config
        );
        setState({
          loading: false,
          product: data,
        });
        setMessage('');
      } catch (e) {
        setState({
          loading: false,
          error:
            e.response && e.response.data.message
              ? e.response.data.message
              : e.message,
        });
      }
    }
  };

  return (
    <>
      <Link to={`/${pageUrl}`} className="btn btn-light my-2">
        Go Back
      </Link>
      {message && <Message variant="danger">{message}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
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
                  <Rating
                    rating={product.rating}
                    reviews={product.numReviews}
                  />{' '}
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
                      <Col data-testid="price">${product.price}</Col>
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
                            value={qty}
                            style={{ padding: '5px' }}
                            onChange={({ target }) => setQty(target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              val => (
                                <option key={val} value={val + 1}>
                                  {val + 1}
                                </option>
                              )
                            )}
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
          <Row className="my-5">
            <Col md={8}>
              <Row className="text-right">
                <Col>
                  <Button variant="success" onClick={handleShow}>
                    Create Review
                  </Button>
                </Col>
              </Row>
              {product.reviews.map(review => (
                <div className="my-2" key={review._id}>
                  <p style={{ marginBottom: '-5px' }}>{review.name}</p>
                  <Rating rating={review.rating} reviews="" />
                  <p>{review.comment}</p>
                  <hr />
                </div>
              ))}
            </Col>
          </Row>
        </>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stars rating={rating} setRating={setRating} />
          <Form.Group>
            <Form.Label>Review : </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={createReview}>
            Create Review
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductScreen;
