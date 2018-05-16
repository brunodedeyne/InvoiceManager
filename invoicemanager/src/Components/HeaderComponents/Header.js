import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as routes from '../../constants/routes/routes';
import Logout from '../LogOutComponents/Logout';
import FlatButton from 'material-ui/FlatButton';
import * as firebase from 'firebase';
import {withRouter} from 'react-router-dom';

import Logo from './Logo';

//Import CSS
import './Header.css';

class Header extends Component {
  constructor (props){
    super(props);
  }

  handleSignOut = () => {
    firebase.auth().signOut().then(function() {
        this.props.history.push('/Login'); 
    }).catch(function(error) {
      console.log(error);
    });
  }

  render() {
    return (
        <header className="header">
          <Logo text="Dedeyne - Coomans"/>
          <p className="header__Title">{this.props.headerTitle}</p>
          <p className="header__Logout">
            <FlatButton label="uitloggen" onClick={this.handleSignOut} primary={true}/>
          </p>
        </header>
    );
  }
}

export default withRouter(Header);