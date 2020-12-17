import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { useSelector } from 'react-redux';
import { Button, Table } from 'react-bootstrap';
import axios from 'axios';

const UserListScreen = ({ history, match }) => {
  const { user } = useSelector(state => state.userInfo);
  const [users, setUsers] = useState([]);
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
      fetchUsers(match.params.page);
    }
  }, [user, match.params.page]);

  const fetchUsers = async page => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/users/${page}`, config);
      setUsers(data.users);
      setNumOfPages(data.pages);
    } catch (e) {
      setError(
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message
      );
    }
    setLoading(false);
  };

  const deleteUser = async (id, name) => {
    if (
      window.confirm(`Delete ${name}??`) &&
      window.confirm(`Confirm again to delete ${name}??`)
    ) {
      setLoading(true);
      try {
        const { data } = await axios.delete(`/api/users/${id}`, config);
        setMessage(data);
        setUsers(users.filter(user => user._id !== id));
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

  const makeUserAdmin = async (id, name) => {
    if (
      window.confirm(`Make ${name} an admin??`) &&
      window.confirm(`Confirm again to make ${name} an admin??`)
    ) {
      setLoading(true);
      try {
        const { data } = await axios.put(`/api/users/${id}`, null, config);
        setMessage(data);
        setUsers(
          users.map(user => {
            if (user._id !== id) return user;
            else {
              user.isAdmin = !user.isAdmin;
              return user;
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
      <h2>USERS</h2>
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      {message && <Message variant="success">{message}</Message>}
      <Table hover striped bordered className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>IS ADMIN</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.isAdmin ? (
                  <i className="fas fa-check" style={{ color: 'green' }}></i>
                ) : (
                  <i className="fas fa-times" style={{ color: 'red' }}></i>
                )}
              </td>
              <td>
                <Button
                  variant="success"
                  onClick={() => makeUserAdmin(user._id, user.name)}
                >
                  {user.isAdmin ? 'STOP ADMIN' : 'MAKE ADMIN'}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteUser(user._id, user.name)}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Paginate
        url="/admin/userlist"
        page={parseInt(match.params.page)}
        numOfPages={numOfPages}
      />
    </>
  );
};

export default UserListScreen;
