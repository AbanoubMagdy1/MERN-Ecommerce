import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { cartMethod } from '../actions/productActions';
import FormWrapper from '../components/FormWrapper';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentScreen = ({ history }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.userInfo);
  const shippingMethod = useSelector(state => state.cart.shippingMethod);

  const [method, setMethod] = useState(shippingMethod);

  useEffect(() => {
    if (!user) {
      history.push('/login?redirect=shipping');
    }
  }, [user, history]);

  const handleChange = ({ target }) => {
    setMethod(target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(cartMethod(method));
    history.push('/placeorder');
  };

  return (
    <FormWrapper>
      <CheckoutSteps step1 step2 step3 />
      <h1 className="my-3">PAYMENT METHOD</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label as="legend">SELECT Method :</Form.Label>
          <Form.Check
            type="radio"
            label="Paypal or credit card"
            name="paymentMethod"
            value="Paypal"
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

export default PaymentScreen;
