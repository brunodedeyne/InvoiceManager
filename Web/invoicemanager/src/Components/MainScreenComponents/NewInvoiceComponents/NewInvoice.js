// Import Default Components
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

// Import Icons
import {
    Info as AardIcon,
    Fingerprint as DossierIcon,
    Home as AddressIcon,
    Person as FullNameIcon,
    Home as BuildingAddressIcon,
    InsertDriveFile as BTWIcon,
    Dvr as RRNIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Close as CloseIcon
} from "@material-ui/icons";

// Import Material UI Components
import {
    List,
    ListItem,
    ListItemText,
    DialogTitle,
    IconButton,
    Snackbar,
    Dialog,
    DialogContent,
    DialogActions,
    Button
} from '@material-ui/core';
import {
    MenuItem,
    DropDownMenu,
    TextField
} from "material-ui";
import AutoComplete from 'material-ui/AutoComplete';

// Import Database
import * as firebase from 'firebase';

// Import CSS
import './NewInvoice.css';

const dataSourceConfig = {
    text: 'familyName',
    value: 'familyName',
};

class NewInvoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            plannen: [],
            value: "Default",
            nameDummy: 'John',
            name: '',

            familyNameDummy: 'Doe',
            familyName: '',

            streetDummy: '123 Main Street',
            street: '',

            cityDummy: 'Anytown',
            city: '',

            phoneDummy: '+32 498/123.456',
            phone: '',

            emailDummy: 'Johndoe@gmail.com',
            email: '',

            BTWDummy: 'BE 0999.999.999',
            BTW: '',

            RRNDummy: '97.11.21-275.45',
            RRN: '',

            buildingStreetDummy: '124 Main Street',
            buildingStreet: '',

            buildingCityDummy: "Anytown",
            buildingCity: '',

            aardDummy: 'verbouwing bestaande woning',
            aard: '',

            dossierNrDummy: '2017/256',
            dossierNr: '',

            feeDummy: '€1000',
            fee: '',

            aardInvoiceDummy: 'Voorontwerp Gebouw',
            aardInvoice: '',
            selectedDossierNr: '',

            key: '',

            openInvoice: false,
            openConfirmationDialogInvoices: false,
            enableNewInvoiceContactCard: true,
            openSuccessInvoice: false,
            enabled: false,
            openSnackbar: false,
            snackBarType: '',
            snackBarContent: '',
            userUid: '',
        };

        this.database = firebase.database().ref('/plannen');
    }

    handleChange = (event, index, value) => {
        for (var i = 0; i < this.state.plannen.length; i++) {
            if (this.state.plannen[i].key === value) {
                this.setState({
                    nameDummy: this.state.plannen[i].name,
                    name: this.state.plannen[i].name,

                    familyNameDummy: this.state.plannen[i].familyName,
                    familyName: this.state.plannen[i].familyName,

                    streetDummy: this.state.plannen[i].street,
                    street: this.state.plannen[i].street,

                    cityDummy: this.state.plannen[i].city,
                    city: this.state.plannen[i].city,

                    phoneDummy: this.state.plannen[i].phone,
                    phone: this.state.plannen[i].phone,

                    emailDummy: this.state.plannen[i].email,
                    email: this.state.plannen[i].email,

                    BTWDummy: this.state.plannen[i].BTW,
                    BTW: this.state.plannen[i].BTW,

                    RRNDummy: this.state.plannen[i].RRN,
                    RRN: this.state.plannen[i].RRN,

                    buildingStreetDummy: this.state.plannen[i].buildingStreet,
                    buildingStreet: this.state.plannen[i].buildingStreet,

                    buildingCityDummy: this.state.plannen[i].buildingCity,
                    buildingCity: this.state.plannen[i].buildingCity,

                    aardDummy: this.state.plannen[i].aard,
                    aard: this.state.plannen[i].aard,

                    dossierNrDummy: this.state.plannen[i].dossierNr,
                    dossierNr: this.state.plannen[i].dossierNr,
                    selectedDossierNr: this.state.plannen[i].dossierNr,

                    key: this.state.plannen[i].key,
                    value: value,
                    enableNewInvoiceContactCard: false,
                })
            }
        }
    }

    pushInvoice = (e) => {
        let now = new Date();
        let val = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

        e.preventDefault();
        let item = {
            fee: this.state.fee,
            aardInvoice: this.state.aardInvoice,
            planKey: this.state.key,
            dateCreated: val,
            datePaid: '',
            userUid: this.state.userUid,
        }
        firebase.database().ref('invoices').push(item);

        this.setState({
            openConfirmationDialogInvoices: false,
            openInvoice: false,
            openSnackbar: true,
            snackBarContent: "factuur voor " + this.state.name + " " + this.state.familyName + "   -  €" + this.state.fee + " Aangemaakt!"
        });
    }

    selectClient = (val) => {
        this.setState({
            nameDummy: val.name,
            name: val.name,

            familyNameDummy: val.familyName,
            familyName: val.familyName,

            streetDummy: val.street,
            street: val.street,

            cityDummy: val.city,
            city: val.city,

            phoneDummy: val.phone,
            phone: val.phone,

            emailDummy: val.email,
            email: val.email,

            BTWDummy: val.BTW,
            BTW: val.BTW,

            RRNDummy: val.RRN,
            RRN: val.RRN,

            buildingStreetDummy: val.buildingStreet,
            buildingStreet: val.buildingStreet,

            buildingCityDummy: val.buildingCity,
            buildingCity: val.buildingCity,

            aardDummy: val.aard,
            aard: val.aard,

            dossierNrDummy: val.dossierNr,
            dossierNr: val.dossierNr,
            selectedDossierNr: val.dossierNr,

            key: val.key,
            enableNewInvoiceContactCard: false,
        })
    };

    componentWillMount() {
        const allPlans = this.state.plannen;

        this.database.on('child_added', snapshot => {
            if (snapshot.val().userUid === this.state.userUid) {
                allPlans.push({
                    key: snapshot.key,
                    dossierNr: snapshot.val().dossierNr,
                    name: snapshot.val().name,
                    familyName: snapshot.val().familyName,
                    street: snapshot.val().street,
                    city: snapshot.val().city,
                    email: snapshot.val().email,
                    phone: snapshot.val().phone,
                    RRN: snapshot.val().RRN,
                    BTW: snapshot.val().BTW,
                    buildingStreet: snapshot.val().buildingStreet,
                    buildingCity: snapshot.val().buildingCity,
                    aard: snapshot.val().aard,
                })
                this.setState({ plannen: allPlans });
            }
        })
    }

    handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ openSnackbar: false });
    };

    componentDidMount() {
        this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
            if (user) this.setState({ userUid: user.uid });
            let items = [];
            this.database.on('value', (snapshot) => {
                items = Object.values(snapshot.val()).map((item, i) => {
                    if (user) {
                        if (item.userUid == user.uid) {
                            item.key = i;
                            return item;
                        }
                    }
                });
                items = items.filter(Boolean);
                this.setState({ plannen: items });
            });
        });

        // const input = document.getElementById('street');
        // const building = document.getElementById('buildingStreet');
        // const options = {
        //     componentRestrictions: { country: 'be' },
        //     types: ['address']
        // };
        // const geoAutocomplete = new window.google.maps.places.Autocomplete((input), options);

        // const geoAutocompleteBuilding = new window.google.maps.places.Autocomplete((building), options);

        // geoAutocomplete.addListener('place_changed', () => {
        //     const selectedPlace = geoAutocomplete.getPlace();
        //     const componentForm = {
        //         street_number: 'long_name',
        //         route: 'long_name',
        //         locality: 'long_name',
        //         administrative_area_level_1: 'short_name',
        //         country: 'long_name',
        //         postal_code: 'long_name'
        //     };
        //     // Get each component of the address from the place details
        //     // and fill the corresponding field on the form.
        //     let selectedSuggest = {};
        //     for (let addressComponent of selectedPlace.address_components) {
        //         const addressType = addressComponent.types[0];
        //         if (componentForm[addressType]) {
        //             selectedSuggest[addressType] = addressComponent[componentForm[addressType]]
        //         };
        //     };
        //     this.setState({ street: `${selectedSuggest.route} ${selectedSuggest.street_number}`, streetDummy: `${selectedSuggest.route} ${selectedSuggest.street_number}` });
        //     this.setState({ city: `${selectedSuggest.postal_code} ${selectedSuggest.locality}`, cityDummy: `${selectedSuggest.postal_code} ${selectedSuggest.locality}` });
        //     var newCity = this.state.city;
        //     input.value = this.state.street;
        //     this.setState({ cityDummy: newCity });
        // })

        // geoAutocompleteBuilding.addListener('place_changed', () => {
        //     const selectedPlace = geoAutocompleteBuilding.getPlace();
        //     const componentForm = {
        //         street_number: 'long_name',
        //         route: 'long_name',
        //         locality: 'long_name',
        //         administrative_area_level_1: 'short_name',
        //         country: 'long_name',
        //         postal_code: 'long_name'
        //     };
        //     // Get each component of the address from the place details
        //     // and fill the corresponding field on the form.
        //     let selectedSuggest = {};
        //     for (let addressComponent of selectedPlace.address_components) {
        //         const addressType = addressComponent.types[0];
        //         if (componentForm[addressType]) {
        //             selectedSuggest[addressType] = addressComponent[componentForm[addressType]]
        //         };
        //     };
        //     this.setState({ buildingStreet: `${selectedSuggest.route} ${selectedSuggest.street_number}`, buildingStreetDummy: `${selectedSuggest.route} ${selectedSuggest.street_number}` });
        //     this.setState({ buildingCity: `${selectedSuggest.postal_code} ${selectedSuggest.locality}`, buildingCityDummy: `${selectedSuggest.postal_code} ${selectedSuggest.locality}` });
        //     var newCityBuilding = this.state.buildingCity;
        //     building.value = this.state.buildingStreet;
        //     this.setState({ buildingCityDummy: newCityBuilding });
        // })
    }

    render() {
        const { name, familyName, street, city, email, RRN, phone, phoneValid, buildingStreet, buildingCity, aard, RRNValid, fee, aardInvoice } = this.state;

        const enabledNewInvoice =
            fee.length > 0 &&
            aardInvoice.length > 0;
        return (
            <div>
                <section className="form__Container">
                    <div className="labelDropDown">Kies Uw Cliënt: </div>
                    <div className="Dropdown">
                        <DropDownMenu
                            value={this.state.value}
                            onChange={this.handleChange}
                            autoWidth={false}
                        >
                            {
                                this.state.plannen.map((plan) => {
                                    return (
                                        <MenuItem key={plan.key} value={plan.key} primaryText={plan.dossierNr + ", " + plan.name + " " + plan.familyName} />
                                    )
                                })
                            }
                        </DropDownMenu>
                    </div>
                    <div className="labelSearchName">
                        <AutoComplete
                            floatingLabelText="Zoek op Familienaam"
                            dataSourceConfig={dataSourceConfig}
                            dataSource={this.state.plannen}
                            filter={AutoComplete.caseInsensitiveFilter}
                            className="form__TextFieldSearchName"
                            onNewRequest={this.selectClient}
                            ={this.state.familyName}
                        />
                    </div>
                    <div className="contactCardInvoice">
                        <List component="div" disablePadding>
                            <ListItem className="containerInfo" button>
                                <div className="info personalInfoInvoice">
                                    <FullNameIcon className="icon" /><p>{this.state.nameDummy + " " + this.state.familyNameDummy}</p><br />
                                    <AddressIcon className="icon addressIcon" /><p>{this.state.streetDummy}<br />{this.state.cityDummy}</p><br />
                                    <EmailIcon className="icon" /><p>{this.state.emailDummy}</p><br />
                                    <PhoneIcon className="icon" /><p>{this.state.phoneDummy}</p><br />
                                    <BTWIcon className="icon" /><p>{this.state.BTWDummy ? this.state.BTWDummy : "Geen BTW"}</p><br />
                                    <RRNIcon className="icon" /><p>{this.state.RRNDummy}</p><br />
                                </div>
                                <div className="info buildingInfo">
                                    <BuildingAddressIcon className="icon buildingAddressIcon" /><p>{this.state.buildingStreetDummy}<br />{this.state.buildingCityDummy}</p><br />
                                    <AardIcon className="icon" /><p>{this.state.aardDummy}</p><br />
                                </div>
                            </ListItem>
                            <div className="actionButtonsInvoice">
                                <Button
                                    color="primary"
                                    onClick={() => this.setState({ openInvoice: true })}
                                    disabled={this.state.enableNewInvoiceContactCard}
                                >Nieuwe Factuur</Button>
                            </div>
                        </List>
                    </div>
                    <Dialog
                        modal={false}
                        open={this.state.openInvoice}
                        onRequestClose={() => this.setState({ openInvoice: false })}
                        className="dialogNewInvoice"
                    >
                        <DialogTitle>{this.state.name + " " + this.state.familyName + "  " + this.state.dossierNr}</DialogTitle>
                        <DialogContent>
                            <form className="form__ContainerNewInvoice">
                                <TextField
                                    name="Ereloon"
                                    floatingLabelText="Ereloon"
                                    className="form__TextField__NewInvoice"
                                    onChange={(e) => this.setState({ fee: e.target.value })}
                                    type="number"
                                    autoComplete="off"
                                />
                                <TextField
                                    name="AardInvoice"
                                    floatingLabelText="Aard"
                                    className="form__TextField__NewInvoice"
                                    onChange={(e) => this.setState({ aardInvoice: e.target.value, aardInvoiceDummy: e.target.value })}
                                    autoComplete="off"
                                />
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                color="primary"
                                onClick={() => this.setState({ openConfirmationDialogInvoices: true })}
                                disabled={!enabledNewInvoice}
                            >Nieuwe Factuur</Button>
                            <Button
                                color="secondary"
                                keyboardFocused={true}
                                onClick={() => this.setState({ openInvoice: false })}
                            >Annuleer</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        modal={false}
                        open={this.state.openConfirmationDialogInvoices}
                        onRequestClose={() => this.setState({ openConfirmationDialogInvoices: false })}
                    >
                        <DialogTitle>{"Factuur Bevestiging voor " + this.state.name + " " + this.state.familyName}</DialogTitle>
                        <DialogContent>
                            <strong>Ereloon:   </strong>€{this.state.fee} <br />
                            <strong>Aard:      </strong>{this.state.aardInvoice} <br />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                color="primary"
                                keyboardFocused={true}
                                onClick={this.pushInvoice}
                            >Bevestigen</Button>
                            <Button
                                color="secondary"
                                keyboardFocused={true}
                                onClick={() => this.setState({ openConfirmationDialogInvoices: false })}
                            >Annuleer</Button>
                        </DialogActions>
                    </Dialog>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
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
            </div>
        );
    }
}
export default withRouter(NewInvoice)