import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './HeaderComponents/Header';
import Menu from './MenuComponents/Menu';
import Login from './LoginComponents/Login';
import Home from './Home';
//import Overview from './OverviewComponents/Overview';
import * as routes from '../constants/routes/routes';
//Import CSS
//import '../assets/css/styles.min.css';
import './Main.css';


class Main extends Component {
  render() {
    return (
      //<Router>
        <div>
          <MuiThemeProvider>
              <Header />
              <Menu /> 
              <div>
              
              </div>
            
          </MuiThemeProvider>
        </div>
      //</Router>
    );
  }
}

export default Main;