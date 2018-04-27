import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import withAuthorization from './withAuthorization';
import Header from './HeaderComponents/Header';
import Menu from './MenuComponents/Menu';

//Import CSS
import '../assets/css/styles.min.css';
import './Home.css';

class Main extends Component {
  render() {
    return (
        <MuiThemeProvider>
          <div className="App">
            <Header />
            <Menu />
          </div>
        </MuiThemeProvider>
    );
  }
}

export default Main;