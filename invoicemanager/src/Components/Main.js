import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
//import { BrowserRouter, Route } from 'react-router-dom'

import Header from './HeaderComponents/Header';
import Menu from './MenuComponents/Menu';
import Login from './LoginComponents/Login';
import NewPlan from './MainScreenComponents/NewPlan';

//Import CSS
import '../assets/css/styles.min.css';
import './Main.css';


class Main extends Component {
  constructor (){
    super();
    this.state = {
      fields: {},
      authenticated: false
    };
  }


  onChange = updatedValue => {
    this.setState({
      fields: {
        ...this.state.fields,
        ...updatedValue
      }
    });
  };

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <Header authenticated={this.state.authenticated} />
          <Menu />
          <NewPlan />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;