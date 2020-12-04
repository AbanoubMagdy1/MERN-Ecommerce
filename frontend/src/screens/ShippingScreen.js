import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { cartAddress } from '../actions/productActions';
import FormWrapper from '../components/FormWrapper';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = ({ history }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.userInfo);
  const { address, postalCode, city, country } = useSelector(
    state => state.cart.shippingAddress
  );

  const [info, setInfo] = useState({
    address,
    country,
    postalCode,
    city,
  });

  useEffect(() => {
    if (!user) {
      history.push('/login?redirect=shipping');
    }
  }, [user, history]);

  const handleChange = ({ target }) => {
    setInfo({
      ...info,
      [target.name]: target.value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(cartAddress(info));
    history.push('/payment');
  };
  return (
    <FormWrapper>
      <CheckoutSteps step1 step2 />
      <h1 className="my-3">SHIPPING</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Address :</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your Address"
            name="address"
            value={info.address}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Country:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter country"
            name="country"
            value={info.country}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Postal Code:</Form.Label>
          <Form.Control
            type="text"
            placeholder="postalCode"
            name="postalCode"
            value={info.postalCode}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>City:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter city"
            name="city"
            value={info.city}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="py-2 px-4 my-2">
          CONTINUE
        </Button>
      </Form>
    </FormWrapper>
  );
};

export default ShippingScreen;
