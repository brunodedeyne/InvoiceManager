import React, { Component } from 'react';
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import HomeIcon from "../../../assets/img/house.png";
import PhoneIcon from "../../../assets/img/phone.png";
import EmailIcon from "../../../assets/img/email.png";
import BTWIcon from "../../../assets/img/btw.png";
import NumberIcon from "../../../assets/img/number.png";
import BuildingIcon from "../../../assets/img/building.png";
import AardIcon from "../../../assets/img/aard.png";
//Import CSS
import './NewPlan.css';
import * as firebase from 'firebase';
import {withRouter} from 'react-router-dom';
import Dialog from 'material-ui/Dialog';

var config = {
    apiKey: "AIzaSyDiYwctQZs8cq4LwrUJ0JZvs0ne2f9Bjbg",
    authDomain: "invoicemanager-1525702104034.firebaseapp.com",
    databaseURL: "https://invoicemanager-1525702104034.firebaseio.com",
    projectId: "invoicemanager-1525702104034",
    storageBucket: "invoicemanager-1525702104034.appspot.com",
    messagingSenderId: "908003589667"
  };
  firebase.initializeApp(config);



class NewPlan extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: true,
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

            open: false,

            numberValid: false,

            numberClasses: '',
            numberClassesCard: '',
            numberError: '',
            emailError: '',
            emailClasses: '',
            emailClassesCard: '',
            BTWClasses: ''
        };
    }

    onSuggestionSelected(suggestion) {
        // Add your business logic here. In this case we just log...
        console.log('Selected suggestion:', suggestion)
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
            this.setState({phone: "+32 " + e.target.value.substring(1), phoneDummy: "+32 " + e.target.value.substring(1)});
            if (parseInt(e.target.value.substring(1, 2)) === 5) {
                if (e.target.value.length === 6 || e.target.value.length === 9) e.target.value += ".";
                if (e.target.value.length === 3) e.target.value += "/";
            }
            if (parseInt(e.target.value.substring(1, 2)) === 4) {
                if (e.target.value.length === 8) e.target.value += ".";
                if (e.target.value.length === 4) e.target.value += "/";
            }
        }

        if (e.target.value.substring(0,1) != 0){
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

    pushForm = (e) => {
        e.preventDefault();
        let item = {
            name: this.state.name,
            familyName: this.state.familyName,
            street: this.state.street,
            city: this.state.city,
            number: this.state.number,
            BTW: this.state.BTW,
            phone: this.state.phone,
            email: this.state.email,
            buildingStreet: this.state.buildingStreet,
            buildingCity: this.state.buildingCity,
            aard: this.state.Aard
        }
        firebase.database().ref('plannen').push(item);

        this.props.history.push('/clients');
    }

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };
    
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
        const actions = [
            <FlatButton
              label="Annuleer"
              secondary={true}
              onClick={this.handleClose}
            />,
            <FlatButton
                label="Opslaan"
                primary={true}
                keyboardFocused={true}
                onClick={this.pushForm}
          />,
        ];
        const { name, familyName, street, city, email, number, buildingStreet, buildingCity, Aard, numberValid } = this.state;
        const enabled =
        city.length > 0 &&
              name.length > 0 &&
              familyName.length > 0 &&
              street.length > 0 &&
              city.length > 0 &&
              email.length > 0 &&
              number.length > 0 &&
              buildingStreet.length > 0 &&
              buildingCity.length > 0 &&
              Aard.length > 0 &&
              numberValid;
        return (            
            <section className="form__Container"> 
                <form className="form" >
                    <div className="form__Personal">
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
                            autoComplete="name"
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
                            floatingLabelText="Telefoon"
                            className="form__TextField"
                            maxLength="13"
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
                    <div>
                        <Dialog
                            actions={actions}
                            modal={true}
                            open={this.state.open}
                            onRequestClose={this.handleClose}
                        >
                        <div>
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
                                            <img src={BuildingIcon} alt="Building Icon" className="addressContactCardImg"/>
                                            <div className="addressContactCard">{this.state.buildingStreetDummy}<br/>
                                            {this.state.buildingCityDummy}</div>
                                        </div>
                                        <div>
                                            <img src={AardIcon} alt="Aard Icon"/>
                                            <div className="aardContactCard">{this.state.AardDummy}</div>
                                        </div>
                                    </div>
                                </CardText>
                                {/* <CardActions className="buttons">
                                    <FlatButton label="Voorbeeld Contact" onClick={this.handleExpand} />
                                    <FlatButton label="Verberg"  onClick={this.handleReduce}/>
                                </CardActions> */}
                            </Card>
                        </div>
                        </Dialog>
                    </div>

                    <div className="SubmitButton">                        
                        <input value="NIEUW PLAN" onClick={this.handleOpen} disabled={!enabled} className="RaisedButton"/>
                    </div>
                </form>
            </section>
        );
    }
  }
  export default withRouter(NewPlan)