import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './css/main.min.css';
import App from './js/registerPage';
import Verification from './js/verificationPage';
import PageNotFound from './js/pageNotFound'
import ForgotPassword from './js/forgotPassword'
import ChangePassword from './js/changePassword'

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" exact element={<App />} />
      <Route path="/verification/verify/:verificationToken" exact element={<Verification />} />
      <Route path="/forgot-password" exact element={<ForgotPassword />} />
      <Route path="/change-password/:passwordChangeToken" exact element={<ChangePassword />} />
      <Route path="*" element={<PageNotFound />}/>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);