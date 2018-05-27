import React, { Component } from 'react';
import TextField from "material-ui/TextField";
// import RaisedButton from "material-ui/RaisedButton";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import HomeIcon from "../../../assets/img/house.png";
import PhoneIcon from "../../../assets/img/phone.png";
import EmailIcon from "../../../assets/img/email.png";
import BTWIcon from "../../../assets/img/btw.png";
import RRNIcon from "../../../assets/img/rrn.png";
import BuildingIcon from "../../../assets/img/building.png";
import AardIcon from "../../../assets/img/aard.png";
import DossierIcon from "../../../assets/img/dossier.png";
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {withRouter} from 'react-router-dom';
import AutoComplete from 'material-ui/AutoComplete';
import Header from '../../HeaderComponents/Header';
import CustomDrawer from '../../HeaderComponents/CustomDrawer';
import Menu from '../../MenuComponents/Menu';
// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

//Import CSS
import './NewInvoice.css';
import * as firebase from 'firebase';  

const dataSourceConfig = {
    text: 'dossierNr',
    value: 'dossierNr',
};

class NewInvoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: true,
            plannen: [],
            value: "Default",
            nameDummy : 'John',
            name: '',

            familyNameDummy: 'Doe',
            familyName: '',

            streetDummy: '123 Main Street',
            street: '',

            cityDummy: 'Anytown',
            city: '',      

            phoneDummy: '+32 498/123.456',
            phone: '',
            //strippedPhone: '',

            emailDummy: 'Johndoe@gmail.com',
            email: '', 
            
            BTWDummy: 'BE 0999.999.999',
            BTW: '',
            //strippedBTW: '',

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
        for (var i = 0; i < this.state.plannen.length; i++){
            if (this.state.plannen[i].key === value){
                //this.setState({strippedPhone: "0" + this.state.plannen[i].phone.substring(4).split('.').join("").split('/').join("")});
                this.setState({
                    nameDummy : this.state.plannen[i].name,
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

                    key: this.state.plannen[i].key,
                    value: value,
                    //enableEditPlanContactCard: false,
                    enableNewInvoiceContactCard: false, 
                    // RRNValid: true,
                    // phoneValid: true
                })
            }
        }
    }
    
    handleExpandChange = (expanded) => {
        this.setState({expanded: expanded});
    };
    
    handleToggle = (event, toggle) => {
        this.setState({expanded: toggle});
    };
    
    handleExpand = () => {
        this.setState({expanded: true});
    };
    
    handleReduce = () => {
        this.setState({expanded: false});
    };

    updateAardInvoice = (e) =>{ 
        this.setState({aardInvoice: e.target.value, aardInvoiceDummy: e.target.value});
    }

    updateFee = (e) =>{ 
        this.setState({fee: e.target.value});
    }

    handleOpenNewInvoice = () => {
        this.setState({openInvoice: true});
    };

    handleCloseNewInvoice = () => {
        this.setState({openInvoice: false});
    };


    handleOpenConfirmationDialogInvoices = () => {
        this.setState({openConfirmationDialogInvoices: true});
    };

    handleCloseConfirmationDialogInvoices = () => {
        this.setState({openConfirmationDialogInvoices: false})
    }

    handleCloseSuccessInvoice = () => {
        this.setState({openSuccessInvoice: false})
    }

    pushInvoice = (e) => {
        let now = new Date();
        let val = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;

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
            openInvoice: false, openSnackbar: true,
            openSnackbar: true, 
            snackBarContent: "factuur voor " + this.state.name + " " + this.state.familyName + "   -  €" + this.state.fee + " Aangemaakt!"
        });
    }

    selectClient = (val) => {
        this.setState({
            nameDummy : val.name,
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

            key: val.key,
            //enableEditPlanContactCard: false,
            enableNewInvoiceContactCard: false, 
            // RRNValid: true,
            // phoneValid: true
        })
    };

    componentWillMount (){
        const allPlans = this.state.plannen;

        this.database.on('child_added', snapshot => {
            if (snapshot.val().userUid === this.state.userUid) {
                console.log(snapshot.val());
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
                this.setState({plannen: allPlans});
            }
        })
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

    componentDidMount () {
        this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
            if (user) this.setState({userUid: user.uid});    
            let items = [];
            this.database.on('value', (snapshot) => {
                items = Object.values(snapshot.val()).map((item, i) => { 
                    if (user){
                        if (item.userUid == user.uid) {
                            item.key = i;
                            return item; 
                        }
                    }
                });
                items = items.filter(Boolean);
                this.setState({plannen: items});
            });    
        });  

        const input = document.getElementById('street');
        const building = document.getElementById('buildingStreet');
        const options = {
          componentRestrictions: {country: 'be'},
          types: ['address']
        };
        const geoAutocomplete = new window.google.maps.places.Autocomplete((input), options);

        const geoAutocompleteBuilding = new window.google.maps.places.Autocomplete((building), options);

        geoAutocomplete.addListener('place_changed', () => {
          const selectedPlace = geoAutocomplete.getPlace();
          const componentForm = {
            street_number: 'long_name',
            route: 'long_name',
            locality: 'long_name',
            administrative_area_level_1: 'short_name',
            country: 'long_name',
            postal_code: 'long_name'
          };
          // Get each component of the address from the place details
          // and fill the corresponding field on the form.
          let selectedSuggest = {};
          for (let addressComponent of selectedPlace.address_components) {
            const addressType = addressComponent.types[0];
            if (componentForm[addressType]) {
              selectedSuggest[addressType] = addressComponent[componentForm[addressType]]
            };
          };
          this.setState({street: `${selectedSuggest.route} ${selectedSuggest.street_number}`, streetDummy: `${selectedSuggest.route} ${selectedSuggest.street_number}`});
          this.setState({city: `${selectedSuggest.postal_code} ${selectedSuggest.locality}`, cityDummy: `${selectedSuggest.postal_code} ${selectedSuggest.locality}`}); 
          var newCity = this.state.city;
          input.value = this.state.street;
          this.setState({cityDummy: newCity});
        })

        geoAutocompleteBuilding.addListener('place_changed', () => {
            const selectedPlace = geoAutocompleteBuilding.getPlace();
            const componentForm = {
              street_number: 'long_name',
              route: 'long_name',
              locality: 'long_name',
              administrative_area_level_1: 'short_name',
              country: 'long_name',
              postal_code: 'long_name'
            };
            // Get each component of the address from the place details
            // and fill the corresponding field on the form.
            let selectedSuggest = {};
            for (let addressComponent of selectedPlace.address_components) {
              const addressType = addressComponent.types[0];
              if (componentForm[addressType]) {
                selectedSuggest[addressType] = addressComponent[componentForm[addressType]]
              };
            };
            this.setState({buildingStreet: `${selectedSuggest.route} ${selectedSuggest.street_number}`, buildingStreetDummy: `${selectedSuggest.route} ${selectedSuggest.street_number}`});
            this.setState({buildingCity: `${selectedSuggest.postal_code} ${selectedSuggest.locality}`, buildingCityDummy: `${selectedSuggest.postal_code} ${selectedSuggest.locality}`}); 
            var newCityBuilding = this.state.buildingCity;
            building.value = this.state.buildingStreet;
            this.setState({buildingCityDummy: newCityBuilding});
          })
      }

    render() {
        const { name, familyName, street, city, email, RRN, phone, phoneValid, buildingStreet, buildingCity, aard, RRNValid, fee, aardInvoice } = this.state;

        const enabledNewInvoice =
            fee.length > 0 && 
            aardInvoice.length > 0;
        const actionsNewInvoice = [
            <FlatButton
                label="Nieuwe Factuur"
                primary={true}
                onClick={this.handleOpenConfirmationDialogInvoices}
                disabled={!enabledNewInvoice}
            />,
            <FlatButton
                label="Annuleer"
                secondary={true}
                keyboardFocused={true}
                onClick={this.handleCloseNewInvoice}
          />,
        ];
        const actionsConfirmationDialogInvoices = [
            <FlatButton
                label="Bevestigen"
                primary={true}
                keyboardFocused={true}
                onClick={this.pushInvoice}
            />,
            <FlatButton
                label="Annuleer"
                secondary={true}
                keyboardFocused={true}
                onClick={this.handleCloseConfirmationDialogInvoices}
            />
        ];
        return (
            <div>
                {/* <Header headerTitle="Nieuwe Factuur"/> */}
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
                                                <MenuItem key={plan.key} value={plan.key} primaryText={plan.dossierNr + ", " + plan.name + " " + plan.familyName}  />
                                            )
                                        })
                                    }
                                </DropDownMenu>
                        </div>
                        <div className="labelSearchName">
                            <AutoComplete
                                floatingLabelText="Zoek op Dossier Nummer"
                                dataSourceConfig={dataSourceConfig}
                                dataSource={this.state.plannen}
                                filter={AutoComplete.caseInsensitiveFilter}
                                className="form__TextFieldSearchName"
                                onNewRequest={this.selectClient}
                            />
                        </div>
                        <div className="contactCardInvoice">
                        <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
                            <CardTitle className="title" title={this.state.nameDummy + " " + this.state.familyNameDummy} expandable={true}/>
                            <CardText className="Text" expandable={true}>
                                <div className="info personalInfoInvoice">
                                    <div> 
                                        <img src={HomeIcon} alt="Address Icon" className="addressContactCardImg"/>
                                        <div className="addressContactCard">{this.state.streetDummy}<br/>
                                        {this.state.cityDummy}</div>
                                    </div>
                                    <div>
                                        <img src={PhoneIcon} alt="Phone Icon"/>
                                        <div>{this.state.phoneDummy}</div>
                                    </div>
                                    <div>
                                        <img src={EmailIcon} alt="Email Icon"/>
                                        <div>{this.state.emailDummy}</div>
                                    </div>
                                    <div>
                                        <img src={BTWIcon} alt="BTW Icon"/>
                                            <div className={ this.state.BTWClasses }>{this.state.BTWDummy}</div>                              
                                    </div>
                                    <div>
                                        <img src={RRNIcon} alt="RRN Icon"/>
                                        <div className={ this.state.RRNClassesCard }>{this.state.RRNDummy}</div>
                                    </div>
                                </div>
                                <div></div>
                                <div className="info buildingInfo">
                                    <div> 
                                        <img src={DossierIcon} alt="Dossier Icon"/>
                                        <div>{this.state.dossierNrDummy}</div>
                                    </div>
                                    <div> 
                                        <img src={BuildingIcon} alt="Building Icon" className="addressContactCardImg"/>
                                        <div className="addressContactCard">{this.state.buildingStreetDummy}<br/>
                                        {this.state.buildingCityDummy}</div>
                                    </div>
                                    <div>
                                        <img src={AardIcon} alt="Aard Icon"/>
                                        <div className="aardContactCard">{this.state.aardDummy}</div>
                                    </div>
                                </div>
                                <div className="actionButtonsInvoice">
                                    <FlatButton
                                        label="Nieuwe Factuur"
                                        primary={true}
                                        onClick={this.handleOpenNewInvoice}
                                        disabled={this.state.enableNewInvoiceContactCard}
                                    />
                                </div>
                            </CardText>
                        </Card>
                    </div>
                    <Dialog
                        title={"Factuur voor " + this.state.name + " " + this.state.familyName + " - " + this.state.dossierNr}
                        actions={actionsNewInvoice}
                        modal={false}
                        open={this.state.openInvoice}
                        onRequestClose={this.handleCloseNewInvoice}
                    >
                        <form className="form__ContainerNewInvoice">
                            <TextField
                                name="Ereloon"
                                floatingLabelText="Ereloon"
                                className="form__TextField"
                                onChange={this.updateFee}
                                type="number"
                            />
                            <TextField
                                name="AardInvoice"
                                floatingLabelText="Aard"
                                className="form__TextField"
                                onChange={this.updateAardInvoice}
                            />
                        </form>
                    </Dialog>
                    <Dialog
                        title={"Factuur Bevestiging voor " + this.state.name + " " + this.state.familyName}
                        actions={actionsConfirmationDialogInvoices}
                        modal={false}
                        open={this.state.openConfirmationDialogInvoices}
                        onRequestClose={this.handleCloseConfirmationDialogInvoices}
                    >   
                    <strong>Ereloon:   </strong>€{this.state.fee} <br />
                    <strong>Aard:      </strong>{this.state.aardInvoice} <br />
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
                </section>
            </div>
        );
    }
}
export default withRouter(NewInvoice)