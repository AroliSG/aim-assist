import React from 'react';
import ReactDOM from 'react-dom/client';

import './css/index.css';
import './css/colors.css';
import './css/app.css';

import { BrowserRouter } from "react-router-dom";

import reportWebVitals from './reportWebVitals';
import Router from './navigation/router';


const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
      <BrowserRouter>
        <Router/>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
