import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { registerAction } from '../actions/userActions';
import FormWrapper from '../components/FormWrapper';
import { Link } from 'react-router-dom';

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

  const redirect = location.search ? location.search.split('=')[1] : '';

  useEffect(() => {
    if (user) {
      history.push(redirect);
    }
  }, [user, history, redirect]);

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
      dispatch(registerAction(info.email, info.name, info.password));
    }
  };
  return (
    <FormWrapper>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="warning">{error}</Message>
      ) : msg ? (
        <Message variant="warning">{msg}</Message>
      ) : (
        ''
      )}
      <>
        <h1 className="my-3">SIGN IN</h1>
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
            SIGN UP
          </Button>
        </Form>
        <p className="my-2">
          Already have an account ?
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </p>
      </>
    </FormWrapper>
  );
};

export default RegisterScreen;
