// Import Default Components
import React, { Component } from 'react';

// Import Icons
import {
    Lock as PasswordIcon,
    Email as MailIcon,
    Close as CloseIcon
} from '@material-ui/icons/';

// Import Material UI Components
import {
    RaisedButton,
    TextField,
    FlatButton,
    Dialog,
    IconButton
} from 'material-ui';
import Snackbar from '@material-ui/core/Snackbar';

// Import Database
import * as firebase from 'firebase';

// Import CSS
import logoImg from '../../assets/img/logo_white.png'
import './Login.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            emailErrorText: '',
            passwordErrorText: '',
            resetEmailErrorText: '',
            resetEmail: '',
            openSnackbar: false,
            openResetEmail: false
        };
        this.handleSignIn = this.handleSignIn.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
    }

    updateEmail = (e) => {
        this.setState({ email: e.target.value });
    }

    updatePassword = (e) => {
        this.setState({ password: e.target.value });
    }

    updateResetEmail = (e) => {
        if (e.target.value.length <= 0) this.setState({ resetEmailErrorText: "Email mag niet leeg zijn!" });
        else this.setState({ resetEmailErrorText: "", resetEmail: e.target.value });
    }

    handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ openSnackbar: false });
    };

    async handleSignIn() {
        let errorCode;
        let tempEmailErrorText;
        let tempPasswordErrorText;
        await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function (error) {
            errorCode = error.code;
        });

        if (errorCode === "auth/invalid-email") tempEmailErrorText = "Controleer Email!";
        if (errorCode === "auth/user-not-found") tempEmailErrorText = "Geen geldige gebruiker!";
        if (errorCode === "auth/wrong-password") tempPasswordErrorText = "Controleer Wachtwoord!";
        this.setState({
            emailErrorText: tempEmailErrorText,
            passwordErrorText: tempPasswordErrorText
        })
    }

    async resetPassword() {
        if (this.state.resetEmail.length == 0) this.setState({ resetEmailErrorText: "Email mag niet leeg zijn!" });
        else {
            var auth = firebase.auth();
            let errorCode;
            let tempResetEmailErrorText;
            await auth.sendPasswordResetEmail(this.state.resetEmail).then(function () {
            }).catch(function (error) {
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
                    snackBarContent: "Reset email verzonden!",
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

    render() {
        const actionsResetEmail = [
            <FlatButton
                label="Wachtwoord Resetten"
                primary={true}
                onClick={this.resetPassword}
            />,
            <FlatButton
                label="Annuleer"
                secondary={true}
                onClick={() =>  this.setState({ openResetEmail: false })}
            />,
        ];
        const { email, password } = this.state;
        const enabledLoginButton =
            email.length > 0 &&
            password.length > 0;
        return (
            <section className="section__Container">
                <div className="div__logoContainer">
                    <img src={logoImg} alt="logo" className="div__logoImg" />
                </div>
                <div className="div__textfieldsContainer">
                    <div className="divTextFieldLogin">
                        <MailIcon className={"mailIcon " + (this.state.emailErrorText ? " mailIconErrorUp" : "")}/>
                        <TextField
                            name="email"
                            floatingLabelText="Email"
                            onChange={this.updateEmail}
                            errorText={this.state.emailErrorText}
                            onKeyPress={this._handleKeyPress}
                            inputStyle={{ color: "white" }}
                            className="textFieldLogin"
                            autoComplete="off"
                        /><br />
                    </div>
                    <div className="divTextFieldLogin">
                        <PasswordIcon className={"passwordIcon " + (this.state.passwordErrorText ? " passwordIconErrorUp" : "")} />
                        <TextField
                            name="password"
                            floatingLabelText="Wachtwoord"
                            type="password"
                            onChange={this.updatePassword}
                            errorText={this.state.passwordErrorText}
                            onKeyPress={this._handleKeyPress}
                            inputStyle={{ color: "white" }}
                            className="textFieldLogin"
                        /><br /><br />
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
                            <FlatButton onClick={() => this.setState({ openResetEmail: true })} label="Wachtwoord Vergeten?" primary={true} />
                        </p>
                    </footer><br />
                </div>
                <Dialog
                    actions={actionsResetEmail}
                    modal={false}
                    open={this.state.openResetEmail}
                    onRequestClose={() => this.setState({openResetEmail: false})}
                >
                    <form>
                        <TextField
                            name="email"
                            floatingLabelText="Emailadres *"
                            className="form__TextFieldEditEmail"
                            onChange={this.updateResetEmail}
                            errorText={this.state.resetEmailErrorText}
                            autoComplete="off"
                        />
                    </form>
                </Dialog>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.openSnackbar}
                    autoHideDuration={2000}
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