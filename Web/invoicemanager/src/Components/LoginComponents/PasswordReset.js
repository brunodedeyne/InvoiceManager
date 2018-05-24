import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from "material-ui/TextField";
import FlatButton from 'material-ui/FlatButton';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import * as firebase from 'firebase';
// import {withRouter} from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as routes from '../../constants/routes/routes';

import logoImg from '../../assets/img/logo2.png'
import './PasswordReset.css';

class PasswordReset extends Component {   
    constructor (props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            emailErrorText: '',
            passwordErrorText: ''
        };
    }

    updatePassword = (e) =>{ 
        this.setState({password: e.target.value});
    }

    resetPassword () {
        var auth = firebase.auth();
        var emailAddress = "user@example.com";

        auth.sendPasswordResetEmail(emailAddress).then(function() {
        // Email sent.
        }).catch(function(error) {
        // An error happened.
        });
    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          this.handleSignIn();
        }
      }
    
    render () {
        const { email, password } = this.state;
        const enabledLoginButton =
            email.length > 0 &&
            password.length > 0;
        return (        

                <section className="section__Container">
                    <Card>
                        <CardContent>            
                            <div className="section__Box">
                                <img src={logoImg} alt="logo" className="section__Img" />              
                            </div>
                            <div className="section__Textfields">
                                <TextField
                                    name="email"
                                    floatingLabelText="Email"
                                    onChange={this.updateEmail}
                                    errorText={this.state.emailErrorText}
                                    onKeyPress={this._handleKeyPress}
                                /><br/><br/>
                                <RaisedButton 
                                    onClick={this.handleSignIn}  
                                    disabled={!enabledLoginButton}  
                                >    
                                    Reset 
                                </RaisedButton>
                            </div>
                        </CardContent>
                    </Card>
                </section>
        );
    }
}

export default PasswordReset;