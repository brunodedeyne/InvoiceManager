import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
//import { firebase } from './Firebase';
import withAuthentication from './withAuthentication';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Login from './Components/LoginComponents/Login';
import Main from './Components/Main';
import Home from './Components/Home';

import * as routes from './constants/routes/routes';

//Import CSS
import './assets/css/styles.min.css';
import './App.css';

injectTapEventPlugin();

const App = () =>
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     authUser: null,
  //   };
  // }

  // componentDidMount() {
  //   firebase.auth.onAuthStateChanged(authUser => {
  //     authUser
  //       ? this.setState(() => ({ authUser }))
  //       : this.setState(() => ({ authUser: null }));
  //   });
  // }


      <Router>
        <MuiThemeProvider>
          <div className="App">
            <Login />
            <Route
              exact path={routes.HOME}
              component={Home}
            />
          </div>
        </MuiThemeProvider>
      </Router>


export default withAuthentication(App);