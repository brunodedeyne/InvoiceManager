// Import Default Components
import React from 'react';
//import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

// Import Icons
import { Close as CloseIcon } from '@material-ui/icons';

// Import Material UI Components
import {
    Snackbar,
    IconButton,
    Paper,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    Button,
} from '@material-ui/core';

import {
    TextField,
} from 'material-ui';

// Import Database
import * as firebase from 'firebase';

// Import CSS
import './MyAccount.css';

class MyAccount extends React.Component {
    constructor(props) {
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

    componentDidMount() {
        var user = firebase.auth().currentUser;
        var tempEmail = '';
        if (user != null) {
            user.providerData.forEach(function (profile) {
                tempEmail = profile.email;
            });
            this.setState({ email: tempEmail, user });
        }
    }

    handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ openSnackbar: false });
    };

    updateEmailInput = (e) => {
        if (e.target.value.length <= 0) this.setState({ errorTextEmail: "Email mag niet leeg zijn!" });
        else this.setState({ errorTextEmail: "", updatedEmail: e.target.value });
    }

    updatePasswordInput = (e) => {
        if (e.target.value.length <= 0) this.setState({ errorTextPassword: "Wachtwoord mag niet leeg zijn!" });
        else this.setState({ errorTextPassword: "", updatedPassword: e.target.value });
    }

    updatePasswordConfirmationInput = (e) => {
        if (e.target.value.length <= 0) this.setState({ errorTextPasswordConfirmation: "Wachtwoord bevestiging mag niet leeg zijn!" });
        else this.setState({ errorTextPasswordConfirmation: "", updatedPasswordConfirmation: e.target.value });
    }

    async setNewEmail() {
        if (this.state.updatedEmail.length == 0) this.setState({ errorTextEmail: "Email mag niet leeg zijn!" });
        else {
            let errorCode;
            let tempEmailErrorText;
            //let tempSnapckbar;
            await this.state.user.updateEmail(this.state.updatedEmail).then(function () { }).catch(function (error) {
                errorCode = error.code;
            });

            if (errorCode) {
                if (errorCode === "auth/invalid-email") tempEmailErrorText = "Ongeldig Emailadres!";
                if (errorCode === "auth/requires-recent-login") tempEmailErrorText = "Gelieve opnieuw in te loggen!";
                this.setState({
                    errorTextEmail: tempEmailErrorText,
                })
            }
            else {
                this.setState({
                    snackBarContent: "Emailadres aangepast naar " + this.state.updatedEmail,
                    openEditEmail: false,
                    openSnackbar: true
                });
            }
            var user = firebase.auth().currentUser;

            user.sendEmailVerification().then(function () {

            }).catch(function (error) {
            });
        }
    }

    async setNewPassword() {
        if (this.state.updatedPassword.length == 0) this.setState({ errorTextPassword: "Wachtwoord mag niet leeg zijn!", errorTextPasswordConfirmation: "Wachtwoord bevestiging mag niet leeg zijn!" });
        else if (this.state.updatedPasswordConfirmation.length == 0) this.setState({ errorTextPasswordConfirmation: "Wachtwoord bevestiging mag niet leeg zijn!" });
        else if (this.state.updatedPassword != this.state.updatedPasswordConfirmation) this.setState({ errorTextPasswordConfirmation: "Wachtwoorden zijn niet gelijk!" });
        else {
            let errorCode;
            let tempPasswordErrorText;
            let tempPasswordConfirmationErrorText;
            //let tempSnapckbar;
            await this.state.user.updatePassword(this.state.updatedPassword).then(function () { }).catch(function (error) {
                errorCode = error.code;
            });

            if (errorCode) {
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

    render() {
        return (
            <div>
                <div className="container paddingClass">
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <Paper className="unPaid paddingClass shadowClass">Email: <strong>{this.state.email}</strong></Paper>
                            <div className="unPaid">
                                <Button onClick={() => this.setState({ openEditEmail: true })} color="primary">Email Wijzigen</Button>
                                <Button onClick={() => this.setState({ openEditPassword: true })} color="primary">Wachtwoord Wijzigen</Button>
                            </div>
                        </Grid>
                    </Grid>
                </div>
                <Dialog
                    modal={false}
                    open={this.state.openEditEmail}
                    onRequestClose={() => this.setState({ openEditEmail: false })}
                >
                    <DialogContent>
                        <form className="form__ContainerEditEmail">
                            <TextField
                                name="newEmail"
                                floatingLabelText="Nieuw Emailadres *"
                                className="form__TextFieldEditEmail"
                                onChange={this.updateEmailInput}
                                errorText={this.state.errorTextEmail}
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="primary"
                            onClick={this.setNewEmail}
                        >Email Wijzigen</Button>
                        <Button
                            color="secondary"
                            keyboardFocused={true}
                            onClick={() => this.setState({ openEditEmail: false })}
                        >Annuleer</Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    modal={false}
                    open={this.state.openEditPassword}
                    onRequestClose={() => this.setState({ openEditPassword: false })}
                >
                    <DialogContent>
                        <form className="form__ContainerNewInvoice">
                            <TextField
                                name="newPassword"
                                floatingLabelText="Wachtwoord *"
                                className="form__TextFieldEditEmail"
                                onChange={this.updatePasswordInput}
                                errorText={this.state.errorTextPassword}
                                type="password"
                            />
                            <TextField
                                name="newPasswordConfirmation"
                                floatingLabelText="Wachtwoord Bevestiging *"
                                className="form__TextFieldEditEmail"
                                onChange={this.updatePasswordConfirmationInput}
                                errorText={this.state.errorTextPasswordConfirmation}
                                type="password"
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="priamary"
                            onClick={this.setNewPassword}
                        >Wachtwoord Wijzigen</Button>
                        <Button
                            color="secondary"
                            keyboardFocused={true}
                            onClick={() => this.setState({ openEditPassword: false })}
                        >Annuleer</Button>
                    </DialogActions>
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