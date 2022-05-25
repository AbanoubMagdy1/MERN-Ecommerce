import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  Row,
  Col,
  Image,
  Form,
  Card,
  Button,
  ListGroup,
} from 'react-bootstrap';
import { cartAdd, cartRemove } from '../actions/productActions';
import { useDispatch, useSelector } from 'react-redux';

const CartScreen = ({ history, match, location }) => {
  //Get Amount from the query
  const qty = parseInt(location.search.split('=')[1]);

  //Get Cart items from redux
  const { cartItems, loading, error } = useSelector(state => state.cart);

  //Calcaulta total number of items and total price
  const totalItems = cartItems.length
    ? cartItems.reduce((acc, cur) => acc + cur.qty, 0)
    : 0;

  const totalPrice = cartItems.length
    ? cartItems.reduce((acc, cur) => acc + cur.qty * cur.price, 0)
    : 0;

  //Dispatch adding item
  const dispatch = useDispatch();
  useEffect(() => {
    if (match.params.id) dispatch(cartAdd(match.params.id, qty));
  }, [dispatch, match.params.id, qty]);

  const handleClick = () => {
    history.push('/login?redirect=shipping');
  };

  return (
    <>
      <h1 className="my-3">SHOPPING CART</h1>
      <Row>
        <Col md={8}>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : !cartItems.length ? (
            <Message variant="info">
              Your cart is empty! <Link to="/">Go back</Link>
            </Message>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map(item => (
                <ListGroup.Item key={item.id}>
                  <Row className="my-2">
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item.id}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>${item.price}</Col>
                    <Col md={2}>
                      <Form.Control
                        as="select"
                        onChange={({ target }) => {
                          dispatch(cartAdd(item.id, parseInt(target.value)));
                        }}
                        value={item.qty}
                        style={{ padding: '5px' }}
                      >
                        {[...Array(item.count).keys()].map(val => (
                          <option value={val + 1} key={val + 1}>
                            {val + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                      <Button
                        className="btn btn-light"
                        onClick={() => dispatch(cartRemove(item.id))}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>Subtotal ({totalItems}) items</h3>
                <p data-testid="cartPrice">${totalPrice.toFixed(2)}</p>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  className="btn btn-block"
                  disabled={!totalItems}
                  onClick={handleClick}
                >
                  Proceed to checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CartScreen;
