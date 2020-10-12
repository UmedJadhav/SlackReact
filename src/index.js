import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import { BrowserRouter as Router , Switch , Route } from 'react-router-dom';

import Login from './components/Auth/Login.component';
import Register from './components/Auth/Register.component';


const Root = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={ App }/>
      <Route path="/register" component={ Register }/>
      <Route path="/login" component={ Login }/>
    </Switch>
  </Router>
);


ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);
