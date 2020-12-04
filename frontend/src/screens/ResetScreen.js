import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import FormWrapper from '../components/FormWrapper';
import Message from '../components/Message';
import Loader from '../components/Loader';
import axios from 'axios';
import { set } from 'mongoose';

const ResetScreen = ({ history, location }) => {
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [info, setInfo] = useState({
    password: '',
    conPassword: '',
    email: '',
  });

  const { user } = useSelector(state => state.userInfo);

  useEffect(() => {
    if (user) history.push('/');
  }, [user, history]);

  const token = location.search ? location.search.split('=')[1] : '';

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const handleChange = ({ target }) => {
    setInfo({
      ...info,
      [target.name]: target.value,
    });
    console.log(info);
  };

  const resetPassword = async e => {
    e.preventDefault();
    const { password, conPassword } = info;
    setLoading(true);
    try {
      if (password === conPassword) {
        const res = await axios.post(
          '/api/users/resetconfirm',
          { password, token },
          config
        );
        setMsg(res.data);
      } else {
        setMsg("Passwords doesn't match");
      }
      setLoading(false);
    } catch (e) {
      setMsg(
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message
      );
      setLoading(false);
    }
  };

  const sendEmail = async e => {
    e.preventDefault();
    const { email } = info;
    setLoading(true);
    try {
      const res = await axios.post('/api/users/resetemail', { email }, config);
      setMsg(res.data);
      setLoading(false);
    } catch (e) {
      setMsg(
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message
      );
      setLoading(false);
    }
  };

  return (
    <FormWrapper>
      {msg && <Message variant="warning">{msg}</Message>}
      {loading && <Loader />}
      {token ? (
        <>
          <h2>Enter your new password</h2>
          <Form className="my-5" onSubmit={resetPassword}>
            <Form.Group>
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={info.password}
                onChange={handleChange}
                required
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
              Reset Password
            </Button>
          </Form>
        </>
      ) : (
        <>
          <h4>Enter your email to reset your password</h4>
          <Form className="my-5" onSubmit={sendEmail}>
            <Form.Group>
              <Form.Label>Your Email:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={info.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="py-2 px-4 my-2">
              SEND EMAIL
            </Button>
          </Form>
        </>
      )}
    </FormWrapper>
  );
};

export default ResetScreen;
