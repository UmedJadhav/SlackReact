import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import { BrowserRouter as Router , Switch , Route, withRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import firebase from './firebase';

import Login from './components/Auth/Login.component';
import Register from './components/Auth/Register.component';


class Root extends Component{
  componentDidMount() {
    firebase.auth().onAuthStateChanged( user => {
      if(user){
        this.props.history.push('/');
      }
    });
  }
  
  render(){
      return (
                <Switch>
                  <Route exact path="/" component={ App }/>
                  <Route path="/register" component={ Register }/>
                  <Route path="/login" component={ Login }/>
                </Switch>
              )

  }
} 

const RootwithAuth = withRouter(Root);
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <RootwithAuth />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
