import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import { BrowserRouter as Router , Switch , Route, withRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import firebase from './firebase';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

import rootReducer from './reducers/reducers';
import { setUser } from './actions/actions';

import Login from './components/Auth/Login.component';
import Register from './components/Auth/Register.component';
import Spinner from './components/Spinner/Spinner.component';


const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

class Root extends Component{

  componentDidMount() {
    firebase.auth().onAuthStateChanged( user => {
      if(user){
        this.props.setUser(user);
        this.props.history.push('/');
      }
    });
  }
  
  render(){
      return this.props.isLoading ? <Spinner/> : (
                <Switch>
                  <Route exact path="/" component={ App }/>
                  <Route path="/register" component={ Register }/>
                  <Route path="/login" component={ Login }/>
                </Switch>
              )

  }
} 

const mapStateToProps = state => ({
  isLoading: state.user.isLoading
});

const RootwithAuth = withRouter(connect(mapStateToProps,{ setUser })(Root));
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store} >
      <Router>
        <RootwithAuth />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
