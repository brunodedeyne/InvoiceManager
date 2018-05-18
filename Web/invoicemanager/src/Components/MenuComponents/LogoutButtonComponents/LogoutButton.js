import React, { Component } from 'react';

//Import CSS
import './LogoutButton.css';

class LogoutButton extends Component {
  render() {
    return (
        <button className="logoutBtn">
            <p>Uitloggen</p>
        </button>
    );
  }
}

export default LogoutButton;