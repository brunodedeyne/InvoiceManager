import React, { Component } from 'react';
import Header from './Components/HeaderComponent/Header';
import Menu from './Components/MenuComponent/Menu';


//Import CSS
import './assets/css/styles.min.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Menu />
      </div>
    );
  }
}

export default App;