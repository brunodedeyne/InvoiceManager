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

const SignInPage = ({ history }) =>
  <div>
    <LoginForm history={history} />
  </div>

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class LoginForm extends React.Component { 
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        history.push(routes.HOME);
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }
    render() {
      const {
        email,
        password,
        error,
      } = this.state;
  
      const isInvalid =
        password === '' ||
        email === '';

      return (
          <form onSubmit={this.onSubmit}>
              <TextField
                value={email}
                onChange={event => this.setState(byPropKey('email', event.target.value))}
                name="email"
                floatingLabelText="Email"
              /><br />
              <TextField
                value={password}
                onChange={event => this.setState(byPropKey('password', event.target.value))}
                name="password"
                floatingLabelText="Wachtwoord"
                type="password"
              /><br /><br />       
              <RaisedButton primary disabled={isInvalid} type="submit">    
                Inloggen 
               {/* <Link to={routes.HOME}>Inloggen</Link> */}
              </RaisedButton>
              <br /><br />
              { error && <p>{error.message}</p> }
          </form>
      );
    }
  }

export default withRouter(SignInPage);

export {
  LoginForm,
};