import React from 'react';
import { render } from 'react-dom';
import './content.styles.css';

let body = window.document.body
let appDiv = document.createElement('div');
appDiv.id = `app-chess-container-${Math.random()}`
body.appendChild(appDiv)

const App = () => {
  return (
    <div className="absolute top-0 right-0">
      Hello world!
    </div>
  )
}

if(body) {
  render(<App />, appDiv);
}

if (module.hot) module.hot.accept();
