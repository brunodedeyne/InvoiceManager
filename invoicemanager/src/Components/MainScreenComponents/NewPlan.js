import React, { Component } from 'react';
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";

//Import CSS
import './NewPlan.css';

export default class NewPlan extends React.Component {
    render() {
      return (
        <form className="form">
            <TextField
                name="Naam"
                floatingLabelText="Naam"
                className="form__TextField"
            /><br />
            <TextField
                name="Voornaam"
                floatingLabelText="Voornaam"
                className="form__TextField"
            /><br />
            <TextField
                name="Straat"
                floatingLabelText="Straat"
                className="form__TextField"
            /><br />
            <TextField
                name="Gemeente"
                floatingLabelText="Gemeente"
                className="form__TextField"
            /><br />
            <TextField
                name="Telefoon"
                floatingLabelText="Telefoon"
                className="form__TextField"
            /><br />
            <TextField
                name="Email"
                floatingLabelText="Email"
                className="form__TextField"
            /><br />
            <TextField
                name="BTWNummer"
                floatingLabelText="BTW Numer"
                className="form__TextField"
            /><br />
            <TextField
                name="Rijksregisternummer"
                floatingLabelText="Rijksregisternummer"
                className="form__TextField"
            /><br />
            <TextField
                name="Ligging"
                floatingLabelText="Ligging"
                className="form__TextField"
            /><br />
            <TextField
                name="Bouwplaats"
                floatingLabelText="Bouwplaats"
                className="form__TextField"
            /><br />
            <TextField
                name="Aard"
                floatingLabelText="Aard"
                className="form__TextField"
            /><br /><br />
          <RaisedButton onSubmit={(event) => this.auth(event) } ref={(form) => {this.loginForm = form}} label="Nieuw Plan" href="/Login" primary />
        </form>
      );
    }
  }