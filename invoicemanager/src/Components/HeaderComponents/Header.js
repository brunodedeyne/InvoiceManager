import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as routes from '../../constants/routes/routes';
import Logout from '../LogOutComponents/Logout';
import AuthUserContext from '../AuthUserContext';

import Logo from './Logo';

//Import CSS
import './Header.css';
import { auth } from '../../Firebase';

class Header extends Component {
  constructor (props){
    super(props);
  }
  render() {
    return (
      //<AuthUserContext.Consumer>
        <header className="header">
          <Logo text="Dedeyne - Coomans"/>
          <p className="header__Title">{this.props.headerTitle}</p>
          <p className="header__Logout">
            <Logout className="header__Logout-Link"/>
          </p>
        </header>
      //</AuthUserContext.Consumer>
    );
  }
}

export default Header;