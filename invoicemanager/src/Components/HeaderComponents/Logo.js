import React, { Component } from 'react';

//Import CSS
import './Logo.css';

class Logo extends Component {
  render() {
    return (
        <section className="section__Logo">
            <p>Architectenbureau</p>
            <p className="section__Logo-Naam">{this.props.text}</p>
        </section>
    );
  }
}

export default Logo;