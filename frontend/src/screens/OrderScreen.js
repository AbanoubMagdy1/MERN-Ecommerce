import React, { useState, useEffect } from 'react';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useSelector } from 'react-redux';
import { ListGroup, Card, Row, Col, Image } from 'react-bootstrap';
import { PayPalButton } from 'react-paypal-button-v2';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const PlaceOrderScreen = ({ match, history }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState({
    user: {},
    shippingAddress: {},
    orderItems: [],
  });

  const [sdkReady, setSdkReady] = useState(false);

  const { user } = useSelector(state => state.userInfo);

  useEffect(() => {
    if (!user) history.push('/login');
    else {
      if (!order.user.name) {
        getOrder();
      } else if (!order.isPaid) {
        if (!window.paypal) {
          addPayPalScript();
        } else {
          setSdkReady(true);
        }
      }
    }
    // eslint-disable-next-line
  }, [user, history, order]);

  //config
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
  };

  const getOrder = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/orders/${match.params.id}`,
        config
      );
      setOrder(data);
    } catch (e) {
      setError(
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message
      );
    }
    setLoading(false);
  };

  const addPayPalScript = async () => {
    const { data: clientId } = await axios.get('/api/config/paypal');
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  const onSuccessHandler = async paymentResult => {
    setLoading(true);
    try {
      const { data } = await axios.put(
        `/api/orders/pay/${order._id}`,
        { ...paymentResult },
        config
      );
      setOrder(data);
    } catch (e) {
      setError(
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message
      );
    }
    setLoading(false);
  };

  return (
    <>
      {error ? (
        <Message variant="danger">{error}</Message>
      ) : loading ? (
        <Loader />
      ) : (
        <Row>
          <h2>Order {match.params.id}</h2>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>SHIPPING</h3>
                <p>Name : {order.user.name}</p>
                <p>Email : {order.user.email}</p>
                <p>
                  Address : {order.shippingAddress.address},{' '}
                  {order.shippingAddress.city}&nbsp;
                  {order.shippingAddress.postalCode},{' '}
                  {order.shippingAddress.country}
                </p>
                {order.isDelivered ? (
                  <p>
                    Delivered at : {moment(order.deliveredAt).format('LLL')}
                  </p>
                ) : (
                  <Message variant="warning">Not delivered yet</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <h3>PAYMENT METHOD</h3>
                <p>Method : {order.paymentMethod}</p>
                {order.isPaid ? (
                  <p>Paid at : {moment(order.paidAt).format('LLL')}</p>
                ) : (
                  <Message variant="warning">Not paid yet</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>ORDER ITEMS</h2>
                {order.orderItems.length === 0 ? (
                  <Message variant="primary">You don't have any items</Message>
                ) : (
                  <ListGroup variant="flush">
                    {order.orderItems.map((item, i) => (
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
                    <Col>${order.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax price :</Col>
                    <Col>${order.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping price :</Col>
                    <Col>${order.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total price :</Col>
                    <Col>${order.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {!sdkReady ? (
                      <Loader />
                    ) : (
                      <PayPalButton
                        amount={order.totalPrice}
                        onSuccess={onSuccessHandler}
                      />
                    )}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default PlaceOrderScreen;
