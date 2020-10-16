import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../redux-store/action-creators/authenticationActionCreator';

function NavBar(props) {
  const logOut = () => {
    props.logout();
    localStorage.removeItem('token');
  };

  const { search, user } = props;
  return (
    <div className="navbar-container">
      <div className="search">
        <span className="icon">
          <svg fill="#4a4a4a" viewBox="0 0 480 480">
            <path d="m240 0c-132.546875 0-240 107.453125-240 240s107.453125 240 240 240 240-107.453125 240-240c-.148438-132.484375-107.515625-239.851562-240-240zm0 464c-123.710938 0-224-100.289062-224-224s100.289062-224 224-224 224 100.289062 224 224c-.140625 123.652344-100.347656 223.859375-224 224zm0 0" />
            <path d="m302.894531 291.574219c36.472657-42.550781 32.792969-106.316407-8.328125-144.394531-41.121094-38.078126-104.980468-36.851563-144.609375 2.777343-39.628906 39.628907-40.855469 103.488281-2.777343 144.609375 38.078124 41.121094 101.84375 44.800782 144.394531 8.328125l54.769531 54.761719c3.140625 3.03125 8.128906 2.988281 11.214844-.097656 3.085937-3.085938 3.128906-8.074219.097656-11.214844zm-78.894531 20.425781c-48.601562 0-88-39.398438-88-88s39.398438-88 88-88 88 39.398438 88 88c-.058594 48.578125-39.421875 87.941406-88 88zm0 0" />
          </svg>
        </span>
        <input
          type="text"
          name="searchFor"
          onChange={(e) => search(e.target.value)}
          placeholder="Search"
        />
      </div>
      <div className="profile">
        <p className="user-name">{user.username}</p>
        <button type="button" onClick={logOut}>
          <svg fill="#4a4a4a" viewBox="0 0 511 512">
            <path d="m361.5 392v40c0 44.113281-35.886719 80-80 80h-201c-44.113281 0-80-35.886719-80-80v-352c0-44.113281 35.886719-80 80-80h201c44.113281 0 80 35.886719 80 80v40c0 11.046875-8.953125 20-20 20s-20-8.953125-20-20v-40c0-22.054688-17.945312-40-40-40h-201c-22.054688 0-40 17.945312-40 40v352c0 22.054688 17.945312 40 40 40h201c22.054688 0 40-17.945312 40-40v-40c0-11.046875 8.953125-20 20-20s20 8.953125 20 20zm136.355469-170.355469-44.785157-44.785156c-7.8125-7.8125-20.476562-7.8125-28.285156 0-7.8125 7.808594-7.8125 20.472656 0 28.28125l31.855469 31.859375h-240.140625c-11.046875 0-20 8.953125-20 20s8.953125 20 20 20h240.140625l-31.855469 31.859375c-7.8125 7.808594-7.8125 20.472656 0 28.28125 3.90625 3.90625 9.023438 5.859375 14.140625 5.859375 5.121094 0 10.238281-1.953125 14.144531-5.859375l44.785157-44.785156c19.496093-19.496094 19.496093-51.214844 0-70.710938zm0 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}

NavBar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  search: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

const dispatchStateToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
});
export default connect(null, dispatchStateToProps)(NavBar);
