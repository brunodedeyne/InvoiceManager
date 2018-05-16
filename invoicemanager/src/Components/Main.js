import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './LoginComponents/Login';
import * as routes from '../constants/routes/routes';
import './Main.css';
import NewPlan from './MainScreenComponents/NewPlanComponents/NewPlan';
import * as firebase from 'firebase';
import {withRouter} from 'react-router-dom';


class Main extends Component {
  constructor(props) {
    super (props);
    this.state = {
      renderedComponent: ''
    };
  }

  componentWillMount (){

    var user = firebase.auth().currentUser;

    if (user) {
      this.props.history.push('/clients'); 
    } else {
      this.props.history.push('/Login'); 
    }
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
            {this.state.renderedComponent}
        </MuiThemeProvider>
      </div>
    );
  }
}

export default withRouter(Main);