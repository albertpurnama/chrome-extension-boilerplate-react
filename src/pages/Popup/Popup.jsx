import React from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';

const Popup = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Liking this extension so far?
        </p>
        <a
          className="App-link"
          href="https://www.paypal.com/paypalme/albertpurnama/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Buy me a cup of coffee!
        </a>
      </header>
    </div>
  );
};

export default Popup;
