import React from 'react';
import logo from '../assets/images/main-logo.png';

export default function Loading() {
  return (
    <div className="laoding-container">
      <div className="loading">
        <div className="spinner">
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <img src={logo} alt="saved notes logo" />
        </div>
      </div>
    </div>
  );
}
