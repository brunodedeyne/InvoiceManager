
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import Header from '../../HeaderComponents/Header';
import Menu from '../../MenuComponents/Menu';
import * as firebase from 'firebase';  
import {withRouter} from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import TextField from "material-ui/TextField";
import Dialog from 'material-ui/Dialog';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
//Import CSS
import './MyAccount.css';

class MyAccount extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            email: '',
            updatedEmail: '',
            updatedPassword: '',
            updatedPasswordConfirmation: '',
            openSnackbar: false,
            openEditEmail: false,
            openEditPassword: false,
            errorTextEmail: '',
            errorCode: '',
            user: ''
        };

        this.setNewEmail = this.setNewEmail.bind(this);
        this.setNewPassword = this.setNewPassword.bind(this);
    }

    componentDidMount () {
        var user = firebase.auth().currentUser;
        var tempEmail = '';
        if (user != null) {
            user.providerData.forEach(function (profile) {
               tempEmail = profile.email;
            });
            this.setState({email: tempEmail, user});
        }
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

    handleOpenEditEmail = () => {
        this.setState({openEditEmail: true});
    };

    handleCloseEditEmail = () => {
        this.setState({openEditEmail: false});
    };

    handleOpenEditPassword = () => {
        this.setState({openEditPassword: true});
    };

    handleCloseEditPassword = () => {
        this.setState({openEditPassword: false});
    };

    updateEmailInput = (e) =>{         
        if (e.target.value.length <= 0) this.setState({errorTextEmail: "Email mag niet leeg zijn!"});
        else this.setState({errorTextEmail: "", updatedEmail: e.target.value});
    }

    updatePasswordInput = (e) =>{         
        if (e.target.value.length <= 0) this.setState({errorTextPassword: "Wachtwoord mag niet leeg zijn!"});
        else this.setState({errorTextPassword: "", updatedPassword: e.target.value});
    }

    updatePasswordConfirmationInput = (e) =>{         
        if (e.target.value.length <= 0) this.setState({errorTextPasswordConfirmation: "Wachtwoord bevestiging mag niet leeg zijn!"});
        else this.setState({errorTextPasswordConfirmation: "", updatedPasswordConfirmation: e.target.value});
    }

    async setNewEmail () {
        if (this.state.updatedEmail.length == 0) this.setState({errorTextEmail: "Email mag niet leeg zijn!"});
        else {
            let errorCode;
            let tempEmailErrorText;
            let tempSnapckbar;
            await this.state.user.updateEmail(this.state.updatedEmail).then(function() {}).catch(function(error) {
                errorCode = error.code;
            });

            if (errorCode) {
                if (errorCode === "auth/invalid-email") tempEmailErrorText = "Ongeldig Emailadres!";
                if (errorCode === "auth/requires-recent-login") tempEmailErrorText = "Gelieve opnieuw in te loggen!";
                this.setState({
                    errorTextEmail: tempEmailErrorText,
                })}
            else {
                this.setState({
                    snackBarContent: "Emailadres aangepast naar " + this.state.updatedEmail,
                    openEditEmail: false,
                    openSnackbar: true
                });
            }
            var user = firebase.auth().currentUser;

            user.sendEmailVerification().then(function() {

            }).catch(function(error) {
                console.log(error.code);
            });
        }
    }

    async setNewPassword () {
        if (this.state.updatedPassword.length == 0) this.setState({errorTextPassword: "Wachtwoord mag niet leeg zijn!", errorTextPasswordConfirmation: "Wachtwoord bevestiging mag niet leeg zijn!"});
        else if (this.state.updatedPasswordConfirmation.length == 0) this.setState({errorTextPasswordConfirmation: "Wachtwoord bevestiging mag niet leeg zijn!"});
        else if (this.state.updatedPassword != this.state.updatedPasswordConfirmation) this.setState({errorTextPasswordConfirmation: "Wachtwoorden zijn niet gelijk!"});
        else {
            let errorCode;
            let tempPasswordErrorText;
            let tempPasswordConfirmationErrorText;
            let tempSnapckbar;
            await this.state.user.updatePassword(this.state.updatedPassword).then(function() {}).catch(function(error) {
                errorCode = error.code;
            });              

            if (errorCode) {
                console.log(errorCode);
                if (errorCode === "auth/weak-password") tempPasswordErrorText = "Zwak Wachtwoord, probeer opnieuw!";
                if (errorCode === "auth/requires-recent-login") tempPasswordErrorText = "Gelieve opnieuw in te loggen!";
                this.setState({
                    errorTextPassword: tempPasswordErrorText,
                    errorTextPasswordConfirmation: tempPasswordConfirmationErrorText
                });
            }
            else {
                this.setState({
                    snackBarContent: "Wachtwoord Aangepast!",
                    openEditPassword: false,
                    openSnackbar: true
                });
            }
        }
    }

    render () {
        const actionsEditEmail = [
            <FlatButton
                label="Email Wijzigen"
                primary={true}
                onClick={this.setNewEmail}

            />,
            <FlatButton
                label="Annuleer"
                secondary={true}
                keyboardFocused={true}
                onClick={this.handleCloseEditEmail}
          />,
        ];
        const actionsEditPassword = [
            <FlatButton
                label="Wachtwoord Wijzigen"
                primary={true}
                onClick={this.setNewPassword}
            />,
            <FlatButton
                label="Annuleer"
                secondary={true}
                keyboardFocused={true}
                onClick={this.handleCloseEditPassword}
          />,
        ];
        return  (
            <div>
                <div className="container paddingClass">
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <Paper className="unPaid paddingClass shadowClass">Email: <strong>{this.state.email}</strong></Paper>                
                            <div className="unPaid">
                                <FlatButton onClick={this.handleOpenEditEmail} label="Email Wijzigen" primary={true} />
                                <FlatButton onClick={this.handleOpenEditPassword} label="Wachtwoord Wijzigen" primary={true} />
                            </div>
                        </Grid>
                    </Grid>
                </div>
                <Dialog
                    actions={actionsEditEmail}
                    modal={false}
                    open={this.state.openEditEmail}
                    onRequestClose={this.handleCloseEditEmail}
                >
                    <form className="form__ContainerEditEmail">
                        <TextField
                            name="newEmail"
                            floatingLabelText="Nieuw Emailadres *"
                            className="form__TextFieldEditEmail"
                            onChange={this.updateEmailInput}
                            errorText={this.state.errorTextEmail}
                        />
                    </form>
                </Dialog>
                <Dialog
                    actions={actionsEditPassword}
                    modal={false}
                    open={this.state.openEditPassword}
                    onRequestClose={this.handleCloseEditPassword}
                >
                    <form className="form__ContainerNewInvoice">
                        <TextField
                            name="newPassword"
                            floatingLabelText="Wachtwoord *"
                            className="form__TextField"
                            onChange={this.updatePasswordInput}
                            errorText={this.state.errorTextPassword}
                            type="password"
                        />
                        <TextField
                            name="newPasswordConfirmation"
                            floatingLabelText="Wachtwoord Bevestiging *"
                            className="form__TextField"
                            onChange={this.updatePasswordConfirmationInput}
                            errorText={this.state.errorTextPasswordConfirmation}
                            type="password"
                        />
                    </form>
                </Dialog>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    open={this.state.openSnackbar}
                    autoHideDuration={6000}
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
            </div>
        )
    }
}

export default withRouter(MyAccount)