import React, { Component } from 'react';
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import HomeIcon from "../../../assets/img/house.png";
import PhoneIcon from "../../../assets/img/phone.png";
import EmailIcon from "../../../assets/img/email.png";
import BTWIcon from "../../../assets/img/btw.png";
import NumberIcon from "../../../assets/img/number.png";
import BuildingIcon from "../../../assets/img/building.png";
import AardIcon from "../../../assets/img/aard.png";
import DossierIcon from "../../../assets/img/dossier.png";
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {withRouter} from 'react-router-dom';

//Import CSS
import './NewInvoice.css';
import * as firebase from 'firebase';

const styles = {
    customWidth: {
      width: 500,
    },
  };
  

class NewInvoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: true,
            value: 10,
            plannen: [],
            value: 1,
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
            strippedPhone: '',

            emailDummy: 'Johndoe@gmail.com',
            email: '', 
            
            BTWDummy: 'BE 0999.999.999',
            BTW: '',
            strippedBTW: '',

            numerDummy: '97.11.21-275.45',
            number: '',

            buildingStreetDummy: '124 Main Street',
            buildingStreet: '', 

            buildingCityDummy: "Anytown",
            buildingCity: '',

            AardDummy: 'verbouwing bestaande woning',
            Aard: '',

            DossierNrDummy: '2017/256',
            DossierNr: '',

            FeeDummy: '€1000',
            Fee: '',

            AardInvoiceDummy: 'Voorontwerp Gebouw',
            AardInvoice: '',

            key: '',

            numberValid: false,
            phoneValid: false,

            numberClasses: '',
            numberClassesCard: '',
            numberError: '',
            emailError: '',
            emailClasses: '',
            emailClassesCard: '',
            BTWClasses: '',

            openInvoice: false,
            openPlanEdit: false,
            openConfirmationDialogInvoices: false,
            enableNewInvoiceContactCard: true,
            enableEditPlanContactCard:true,
            enabled: false,
        };

        this.database = firebase.database().ref('/plannen');
    }
    
    handleChange = (event, index, value) => {
        for (var i = 0; i < this.state.plannen.length; i++){
            if (this.state.plannen[i].key === value){
                this.setState({strippedPhone: "0" + this.state.plannen[i].phone.substring(4).split('.').join("").split('/').join("")});
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

                    numerDummy: this.state.plannen[i].number,
                    number: this.state.plannen[i].number,

                    buildingStreetDummy: this.state.plannen[i].buildingStreet,
                    buildingStreet: this.state.plannen[i].buildingStreet, 

                    buildingCityDummy: this.state.plannen[i].buildingCity,
                    buildingCity: this.state.plannen[i].buildingCity,

                    AardDummy: this.state.plannen[i].Aard,
                    Aard: this.state.plannen[i].Aard,

                    DossierNrDummy: this.state.plannen[i].dossierNr,
                    DossierNr: this.state.plannen[i].dossierNr,

                    key: this.state.plannen[i].key,
                    value: value,
                    enableEditPlanContactCard: false,
                    enableNewInvoiceContactCard: false, 
                    numberValid: true,
                    phoneValid: true
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

    updateName = (e) =>{ 
        this.setState({name: e.target.value, nameDummy: e.target.value});
    }

    updateFamilyName = (e) =>{ 
        this.setState({familyName: e.target.value, familyNameDummy: e.target.value});
    }

    updateStreet = (e) =>{ 
        this.setState({street: e.target.value, streetDummy: e.target.value});
    }

    updateCity = (e) =>{ 
        this.setState({city: e.target.value, cityDummy: e.target.value});
    }

    updatePhone = (e) =>{ 
        if (e.target.value.substring(0,1) == 0) {           
            if (parseInt(e.target.value.substring(1, 2)) !== 4) {
                if (e.target.value.length === 6 || e.target.value.length === 9) e.target.value += ".";
                if (e.target.value.length === 3) e.target.value += "/";
            }
            if (parseInt(e.target.value.substring(1, 2)) === 4) {
                if (e.target.value.length === 8) e.target.value += ".";
                if (e.target.value.length === 4) e.target.value += "/";
            }
            this.setState({phone: e.target.value, phoneDummy: e.target.value});
        }
    }

    updatePhoneOnChange = (e) => {               
        this.setState({phone: e.target.value, phoneDummy: e.target.value});
        if (this.state.phone.length === 11) this.setState({phoneValid: true})
    }

    updateEmail = (e) =>{ 
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var valid =  re.test(String(e.target.value).toLowerCase());
        if (!valid) {
            this.setState({ emailClasses: "errorFillIn" });
            this.setState({ emailClassesCard: "errorFillInCard" });
            this.setState({ emailError: "Ongeldig Emailadres!" }); 
        } else {
            this.setState({ emailClasses: "" });
            this.setState({ emailClassesCard: "" });
            this.setState({ emailError: "" }); 
        }
        this.setState({email: e.target.value, emailDummy: e.target.value});
    }

    updateNumber = (e) =>{
        if (e.target.value.length === 2 || e.target.value.length === 5 || e.target.value.length === 12) e.target.value += "."; 
        if (e.target.value.length === 8) e.target.value += "-";
        this.setState({number: e.target.value, numerDummy: e.target.value});
    }

    updateNumberOnChange = (e) => {
        this.setState({number: e.target.value, numerDummy: e.target.value});
        if(e.target.value.length === 15) {
            var numb = parseInt(e.target.value.substring(0, 12).replace(/\./g, "").replace("-", "")); 
            if (97 - (numb % 97) !== parseInt(e.target.value.substring(13, 15))) {
                this.setState({ numberClasses: "errorFillIn" });
                this.setState({ numberClassesCard: "errorFillInCard" });
                this.setState({ numberError: "Ongeldig Rijksregisternummer!" }); 
                this.setState({ numberValid: false }); 
            }       
            else {
                this.setState({ numberClasses: "" });
                this.setState({ numberClassesCard: "" });
                this.setState({ numberError: "" }); 
                this.setState({ numberValid: true }); 
            }
        }
    }

    updateBTW = (e) =>{      
        if (e.target.value.substring(0,1) == 0){
            if (e.target.value.length ===  4 || e.target.value.length === 8)    e.target.value += ".";       
            this.setState({BTW: "BE " + e.target.value, BTWDummy: "BE " +  e.target.value});
        }
        if (e.target.value.substring(0,1) != 0){
            if (e.target.value.length ===  3 || e.target.value.length === 7)    e.target.value += ".";       
            this.setState({BTW: "BE 0" + e.target.value, BTWDummy: "BE 0" +  e.target.value});
        }
    }

    updateBuildingStreet = (e) =>{ 
        this.setState({buildingStreet: e.target.value, buildingStreetDummy: e.target.value});
    }

    updateBuildingCity = (e) =>{ 
        this.setState({buildingCity: e.target.value, buildingCityDummy: e.target.value});
    }

    updateAard = (e) =>{ 
        this.setState({Aard: e.target.value, AardDummy: e.target.value});
    }

    updateAardInvoice = (e) =>{ 
        this.setState({AardInvoice: e.target.value, AardInvoiceDummy: e.target.value});
        console.log()
        // if (this.state.AardInvoice.length != 0 && this.state.Fee.length != 0) this.setState({enabledNewInvoice: true})
        // else this.setState({enabledNewInvoice: false})
    }

    updateFee = (e) =>{ 
        this.setState({Fee: e.target.value});
        // if (this.state.AardInvoice.length != 0 && this.state.Fee.length != 0) this.setState({enabledNewInvoice: true})
        // else this.setState({enabledNewInvoice: false})
    }

    handleOpenNewInvoice = () => {
        this.setState({openInvoice: true});
    };

    handleOpenEditPlan = () => {
        this.setState({openPlanEdit: true});
    };

    handleCloseNewInvoice = () => {
        this.setState({openInvoice: false});
    };

    handleCloseEditPlan = () => {
        this.setState({openPlanEdit: false});
    };

    handleCloseConfirmationDialogInvoices = () => {
        this.setState({openConfirmationDialogInvoices: false, openInvoice: false})
    }

    pushInvoice = (e) => {
        e.preventDefault();
        let item = {
            Fee: this.state.Fee,
            AardInvoice: this.state.AardInvoice,
            key: this.state.key
        }
        firebase.database().ref('invoices').push(item);

        this.setState({openConfirmationDialogInvoices: true, handleOpenNewInvoice: false});

        //this.props.history.push('/overview');
    }

    handleEditPlan (){
        var updateData = {
            key: this.state.key,
            dossierNr: this.state.DossierNr,
            name: this.state.name,
            familyName: this.state.familyName,
            street: this.state.street,
            city: this.state.city,
            email: this.state.email,
            phone: this.state.phone,
            number: this.state.number,
            BTW: this.state.BTW,
            buildingStreet: this.state.buildingStreet,
            buildingCity: this.state.buildingCity,
            aard: this.state.Aard
        }
        var newKey = firebase.database().ref().child('plannen').push().key;

        var updates = {};
        updates['/plannen/' + newKey] = updateData;
        return firebase.database().ref().update()
    }

    componentWillMount (){
        const allPlans = this.state.plannen;

        this.database.on('child_added', snapshot => {
            allPlans.push({
                key: snapshot.key,
                dossierNr: snapshot.val().DossierNr,
                name: snapshot.val().name,
                familyName: snapshot.val().familyName,
                street: snapshot.val().street,
                city: snapshot.val().city,
                email: snapshot.val().email,
                phone: snapshot.val().phone,
                number: snapshot.val().number,
                BTW: snapshot.val().BTW,
                buildingStreet: snapshot.val().buildingStreet,
                buildingCity: snapshot.val().buildingCity,
                Aard: snapshot.val().aard
            })
            this.setState({plannen: allPlans});
        })
    }


    
    componentDidMount () {
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
        const { name, familyName, street, city, email, number, phone, phoneValid, buildingStreet, buildingCity, Aard, numberValid, Fee, AardInvoice } = this.state;
        const enabledEditPlan =
            name.length > 0 &&
            familyName.length > 0 &&
            street.length > 0 &&
            city.length > 0 &&
            email.length > 0 &&   
            phone.length > 11 &&  
            phoneValid &&         
            buildingStreet.length > 0 &&
            buildingCity.length > 0 &&
            Aard.length > 0 &&
            number.length > 14 &&
            numberValid;
            console.log("name: " +name.length);
            console.log("fname: " +familyName.length);
            console.log("str: " +street.length);
            console.log("c: " +city.length);
            console.log("em : " +email.length);
            console.log("ph: " +phone.length);
            console.log("phoneVa: " +phoneValid.length);
            console.log("buildingstreet: " +buildingStreet.length);
            console.log("builcity: " +buildingCity.length);
            console.log("aard: " +Aard.length);
            console.log("numbr: " +number.length);
            console.log("nmvrval: " +numberValid.length);
            console.log("- - - - - - - - - - - -");
            
        const enabledNewInvoice =
            Fee.length > 0 && 
            AardInvoice.length > 0;
        const actionsNewInvoice = [
            <FlatButton
                label="Nieuwe Factuur"
                primary={true}
                onClick={this.pushInvoice}
                disabled={!enabledNewInvoice}
            />,
            <FlatButton
                label="Annuleer"
                secondary={true}
                keyboardFocused={true}
                onClick={this.handleCloseNewInvoice}
          />,
        ];
        const actionsEditPlan = [
            <FlatButton
              label="Wijzig Plan"
              primary={true}
              onClick={this.handleEditPlan}
              disabled={!enabledEditPlan}
            />,
            <FlatButton
                label="Annuleer"
                primary={true}
                keyboardFocused={true}
                onClick={this.handleCloseEditPlan}
          />,
        ];
        const actionsConfirmationDialogInvoices = [
            <FlatButton
                label="Ok"
                secondary={true}
                keyboardFocused={true}
                onClick={this.handleCloseConfirmationDialogInvoices}
          />,
        ];
        
        return (
        <section className="form__Container">  
            <div className="Dropdown">  
                <DropDownMenu
                    value={this.state.value}
                    onChange={this.handleChange}
                    style={styles.customWidth}
                    autoWidth={false}
                >
                    {
                        this.state.plannen.map((plan) => {
                            return (
                                <MenuItem value={plan.key} primaryText={plan.dossierNr + ", " + plan.familyName + " " + plan.name}  />
                            )
                        })
                    }
                </DropDownMenu>
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
                            <img src={NumberIcon} alt="Number Icon"/>
                            <div className={ this.state.numberClassesCard }>{this.state.numerDummy}</div>
                        </div>
                    </div>
                    <div></div>
                    <div className="info buildingInfo">
                        <div> 
                            <img src={DossierIcon} alt="Dossier Icon"/>
                            <div>{this.state.DossierNrDummy}</div>
                        </div>
                        <div> 
                            <img src={BuildingIcon} alt="Building Icon" className="addressContactCardImg"/>
                            <div className="addressContactCard">{this.state.buildingStreetDummy}<br/>
                            {this.state.buildingCityDummy}</div>
                        </div>
                        <div>
                            <img src={AardIcon} alt="Aard Icon"/>
                            <div className="aardContactCard">{this.state.AardDummy}</div>
                        </div>
                    </div>
                    <div className="actionButtonsInvoice">
                        <FlatButton
                            label="Nieuwe Factuur"
                            primary={true}
                            onClick={this.handleOpenNewInvoice}
                            disabled={this.state.enableNewInvoiceContactCard}
                        />
                        <FlatButton
                            label="Bewerk Plan"
                            primary={true}
                            keyboardFocused={true}
                            onClick={this.handleOpenEditPlan}
                            disabled={this.state.enableEditPlanContactCard}
                        />
                    </div>
                </CardText>
            </Card>
        </div>
        <Dialog
            title={"Factuur voor " + this.state.familyName + " " + this.state.name + " - " + this.state.DossierNr}
            actions={actionsNewInvoice}
            modal={false}
            open={this.state.openInvoice}
            onRequestClose={this.handleCloseNewInvoice}
        >
            <form>
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
            title={"Bewerk Plan voor " + this.state.familyName + " " + this.state.name + " - " + this.state.DossierNr}
            actions={actionsEditPlan}
            modal={false}
            open={this.state.openPlanEdit}
            onRequestClose={this.handleCloseEditPlan}
            autoScrollBodyContent={true}
        >
        <div className="formEditPlan">
            <TextField
                name="familyName"
                floatingLabelText="Naam *"
                className="form__TextField"
                onChange={this.updateFamilyName}
                value={this.state.familyName}
            />
            <TextField
                name="name"
                floatingLabelText="Voornaam *"
                className="form__TextField"
                onChange={this.updateName}
                value={this.state.name}
            />
            <TextField
                name="street"
                id="street"
                floatingLabelText="Straat *"
                className="form__TextField"
                onChange={this.updateStreet}
                type="text"
                placeholder=""
                value={this.state.street}                            
            />
            <TextField
                name="city"
                floatingLabelText="Gemeente *"
                className="form__TextField"
                onChange={this.updateCity}
                value={this.state.city}
            />
            <TextField
                name="phone"
                id="phone"
                floatingLabelText="Telefoon *"
                className="form__TextField"
                maxLength="12"
                onKeyPress={this.updatePhone}
                onChange={this.updatePhoneOnChange}
                value={this.state.phone}
            />
            <TextField
                name="email"
                floatingLabelText="Email *"
                className="form__TextField"
                onChange={this.updateEmail}
                type="email"
                value={this.state.email}
            />
            <TextField
                name="BTW"
                floatingLabelText="BTW Nummer"
                className={"form__TextField " + this.state.BTWClasses }
                onKeyPress={this.updateBTW}
                maxLength="12"
            />
            <TextField
                name="number"
                floatingLabelText="Rijksregisternummer *"
                className={"form__TextField " + this.state.numberClasses }
                onKeyPress={this.updateNumber}
                onChange={this.updateNumberOnChange}
                maxLength="15"
                errorText={this.state.numberError}
                value={this.state.number}
            />
        </div>
        <div className="border"></div>
        <div className="form__Plan">
            <TextField
                name="buildingStreet"
                id="buildingStreet"
                floatingLabelText="Ligging *"
                className="form__TextField"
                onChange={this.updateBuildingStreet}
                placeholder=""
                autoComplete="email"
                value={this.state.buildingStreet}
            />
            <TextField
                name="buildingCity"
                floatingLabelText="Bouwplaats *"
                className="form__TextField"
                onChange={this.updateBuildingCity}
                value={this.state.buildingCity}
                value={this.state.buildingCity}
            />
            <TextField
                name="Aard"
                floatingLabelText="Aard *"
                className="form__TextField"
                onChange={this.updateAard}
                value={this.state.Aard}
            />
            </div>
        </Dialog>
        <Dialog
          actions={actionsConfirmationDialogInvoices}
          modal={false}
          open={this.state.openConfirmationDialogInvoices}
          onRequestClose={this.handleCloseConfirmationDialogInvoices}
        >
          Factuur voor {this.state.name + " " + this.state.familyName + " Is aangemaakt!"}
        </Dialog>
        </section>
      );
    }
  }
  export default withRouter(NewInvoice)