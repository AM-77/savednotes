import Types from '../Types';

export const login = (token, user) => ({
  type: Types.LOGIN,
  payload: { token, user },
});

export const logout = () => ({ type: Types.LOGOUT });

export const loadUser = (token, user) => ({
  type: Types.LOAD_USER,
  payload: { token, user },
});
