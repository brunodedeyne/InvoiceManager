import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { auth } from '../../../Firebase';
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Main from "../../Main";
import Home from '../../Home';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import * as routes from '../../../constants/routes/routes';

//Import CSS
import './LoginForm.css';

class LoginForm extends React.Component { 
  constructor(props) {
    super();    
    this.state =  {
      email: '',
      password: '',
      error: ''
    }
  }
  render() {
      const isInvalid =
        this.state.password === '' ||
        this.state.email === '';

      return (
          <form onSubmit={this.onSubmit}>
              <TextField
                value={this.state.email}
                //onChange={event => this.setState(byPropKey('email', event.target.value))}
                name="email"
                floatingLabelText="Email"
              /><br />
              <TextField
                value={this.state.password}
                //onChange={event => this.setState(byPropKey('password', event.target.value))}
                name="password"
                floatingLabelText="Wachtwoord"
                type="password"
              /><br /><br />       
              <RaisedButton primary disabled={isInvalid} type="submit">    
                Inloggen 
               {/* <Link to={routes.HOME}>Inloggen</Link> */}
              </RaisedButton>
              <br /><br />
              { this.state.error && <p>{this.state.error.message}</p> }
          </form>
      );
    }
  }

//export default withRouter(/*SignInPage*/);

/*export {
  LoginForm,
};*/
export default LoginForm;