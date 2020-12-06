import React, { useState, useEffect } from 'react';
import CheckOutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormWrapper from '../components/FormWrapper';
import { ListGroup, Button, Card, Row, Col, Image } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PlaceOrderScreen = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useSelector(state => state.userInfo);
  useEffect(() => {
    if (!user) history.push('/login?redirect=shipping');
  }, [user, history]);

  const { cartItems, shippingAddress, paymentMethod } = useSelector(
    state => state.cart
  );
  const { address, country, city, postalCode } = shippingAddress;

  //prices
  const itemsPrice = cartItems.reduce(
    (acc, cur) => acc + cur.price * cur.qty,
    0
  );
  const taxPrice = Number((itemsPrice * 0.15).toFixed(2));
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  //config
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        '/api/orders/',
        {
          orderItems: cartItems,
          shippingAddress: { address, country, city, postalCode },
          paymentMethod,
        },
        config
      );
      history.push(`/order/${data}`);
    } catch (e) {
      setError(
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message
      );
      setLoading(false);
    }
  };

  return (
    <>
      {error && <Message variant="danger">{error}</Message>}
      <FormWrapper>
        <CheckOutSteps
          className="justify-content-center"
          step1
          step2
          step3
          step4
        />
      </FormWrapper>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>SHIPPING</h3>
              <p>
                Address : {address}, {city}&nbsp;
                {postalCode}, {country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h3>PAYMENT METHOD</h3>
              <p>Method : {paymentMethod}</p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>CART ITEMS</h2>
              {cartItems.length === 0 ? (
                <Message variant="primary">You don't have any items</Message>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item, i) => (
                    <ListGroup.Item key={i}>
                      <Row>
                        <Col md={2}>
                          <Image src={item.image} alt={item.name} fluid />
                        </Col>
                        <Col md={6} className="align-self-center">
                          <Link to={`/product/${item.id}`}>{item.name}</Link>
                        </Col>
                        <Col md={4} className="align-self-center">
                          {item.qty}&nbsp;x&nbsp;${item.price}&nbsp;=&nbsp; $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>Order Summary</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items price :</Col>
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax price :</Col>
                  <Col>${taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping price :</Col>
                  <Col>${shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total price :</Col>
                  <Col>${totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {loading && <Loader />}
                <Button
                  variant="primary"
                  className="btn-block"
                  disabled={cartItems.length === 0}
                  onClick={handleClick}
                >
                  Create Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
