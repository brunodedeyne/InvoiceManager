import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Main from './Components/Main';
import NewPlan from './Components/MainScreenComponents/NewPlanComponents/NewPlan';
import NewInvoice from './Components/MainScreenComponents/NewInvoiceComponents/NewInvoice';
import Overview from './Components/MainScreenComponents/OverviewComponents/Overview';
import Clients from './Components/MainScreenComponents/ClientsComponents/Clients';
import Invoices from './Components/MainScreenComponents/InvoicesComponents/Invoices';
import Login from './Components/LoginComponents/Login';

import * as routes from './constants/routes/routes';

//Import CSS
import './assets/css/styles.min.css';
import './App.css';

injectTapEventPlugin();

const App = () =>
      <Router>
        <MuiThemeProvider>
          <div className="App">
            <Main />
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


export default App;