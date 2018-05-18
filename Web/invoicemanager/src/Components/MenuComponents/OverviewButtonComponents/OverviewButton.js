import React, { Component } from 'react';

//Import CSS
import './OverviewButton.css';

class OverviewButton extends Component {
  render() {
    return (
        <button className="overviewBtn">
            {this.props.buttontext}
        </button>
    );
  }
}

export default OverviewButton;