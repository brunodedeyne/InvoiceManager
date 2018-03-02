import React, { Component } from 'react';
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Main from "../../Main";

//Import CSS
import './LoginForm.css';

export default class LoginForm extends React.Component {
    constructor (props){
      super()
      this.auth = this.auth.bind(this)
      this.state = {
        email: "",
        password: ""
      }; 
    }   

    auth (event){
      console.log(this.email.value)
      event.preventDefault()
    }
  
    change = e => {
      this.props.onChange({ [e.target.name]: e.target.value });
      this.setState({
        [e.target.name]: e.target.value
      });
    };
  
    onSubmit = e => {
      /*e.preventDefault();
      //this.props.onSubmit(this.state);
      this.setState({
        email: "",
        password: ""
      });
      this.props.onChange({
        email: "",
        password: ""
      });*/
    };
  
    render() {
      return (
        <form>
            <TextField
                name="email"
                floatingLabelText="Email"
            /><br />
            <TextField
                name="password"
                floatingLabelText="Wachtwoord"
                type="password"
            /><br /><br />
          <RaisedButton onSubmit={(event) => this.auth(event) } ref={(form) => {this.loginForm = form}} label="Inloggen" href="/Login" primary />
        </form>
      );
    }
  }