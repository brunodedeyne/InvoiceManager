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

//Import CSS
import './NewInvoice.css';
import * as firebase from 'firebase';

const styles = {
    customWidth: {
      width: 500,
    },
  };
  

export default class NewInvoice extends React.Component {
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

            emailDummy: 'Johndoe@gmail.com',
            email: '', 
            
            BTWDummy: 'BE 0999.999.999',
            BTW: '',

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

            numberValid: false,

            numberClasses: '',
            numberClassesCard: '',
            numberError: '',
            emailError: '',
            emailClasses: '',
            emailClassesCard: '',
            BTWClasses: '',

            openInvoice: false,
            openPlanEdit: false,
            enabled: false
        };

        this.database = firebase.database().ref('/plannen');
    }
    
    handleChange = (event, index, value) => {
        for (var i = 0; i < this.state.plannen.length; i++){
            if (this.state.plannen[i].key === value){
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

                    AardInvoiceDummy: this.state.plannen[i].Aard,
                    AardInvoice: this.state.plannen[i].Aard,

                    DossierNrDummy: this.state.plannen[i].dossierNr,
                    DossierNr: this.state.plannen[i].dossierNr
                })
                console.log(this.state.plannen[i]);
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

    updateFee = (e) =>{ 
        this.setState({Fee: e.target.value});
    }

    updateAard = (e) =>{ 
        this.setState({Aard: e.target.value});
    }

    componentDidMount(){
        // firebase.database().ref('/plannen').on('value', function(snapshot) {
        //     this.getData(snapshot.val());
        // });
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

    pushInvoice (){

    }

    editPlan (){

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
                Aard: snapshot.val().Aard
            })

            this.setState({plannen: allPlans});
        })
    }

    updateName = (e) =>{ 
        this.setState({name: e.target.value, nameDummy: e.target.value});
    }

    updateFamilyName = (e) =>{ 
        this.setState({familyName: e.target.value, familyNameDummy: e.target.value});
        console.log("FMMMMMM" +this.state.familyName);
        console.log("FMMMMMM" +this.state.familyName.length == 0);
    }

    updateStreet = (e) =>{ 
        this.setState({street: e.target.value, streetDummy: e.target.value});
    }

    updateCity = (e) =>{ 
        this.setState({city: e.target.value, cityDummy: e.target.value});
    }

    updatePhone = (e) =>{ 
        if (e.target.value.substring(0,1) == 0) {  
            const phone = document.getElementById('phone');
            phone.maxLength = 12;          
            if (parseInt(e.target.value.substring(1, 2)) === 5) {
                if (e.target.value.length === 6 || e.target.value.length === 9) e.target.value += ".";
                if (e.target.value.length === 3) e.target.value += "/";
            }
            if (parseInt(e.target.value.substring(1, 2)) === 4) {
                if (e.target.value.length === 8) e.target.value += ".";
                if (e.target.value.length === 4) e.target.value += "/";
            }
            this.setState({phone: "+32 " + e.target.value.substring(1), phoneDummy: "+32 " + e.target.value.substring(1)});
        }

        if (e.target.value.substring(0,1) != 0){
            const phone = document.getElementById('phone');
            phone.maxLength = 11;
            if (parseInt(e.target.value.substring(0, 1)) === 5) {
                if (e.target.value.length === 5 || e.target.value.length === 8) e.target.value += ".";
                if (e.target.value.length === 2) e.target.value += "/";
            }
            if (parseInt(e.target.value.substring(0, 1)) === 4) {
                if (e.target.value.length === 7) e.target.value += ".";
                if (e.target.value.length === 3) e.target.value += "/";
            }
            this.setState({phone: "+32 " + e.target.value, phoneDummy: "+32 " + e.target.value});        
        }
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
        this.setState({number: e.target.value, numerDummy: e.target.value});
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
                secondary={true}
                keyboardFocused={true}
                onClick={this.handleCloseEditPlan}
          />,
        ];
        const { name, familyName, street, city, email, number, phone, buildingStreet, buildingCity, Aard, numberValid, Fee, AardInvoice } = this.state;
        const enabledEditPlan =
            city.length > 0 &&
            name.length > 0 &&
            familyName.length > 0 &&
            street.length > 0 &&
            email.length > 0 &&
            number.length > 0 &&
            phone.length > 14 &&
            buildingStreet.length > 0 &&
            buildingCity.length > 0 &&
            Aard.length > 0 &&              
            numberValid;
        const enabledNewInvoice =
            Fee.length > 0 &&             
            AardInvoice > 0;
        return (
        <section className="form__Container">    
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
            <div className="contactCardInvoice">
            <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
                <CardTitle className="title" title={this.state.nameDummy + " " + this.state.familyNameDummy} expandable={true}/>
                <CardText className="Text" expandable={true}>
                    <div className="info personalInfo">
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
                            <div className="aardContactCard">{this.state.AardInvoiceDummy}</div>
                        </div>
                    </div>
                    <div className="actionButtonsInvoice">
                        <FlatButton
                            label="Nieuwe Factuur"
                            primary={true}
                            onClick={this.handleOpenNewInvoice}
                        />
                        <FlatButton
                            label="Bewerk Plan"
                            primary={true}
                            keyboardFocused={true}
                            onClick={this.handleOpenEditPlan}
                        />
                    </div>
                </CardText>
            </Card>
        </div>
        {/* <form className="form" autoComplete="off">
            <div className="form__Plan">

            </div>
            <div className="SubmitButton">
                <button enabled="false" className="RaisedButton" onSubmit={(event) => this.auth(event) } ref={(form) => {this.loginForm = form}} href="/NewPlan">NIEUWE FACTUUR</button>
            </div>
        </form> */}
        <Dialog
            title="Factuur voor John Doe - 2017/256"
            actions={actionsNewInvoice}
            modal={false}
            open={this.state.openInvoice}
            onRequestClose={this.handleCloseNewInvoice}
        >
            <TextField
                name="Ereloon"
                floatingLabelText="Ereloon"
                className="form__TextField"
                onChange={this.updateFee}
            />
            <TextField
                name="Aard"
                floatingLabelText="Aard"
                className="form__TextField"
                onChange={this.updateAard}
            />
        </Dialog>
        <Dialog
            title="Bewerk Plan voor John Doe - 2017/256"
            actions={actionsEditPlan}
            modal={false}
            open={this.state.openPlanEdit}
            onRequestClose={this.handleCloseEditPlan}
        >
            <div className="formEditPlan">
                <TextField
                    name="familyName"
                    floatingLabelText="Naam *"
                    className="form__TextField"
                    onChange={this.updateFamilyName}
                />
                <TextField
                    name="name"
                    floatingLabelText="Voornaam *"
                    className="form__TextField"
                    onChange={this.updateName}
                />
                <TextField
                    name="street"
                    id="street"
                    floatingLabelText="Straat *"
                    className="form__TextField"
                    onChange={this.updateStreet}
                    type="text"
                    placeholder=""                    
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
                    onChange={this.updatePhone}
                />
                <TextField
                    name="email"
                    floatingLabelText="Email *"
                    className="form__TextField"
                    onChange={this.updateEmail}
                    type="email"
                />
                <TextField
                    name="BTW"
                    floatingLabelText="BTW Numer"
                    className={"form__TextField " + this.state.BTWClasses }
                    onChange={this.updateBTW}
                    maxLength="12"
                />
                <TextField
                    name="number"
                    floatingLabelText="Rijksregisternummer *"
                    className={"form__TextField " + this.state.numberClasses }
                    onChange={this.updateNumber}
                    maxLength="15"
                    errorText={this.state.numberError}
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
                />
                <TextField
                    name="buildingCity"
                    floatingLabelText="Bouwplaats *"
                    className="form__TextField"
                    onChange={this.updateBuildingCity}
                    value={this.state.buildingCity}
                />
                <TextField
                    name="Aard"
                    floatingLabelText="Aard *"
                    className="form__TextField"
                    onChange={this.updateAard}
                />
            </div>
        </Dialog>
        </section>
      );
    }
  }