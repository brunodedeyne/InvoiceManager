import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { browserHistory } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Redirect } from 'react-router'

//import Main from './Components/Main';
import NewPlan from './Components/MainScreenComponents/NewPlanComponents/NewPlan';
import NewInvoice from './Components/MainScreenComponents/NewInvoiceComponents/NewInvoice';
import Overview from './Components/MainScreenComponents/OverviewComponents/Overview';
import Clients from './Components/MainScreenComponents/ClientsComponents/Clients';
import Invoices from './Components/MainScreenComponents/InvoicesComponents/Invoices';
import Login from './Components/LoginComponents/Login';
import Loading from './Components/Loading';

import * as routes from './constants/routes/routes';
import * as firebase from 'firebase';


//Import CSS
import './assets/css/styles.min.css';
import './App.css';
require("firebase/firestore");

injectTapEventPlugin();

var config = {
  apiKey: "AIzaSyDiYwctQZs8cq4LwrUJ0JZvs0ne2f9Bjbg",
  authDomain: "invoicemanager-1525702104034.firebaseapp.com",
  databaseURL: "https://invoicemanager-1525702104034.firebaseio.com",
  projectId: "invoicemanager-1525702104034",
  storageBucket: "invoicemanager-1525702104034.appspot.com",
  messagingSenderId: "908003589667"
};

firebase.initializeApp(config);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        loading: false,
        user,
      });      
      if (this.state.user) {
        console.log("Ingelogd: "  + user);
      }
      else {
        console.log("Uitgelogd: "  + user);
      }
    });
  }

  componentWillUnmount() {
    this.authSubscription();
  }

  
render () {
  if (this.state.loading) return(
    <Loading />
  );
  if (this.state.user) return (
    <div className="AppDiv">
      <Router>
        <MuiThemeProvider>
          <div className="App">
            <Route
              exact path={routes.NEW_PLAN}
              component={() => <NewPlan />}
            /> 
            <Route
              exact path={routes.NEW_INVOICE}
              component={() => <NewInvoice />}
            />
            <Route
              exact path={routes.OVERVIEW}
              component={() => <Overview />}
            />
            <Route
              exact path={routes.CLIENTS}
              component={() => <Clients />}
            />
            <Route
              exact path={routes.INVOICES}
              component={() => <Invoices />}         
            />    
            <Route
              exact path={routes.LOGIN}
              component={() => <Login />}         
            />   
          </div>
        </MuiThemeProvider>
      </Router>
      </div>
    );
  return (
    <div className="AppDiv">
    <MuiThemeProvider>
      <Login />
    </MuiThemeProvider>
    </div>
  )}
}

export default App