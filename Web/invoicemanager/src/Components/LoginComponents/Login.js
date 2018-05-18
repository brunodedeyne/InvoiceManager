import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from "material-ui/TextField";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import * as firebase from 'firebase';
import {withRouter} from 'react-router-dom';

import logoImg from '../../assets/img/logo2.png'
import './Login.css';

class Login extends Component {   
    constructor (props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            emailErrorText: '',
            passwordErrorText: ''
        };
    }
    updateEmail = (e) =>{ 
        this.setState({email: e.target.value});
    }

    updatePassword = (e) =>{ 
        this.setState({password: e.target.value});
    }

    handleSignIn = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === "auth/invalid-email") this.setState({emailErrorText: "Controleer Emailadres!"});
            if (errorCode === "auth/wrong-password") this.setState({emailErrorText: "Controleer Wachtwoord!"});
            console.log(errorCode);
            console.log(errorMessage);
        });
        var user = firebase.auth().currentUser;
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
                            /><br/>
                            <TextField
                                name="password"
                                floatingLabelText="Wachtwoord"
                                type="password"
                                onChange={this.updatePassword}
                                errorText={this.state.passwordErrorText}
                            /><br/><br/>
                            <RaisedButton 
                                onClick={this.handleSignIn}  
                                disabled={!enabledLoginButton}  
                            >    
                                Inloggen 
                            </RaisedButton>
                        </div>
                    </CardContent>
                </Card>
            </section>
        );
    }
}

export default Login;