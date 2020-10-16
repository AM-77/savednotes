import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Axios from 'axios';
import { login } from '../redux-store/action-creators/authenticationActionCreator';
import { BASE_URL, validateEmail } from '../helpers/helper';
import logo from '../assets/images/main-logo.png';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notif: null,
      email: '',
      password: '',
      lookingForUser: false,
    };
  }

  onInputChange = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    this.setState({ [name]: value });
  };

  onLogin = (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    if (email === '' || password === '') {
      this.notify({
        message: 'Please enter a valid email & password.',
        type: 'error',
      });
    } else {
      this.setState({ lookingForUser: true });
      if (validateEmail(email)) {
        Axios.post(`${BASE_URL}/users/login`, {
          email,
          password,
        })
          .then((res) => {
            if (res && res.data) {
              const { token, user } = res.data;
              const { logIn } = this.props;
              logIn(token, user);
              localStorage.setItem('token', token);
              this.setState({ lookingForUser: false });
            } else {
              this.notify({
                message: 'The user does not exist.',
                type: 'error',
              });
            }
          })
          .catch((err) => {
            if (err.message && err.message.data) {
              this.notify({
                message: err.response.data.message,
                type: 'error',
              });
            } else {
              this.notify({
                message:
                  'Server error, probably its due to the heroku app sleeping. Please try again in 10-15 second.',
                type: 'error',
              });
            }
          });
      } else {
        this.notify({
          message: 'You have entred an unvalid email, please try again.',
          type: 'error',
        });
      }
    }
  };

  notify = (notif) => {
    this.setState({ notif, lookingForUser: false }, () => {
      setTimeout(() => {
        this.setState({ notif: null });
      }, 3000);
    });
  };

  render = () => {
    const { notif, lookingForUser } = this.state;
    if (localStorage.getItem('token')) {
      return <Redirect to="/" />;
    }
    return (
      <div className="login-container">
        <div className="login-logo">
          <img src={logo} alt="The savednotes logo" />
          <h2 className="title">Saved Notes</h2>
        </div>
        {notif ? (
          <div className={`notify-user ${notif.type}`}>
            <p>{notif.message}</p>
          </div>
        ) : null}
        <div className="login-form">
          <form onSubmit={this.onLogin}>
            <div className="login-input">
              <label htmlFor="email">Your email:</label>
              <input
                id="email"
                className="login-input"
                name="email"
                type="email"
                onChange={this.onInputChange}
                required
              />
            </div>
            <div className="login-input">
              <label htmlFor="password">Your password:</label>
              <input
                id="password"
                className="login-input"
                name="password"
                type="password"
                onChange={this.onInputChange}
                required
              />
            </div>
            <div className="loading-user">
              {lookingForUser ? (
                <div className="dots">
                  <div />
                  <div />
                  <div />
                  <div />
                </div>
              ) : null}
            </div>
            <div className="login-foot">
              <Link to="/subscribe">Subscribe now.</Link>
              <button type="submit" className="login-button">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
}

Login.propTypes = {
  logIn: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({ ...store });
const dispatchStateToProps = (dispatch) => ({
  logIn: (token, user) => dispatch(login(token, user)),
});

export default connect(mapStateToProps, dispatchStateToProps)(Login);
