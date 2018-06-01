import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from "material-ui/TextField";
import FlatButton from 'material-ui/FlatButton';
import PasswordIcon from '@material-ui/icons/Lock';
import MailIcon from '@material-ui/icons/Email';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import * as firebase from 'firebase';
// import {withRouter} from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as routes from '../../constants/routes/routes';
import Dialog from 'material-ui/Dialog';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import logoImg from '../../assets/img/logo_white.png'
import logo2Img from '../../assets/img/logo2.png'
import './Login.css';

class Login extends Component {   
    constructor (props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            emailErrorText: '',
            passwordErrorText: '',
            resetEmailErrorText: '',
            resetEmail: '',
            openSnackbar: false
        };
        this.handleSignIn = this.handleSignIn.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
    }
    updateEmail = (e) =>{ 
        this.setState({email: e.target.value});
    }

    updatePassword = (e) =>{ 
        this.setState({password: e.target.value});
    }

    updateResetEmail = (e) =>{         
        if (e.target.value.length <= 0) this.setState({resetEmailErrorText: "Email mag niet leeg zijn!"});
        else this.setState({resetEmailErrorText: "", resetEmail: e.target.value});
    }

    handleOpenSnackbar = () => {
        this.setState({ openSnackbar: true });
    };
    
    handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }    
        this.setState({ openSnackbar: false });
    };

    async handleSignIn () {
        let errorCode;
        let tempEmailErrorText;
        let tempPasswordErrorText;
        await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
            errorCode = error.code;
        });
        
        if (errorCode === "auth/invalid-email") tempEmailErrorText = "Controleer Email!";
        if (errorCode === "auth/user-not-found") tempEmailErrorText = "Geen geldige gebruiker!";
        if (errorCode === "auth/wrong-password") tempPasswordErrorText = "Controleer Wachtwoord!";;
        this.setState({
            emailErrorText: tempEmailErrorText,
            passwordErrorText: tempPasswordErrorText
        })
    }

    async resetPassword () {
        if (this.state.resetEmail.length == 0) this.setState({resetEmailErrorText: "Email mag niet leeg zijn!"});
        else {
            var auth = firebase.auth();
            let errorCode;
            let tempResetEmailErrorText;
            await auth.sendPasswordResetEmail(this.state.resetEmail).then(function() {
                console.log("verzodnen");
            }).catch(function(error) {
                console.log(error.code);
                errorCode = error.code;
            });
    
            if (errorCode) {
                if (errorCode === "auth/invalid-email") tempResetEmailErrorText = "Ongeldig Emailadres!";
                if (errorCode === "auth/user-not-found") tempResetEmailErrorText = "Ongeldige Gebruiker!";
                this.setState({
                    resetEmailErrorText: tempResetEmailErrorText,
                })
            }
            else {
                this.setState({
                    snackBarContent: "Reset email verzonden naar " + this.state.resetEmail,
                    openResetEmail: false,
                    openSnackbar: true
                });
            }
        }
    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          this.handleSignIn();
        }
    }

    handleOpenResetEmail = () => {
        this.setState({openResetEmail: true});
    };

    handleCloseResetEmail = () => {
        this.setState({openResetEmail: false});
    };
    
    render () {
        const actionsResetEmail = [
            <FlatButton
                label="Wachtwoord Resetten"
                primary={true}
                onClick={this.resetPassword}

            />,
            <FlatButton
                label="Annuleer"
                secondary={true}
                keyboardFocused={true}
                onClick={this.handleCloseResetEmail}
          />,
        ];
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
                        <div className="section__TextfieldsLogin">
                            <div className="divTextFieldLogin">
                                <MailIcon className="mailIcon" />
                                <TextField
                                    name="email"
                                    floatingLabelText="Email"
                                    onChange={this.updateEmail}
                                    errorText={this.state.emailErrorText}
                                    onKeyPress={this._handleKeyPress}
                                    inputStyle={{color: "white"}}
                                    className="textFieldLogin"
                                    autoComplete="off"
                                /><br/>
                            </div>
                            <div className="divTextFieldLogin">
                                <PasswordIcon  className="passwordIcon" />
                                <TextField
                                    name="password"
                                    floatingLabelText="Wachtwoord"
                                    type="password"
                                    onChange={this.updatePassword}
                                    errorText={this.state.passwordErrorText}
                                    onKeyPress={this._handleKeyPress}
                                    inputStyle={{color: "white"}}
                                    className="textFieldLogin"
                                /><br/><br/>
                            </div>
                            <RaisedButton 
                                onClick={this.handleSignIn}  
                                disabled={!enabledLoginButton} 
                                className="loginButton" 
                            >    
                                Inloggen 
                            </RaisedButton>
                            <footer>
                                <p>
                                    <FlatButton className="flatButton" onClick={this.handleOpenResetEmail} label="Wachtwoord Vergeten?" primary={true} />
                                </p>
                            </footer><br/>
                        </div>
                    </CardContent>
                </Card>
                <Dialog
                    actions={actionsResetEmail}
                    modal={false}
                    open={this.state.openResetEmail}
                    onRequestClose={this.handleCloseResetEmail}
                >
                    <form className="form__ContainerEditEmail">
                        <TextField
                            name="email"
                            floatingLabelText="Emailadres *"
                            className="form__TextFieldEditEmail"
                            onChange={this.updateResetEmail}
                            errorText={this.state.resetEmailErrorText}
                        />
                    </form>
                </Dialog>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    open={this.state.openSnackbar}
                    autoHideDuration={5000}
                    onClose={this.handleCloseSnackBar}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.state.snackBarContent}</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={this.handleCloseSnackBar}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />
            </section>
        );
    }
}

export default Login;