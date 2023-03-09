import React from "react";
import ReactDOM from "react-dom/client";

import './css/index.css';
import './css/colors.css';
import './css/app.css';

import { BrowserRouter, HashRouter } from "react-router-dom";
import Router from './navigation/router';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Router/>
    </BrowserRouter>
  </React.StrictMode>
);
