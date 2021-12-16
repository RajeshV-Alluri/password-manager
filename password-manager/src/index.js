import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './css/main.min.css';
import App from './js/registerPage';
import Verification from './js/verificationPage';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/verification" element={<Verification />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);