import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import * as routes from '../../constants/routes/routes';
import * as firebase from 'firebase';
import {withRouter} from 'react-router-dom';

import Logo from './Logo';
import './Header.css';

class Header extends Component {
  constructor (props){
    super(props);
    this.state = {
      profileUid: 'Default',
    };
  }

  handleSignOut = () => {
    firebase.auth().signOut().then(function() {
      console.log("uitloggen")
      this.props.history.push('/Login');
    }).catch(function(error) {
      console.log(error);
    });
  }

  componentDidMount = () => {
    var user = firebase.auth().currentUser;

    if (user != null) {
      user.providerData.forEach(function (profile) {      
       console.log(profile.uid);
      });
    }
  }

  render() {
    return (
        <header className="header">
          <Logo text={this.state.profileUid}/>
          <p className="header__Title">
            {this.props.headerTitle}
          </p>
          <p className="header__Logout">
            <FlatButton label="uitloggen" onClick={this.handleSignOut} primary={true}/>
          </p>
        </header>
    );
  }
}

export default withRouter(Header);