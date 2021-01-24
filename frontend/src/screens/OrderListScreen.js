import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Table } from 'react-bootstrap';
import axios from 'axios';

const OrderListScreen = ({ history, match }) => {
  const { user } = useSelector(state => state.userInfo);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [numOfPages, setNumOfPages] = useState(1);

  const config = {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  };
  useEffect(() => {
    if (!user || !user.isAdmin) history.push('/');
    else {
      fetchOrders(match.params.page);
    }
    // eslint-disable-next-line
  }, [user, match.params.page]);

  const fetchOrders = async page => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/orders/all/${page}`, config);
      setOrders(data.orders);
      setNumOfPages(data.numOfPages);
    } catch (e) {
      setError(
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message
      );
    }
    setLoading(false);
  };

  const updateOrderToDelivred = async (id, price) => {
    if (
      window.confirm(`Update this order to be deliverd whose value ${price}?`)
    ) {
      setLoading(true);
      try {
        const { data } = await axios.put(
          `/api/orders/deliver/${id}`,
          {},
          config
        );
        setMessage(data);
        setOrders(
          orders.map(order => {
            if (order._id !== id) return order;
            else {
              order.isDelivered = true;
              return order;
            }
          })
        );
      } catch (e) {
        setError(
          e.response && e.response.data.message
            ? e.response.data.message
            : e.message
        );
      }
      setLoading(false);
    }
  };

  return (
    <>
      <h2>ORDERS</h2>
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      {message && <Message variant="success">{message}</Message>}
      <Table hover striped bordered className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>OWNER NAME</th>
            <th>TOTAL PRICE</th>
            <th>IS PAID</th>
            <th>IS DELIVERED</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>
                <Link to={`/order/${order._id}`}>{order._id}</Link>
              </td>
              <td>{order.user.name}</td>
              <td>${order.totalPrice}</td>
              <td>
                {order.isPaid ? (
                  <i className="fas fa-check" style={{ color: 'green' }}></i>
                ) : (
                  <i className="fas fa-times" style={{ color: 'red' }}></i>
                )}
              </td>
              <td>
                {order.isDelivered ? (
                  <i className="fas fa-check" style={{ color: 'green' }}></i>
                ) : (
                  <i className="fas fa-times" style={{ color: 'red' }}></i>
                )}
              </td>
              <td>
                <Button
                  variant="secondary"
                  onClick={() =>
                    updateOrderToDelivred(order._id, order.totalPrice)
                  }
                  disabled={order.isDelivered}
                >
                  Deliver
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Paginate
        url="/admin/orderlist"
        page={parseInt(match.params.page)}
        numOfPages={numOfPages}
      />
    </>
  );
};

export default OrderListScreen;
