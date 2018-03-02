import React, { Component } from 'react';

import Logo from './Logo';

//Import CSS
import './Header.css';

class Header extends Component {
  render() {
    return (
        <header className="header">
          <Logo text="Dedeyne - Coomans"/>
          <p className="header__Title">Overzicht</p>
          {this.props.authenticated
            ? <p className="header__Logout"><a href="/Logout" className="header__Logout-Link">Uitloggen (Dedeyne - Coomans)</a></p>
            : <p className="header__Logout"><a href="/Login" className="header__Logout-Link">Inloggen</a></p>
          }
        </header>
    );
  }
}

export default Header;