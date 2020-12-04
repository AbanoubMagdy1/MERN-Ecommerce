import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { loginAction } from '../actions/userActions';
import FormWrapper from '../components/FormWrapper';
import { Link } from 'react-router-dom';

const LoginScreen = ({ history, location }) => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.userInfo);

  const [info, setInfo] = useState({
    email: '',
    password: '',
  });

  const redirect = location.search ? location.search.split('=')[1] : '';

  useEffect(() => {
    if (user) {
      history.push(redirect);
    }
  }, [user]);

  const handleChange = ({ target }) => {
    setInfo({
      ...info,
      [target.name]: target.value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(loginAction(info.email, info.password));
  };
  return (
    <FormWrapper>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="warning">{error}</Message>
      ) : (
        ''
      )}
      <>
        <h1 className="my-3">SIGN IN</h1>
        <Form onSubmit={handleSubmit}>
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
          <Button type="submit" variant="primary" className="py-2 px-4 my-2">
            SIGN IN
          </Button>
        </Form>
        <p className="my-2">
          New customer ? &nbsp;
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>
        </p>
        <p className="my-3">
          Forget Your password ? &nbsp;
          <Link to="/reset">Reset My Password</Link>
        </p>
      </>
    </FormWrapper>
  );
};

export default LoginScreen;
