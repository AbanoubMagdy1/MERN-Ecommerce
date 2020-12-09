import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Row, Col, Table } from 'react-bootstrap';
import { updateProfileAction } from '../actions/userActions';
import axios from 'axios';
import moment from 'moment';

const ProfileScreen = ({ history }) => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.userInfo);

  const [info, setInfo] = useState({
    name: '',
    email: '',
    password: '',
    conPassword: '',
  });
  const [msg, setMsg] = useState('');
  const [msg2, setMsg2] = useState('');
  const [loader, setLoader] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      history.push('/login');
      return;
    } else {
      setInfo({
        ...info,
        name: user.name,
        email: user.email,
      });
    }
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const handleChange = ({ target }) => {
    setInfo({
      ...info,
      [target.name]: target.value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (info.password !== info.conPassword) {
      setMsg("Password doesn't match");
    } else {
      dispatch(updateProfileAction(info));
    }
  };

  //config
  const config = {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`/api/orders/myorders`, config);
      setOrders(data);
    } catch (e) {
      setMsg2(
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message
      );
    }
    setLoader(false);
  };

  return (
    <Row>
      <Col md={3}>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="warning">{error}</Message>
        ) : msg ? (
          <Message variant="warning">{msg}</Message>
        ) : (
          ''
        )}
        <h2>My Profile</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              name="name"
              value={info.name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter email"
              name="email"
              value={info.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="password"
              value={info.password}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Reenter password"
              name="conPassword"
              value={info.conPassword}
              onChange={handleChange}
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="py-2 px-4 my-2">
            Update Profile
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My orders</h2>
        {loader ? (
          <Loader />
        ) : msg2 ? (
          <Message variant="warning">{msg2}</Message>
        ) : (
          <Table striped bordered hover className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIEVERED</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{moment(order.createdAt).format('L')}</td>
                  <td>${order.totalPrice}</td>
                  <td>
                    <i
                      className={`fas fa-${order.isPaid ? 'check' : 'times'}`}
                      style={{ color: `${order.isPaid ? 'green' : 'red'}` }}
                    ></i>
                  </td>
                  <td>
                    <i
                      className={`fas fa-${
                        order.isDelivered ? 'check' : 'times'
                      }`}
                      style={{
                        color: `${order.isDelivered ? 'green' : 'red'}`,
                      }}
                    ></i>
                  </td>
                  <td>
                    <Button
                      onClick={() => history.push(`/order/${order._id}`)}
                      variant="light"
                      size="sm"
                    >
                      DETAILS
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
