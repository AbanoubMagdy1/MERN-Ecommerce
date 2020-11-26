import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { updateProfileAction } from '../actions/userActions';

const RegisterScreen = ({ history, location }) => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.userInfo);

  const [info, setInfo] = useState({
    name: '',
    email: '',
    password: '',
    conPassword: '',
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user) {
      history.push('/login');
    } else {
      setInfo({
        ...info,
        name: user.name,
        email: user.email,
      });
    }
  }, []);

  const handleChange = ({ target }) => {
    setInfo({
      ...info,
      [target.name]: target.value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (info.password != info.conPassword) {
      setMsg("Password doesn't match");
    } else {
      dispatch(updateProfileAction(info));
    }
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
      </Col>
    </Row>
  );
};

export default RegisterScreen;
