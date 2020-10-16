import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Axios from 'axios';
import {
  loadUser,
  logout,
} from '../redux-store/action-creators/authenticationActionCreator';
import { BASE_URL } from '../helpers/helper';
import Loading from './Loading';

function Logged(props) {
  const {
    auth: { user, token },
    children,
  } = props;
  if (user) {
    return <>{children}</>;
  }
  if (token) {
    Axios.get(`${BASE_URL}/users`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((res) => {
        props.loadUser(token, res.data.result);
      })
      .catch(() => {
        props.logout();
      });
    return <Loading />;
  }

  return <Redirect to="/login" />;
}

Logged.propTypes = {
  auth: PropTypes.shape({
    token: PropTypes.string,
    user: PropTypes.shape({
      id: PropTypes.number,
      username: PropTypes.string,
      email: PropTypes.string,
    }),
  }).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  loadUser: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({ ...store });
const dispatchStateToProps = (dispatch) => ({
  loadUser: (token, user) => dispatch(loadUser(token, user)),
  logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, dispatchStateToProps)(Logged);
