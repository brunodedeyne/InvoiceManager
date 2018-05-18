import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Header from './HeaderComponents/Header';
import Menu from './MenuComponents/Menu';

//Import CSS
import '../assets/css/styles.min.css';
import './Home.css';

class Home extends React.Component {
  render() {
    return (
      <MuiThemeProvider>
        <div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Home;