import React from 'react';
import ReactDOM from 'react-dom/client';
import store from './slices/store';
import { Provider } from 'react-redux';
import './index.css';
import './hack.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>        
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </Provider>
);