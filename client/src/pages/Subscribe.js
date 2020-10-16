import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Axios from 'axios';
import {
  BASE_URL,
  validateEmail,
  validateUsername,
  validatePassword,
} from '../helpers/helper';

import logo from '../assets/images/main-logo.png';

class Subscribe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notif: null,
      email: '',
      username: '',
      password: '',
      lookingForUser: false,
    };
  }

  onInputChange = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    this.setState({ [name]: value });
  };

  onSubscribe = (e) => {
    e.preventDefault();
    const { email, password, username } = this.state;

    if (email === '' || password === '' || username === '') {
      this.setState(
        {
          notif: { message: 'Please Fill All The Fields.', type: 'error' },
          lookingForUser: false,
        },
        () => {
          setTimeout(() => {
            this.setState({ notif: null });
          }, 1700);
        }
      );
    } else {
      this.setState({ lookingForUser: true });

      if (validateEmail(email)) {
        const passwordValidation = validatePassword(password, {
          lowercase: true,
          uppercase: true,
          numeric: true,
          symboles: false,
        });
        if (
          passwordValidation.lowercase &&
          passwordValidation.numeric &&
          passwordValidation.uppercase
        ) {
          if (validateUsername(username)) {
            Axios.post(`${BASE_URL}/users/subscribe`, {
              email,
              password,
              username,
            })
              .then((res) => {
                if (res.data) {
                  this.setState(
                    {
                      notif: {
                        message: 'A new user was created.',
                        type: 'success',
                      },
                      lookingForUser: false,
                    },
                    () => {
                      setTimeout(() => {
                        const {
                          history: { push },
                        } = this.props;
                        this.setState({ notif: null }, () => {
                          push('/');
                        });
                      }, 3000);
                    }
                  );
                } else {
                  this.notify({
                    message:
                      'Email already exist, please try with a different email.',
                    type: 'error',
                  });
                }
              })
              .catch((err) => {
                if (err.response && err.response.data) {
                  this.notify({
                    message: err.response.data.message,
                    type: 'error',
                  });
                } else {
                  this.notify({
                    message: 'Server Error! Please report this issue.',
                    type: 'error',
                  });
                }
              });
          } else {
            this.notify({
              message: 'Unvalid username, must contains alpha-numeric only.',
              type: 'error',
            });
          }
        } else {
          this.notify({
            message:
              'Unvalid password, must contains lowercase, uppercase, numbers and length > 7.',
            type: 'error',
          });
        }
      } else {
        this.notify({
          message: 'Unvalid email. please try again with a different email.',
          type: 'error',
        });
      }
    }
  };

  notify = (notif) => {
    this.setState(
      {
        notif,
        lookingForUser: false,
      },
      () => {
        setTimeout(() => {
          this.setState({ notif: null });
        }, 1700);
      }
    );
  };

  render = () => {
    const { notif, lookingForUser } = this.state;

    if (localStorage.getItem('token')) {
      return <Redirect to="/" />;
    }
    return (
      <div className="subscribe-container">
        <div className="subscribe-logo">
          <img src={logo} alt="The saved notes logo" />
          <h2 className="title">Saved Notes</h2>
        </div>
        {notif ? (
          <div className={`notify-user ${notif.type}`}>
            <p>{notif.message}</p>
          </div>
        ) : null}
        <div className="subscribe-form">
          <form method="post" onSubmit={this.onSubscribe}>
            <div className="subscribe-input">
              <label htmlFor="email">Your email:</label>
              <input
                id="email"
                className="subscribe-input"
                name="email"
                type="email"
                onChange={this.onInputChange}
                required
              />
            </div>
            <div className="subscribe-input">
              <label htmlFor="username">Your username:</label>
              <input
                id="username"
                className="subscribe-input"
                name="username"
                type="text"
                onChange={this.onInputChange}
                required
              />
            </div>
            <div className="subscribe-input">
              <label htmlFor="password">Your password:</label>
              <input
                id="password"
                className="subscribe-input"
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
            <div className="subscribe-foot">
              <Link to="/login">Sign In.</Link>
              <button type="submit" className="subscribe-button">
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
}

Subscribe.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = (store) => ({ ...store });
export default connect(mapStateToProps)(Subscribe);
