import React, { Component } from 'react';

//Import CSS
import './AddButton.css';

class AddButton extends Component {
  render() {
    return (
        <button className="addBtn">
            {this.props.buttontext}
            
        </button>
        
    );
  }
}

export default AddButton;