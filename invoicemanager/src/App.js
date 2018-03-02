import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Login from './Components/LoginComponents/Login';
import Main from './Components/Main';

//Import CSS
import './assets/css/styles.min.css';
import './App.css';

injectTapEventPlugin();

class App extends Component {
  state = {
    fields: {}
  };

  onChange = updatedValue => {
    this.setState({
      fields: {
        ...this.state.fields,
        ...updatedValue
      }
    });
  };

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <Main />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;