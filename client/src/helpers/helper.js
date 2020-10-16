export const BASE_URL =
  process.env.REACT_APP_BASE_URL || 'http://localhost:3300/api/v1';

export const validateEmail = (email) =>
  // eslint-disable-next-line
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    String(email).toLowerCase()
  );

export const validateUsername = (username) =>
  /^[a-z0-9]+$/i.test(String(username));

export const validatePassword = (password, passwordRules) => {
  const response = {};
  if (passwordRules.lowercase) response.lowercase = /[a-z]/.test(password);
  if (passwordRules.uppercase) response.uppercase = /[A-Z]/.test(password);
  if (passwordRules.numeric) response.numeric = /[0-9]/.test(password);
  if (passwordRules.symboles) {
    // eslint-disable-next-line
    response.symbols = /[~@#$%^&*+=`|{}:;!.?\"()\[\]-]/.test(password);
  }

  return response;
};

export const formatDate = (date) => {
  const d = new Date(date);
  if (d.toString() !== 'Invalid Date') {
    return `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`;
  }
  return 'Unknown Date';
};
