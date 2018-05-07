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

export default class NewPlan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: true,
            name : 'John',
            familyName: 'Doe',
            street: '123 Main Street',
            city: '',
            cityDummy: 'Anytown',
            phone: '+32 498/123.456',
            email: 'Johndoe@gmail.com',
            BTW: 'BE 0999.999.999',
            number: '61.11.14-275.69',
            buildingStreet: '124 Main Street',
            buildingCity: '',
            buildingCityDummy: 'Anytown',
            Aard: 'verbouwing bestaande woning',
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
        this.setState({name: e.target.value});
    }

    updateFamilyName = (e) =>{ 
        this.setState({familyName: e.target.value});
    }

    updateStreet = (e) =>{ 
        this.setState({street: e.target.value});
    }

    updateCity = (e) =>{ 
        this.setState({city: e.target.value});
    }

    updatePhone = (e) =>{ 
        if (parseInt(e.target.value.substring(1, 2)) == 5) {
            if (e.target.value.length == 6 || e.target.value.length == 9) e.target.value += ".";
            if (e.target.value.length == 3) e.target.value += "/";
        }
        if (parseInt(e.target.value.substring(1, 2)) == 4) {
            if (e.target.value.length == 8) e.target.value += ".";
            if (e.target.value.length == 4) e.target.value += "/";
        }
        this.setState({phone: "+32 " + e.target.value.substring(1)});
    }

    updateEmail = (e) =>{ 
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var valid =  re.test(String(e.target.value).toLowerCase());
        if (!valid) {
            this.state.emailClasses = "errorFillIn";  
            this.state.emailClassesCard = "errorFillInCard";  
            this.state.emailError = "Ongeldig Emailadres!";
        } else {
            this.state.emailClasses = "";  
            this.state.emailClassesCard = "";  
            this.state.emailError = "";
        }
        this.setState({email: e.target.value});
    }

    updateNumber = (e) =>{ 
        if (e.target.value.length == 2 || e.target.value.length == 5 || e.target.value.length == 12) e.target.value += "."; 
        if (e.target.value.length == 8) e.target.value += "-";
        if(e.target.value.length == 15) {
            var numb = parseInt(e.target.value.substring(0, 12).replace(/\./g, "").replace("-", "")); 
            if (97 - (numb % 97) != parseInt(e.target.value.substring(13, 15))) {
                this.state.numberClasses = "errorFillIn";  
                this.state.numberClassesCard = "errorFillInCard";  
                this.state.numberError = "Ongeldig Rijksregisternummer!";
            }       
            else {
                this.state.numberClasses = "";   
                this.state.numberClassesCard = "";   
                this.state.numberError = '';
            }
        }
        this.setState({number: e.target.value});
    }

    updateBTW = (e) =>{ 
        this.state.counterBTW++;        
        if (e.target.value.length ==  4 || e.target.value.length == 8)    e.target.value += ".";       
        this.setState({BTW: "BE " + e.target.value});
    }

    updateBuildingStreet = (e) =>{ 
        this.setState({buildingStreet: e.target.value});
    }

    updateBuildingCity = (e) =>{ 
        this.setState({buildingCity: e.target.value});
    }

    updateAard = (e) =>{ 
        this.setState({Aard: e.target.value});
    }

    componentWillMount () {
        this.setState({ value: this.props.value || '' })
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
          this.setState({street: `${selectedSuggest.route} ${selectedSuggest.street_number}`});
          this.setState({city: `${selectedSuggest.postal_code} ${selectedSuggest.locality}`}); 
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
            this.setState({buildingStreet: `${selectedSuggest.route} ${selectedSuggest.street_number}`});
            this.setState({buildingCity: `${selectedSuggest.postal_code} ${selectedSuggest.locality}`}); 
            var newCityBuilding = this.state.buildingCity;
            building.value = this.state.buildingStreet;
            this.setState({buildingCityDummy: newCityBuilding});
          })
      }


    render() {
      return (
        <section className="form__Container">    
        <div className="contactCard">
            <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
                <CardTitle className="title" title={this.state.name + " " + this.state.familyName} expandable={true}/>
                <CardText className="Text" expandable={true}>
                    <div className="info personalInfo">
                        <p> 
                            <img src={HomeIcon} alt="Address Icon" className="addressContactCardImg"/>
                            <div className="addressContactCard">{this.state.street}<br/>
                            {this.state.cityDummy}</div>
                        </p>
                        <p>
                            <img src={PhoneIcon} alt="Phone Icon"/>
                            <div>{this.state.phone}</div>
                        </p>
                        <p>
                            <img src={EmailIcon} alt="Email Icon"/>
                            <div>{this.state.email}</div>
                        </p>
                        <p>
                            <img src={BTWIcon} alt="BTW Icon"/>
                            <div className={ this.state.BTWClasses }>{this.state.BTW}</div>
                        </p>
                        <p>
                            <img src={NumberIcon} alt="Number Icon"/>
                            <div className={ this.state.numberClassesCard }>{this.state.number}</div>
                        </p>
                    </div>
                    <div></div>
                    <div className="info buildingInfo">
                        <p> 
                            <img src={BuildingIcon} alt="Building Icon" className="addressContactCardImg"/>
                            <div className="addressContactCard">{this.state.buildingStreet}<br/>
                            {this.state.buildingCityDummy}</div>
                        </p>
                        <p>
                            <img src={AardIcon} alt="Aard Icon"/>
                            <div className="aardContactCard">{this.state.Aard}</div>
                        </p>
                    </div>
                </CardText>
                <CardActions className="buttons">
                    <FlatButton label="Preview Contact" onClick={this.handleExpand} />
                    <FlatButton label="Verberg Contact"  onClick={this.handleReduce}/>
                </CardActions>
            </Card>
        </div>
            <form className="form" autoComplete="off">
                <div className="form__Personal">
                    <TextField
                        name="Naam"
                        floatingLabelText="Naam"
                        className="form__TextField"
                        onChange={this.updateFamilyName}
                    />
                    <TextField
                        name="Voornaam"
                        floatingLabelText="Voornaam"
                        className="form__TextField"
                        onChange={this.updateName}
                    />
                    <TextField
                        name="Straat"
                        id="street"
                        floatingLabelText="Straat"
                        className="form__TextField"
                        onChange={this.updateStreet}
                    />
                    <TextField
                        name="Gemeente"
                        floatingLabelText="Gemeente"
                        className="form__TextField"
                        onChange={this.updateCity}
                        value={this.state.city}
                    />
                    <TextField
                        name="Telefoon"
                        floatingLabelText="Telefoon"
                        className="form__TextField"
                        maxLength="13"
                        onChange={this.updatePhone}
                    />
                    <TextField
                        name="Email"
                        floatingLabelText="Email"
                        className="form__TextField"
                        onChange={this.updateEmail}
                        type="email"
                    />
                    <TextField
                        name="BTWNummer"
                        floatingLabelText="BTW Numer"
                        className={"form__TextField " + this.state.BTWClasses }
                        onChange={this.updateBTW}
                        maxLength="12"
                    />
                    <TextField
                        name="Rijksregisternummer"
                        floatingLabelText="Rijksregisternummer"
                        className={"form__TextField " + this.state.numberClasses }
                        onChange={this.updateNumber}
                        maxLength="15"
                        errorText={this.state.numberError}
                    />
                </div>
                <div className="border"></div>
                <div className="form__Plan">
                    <TextField
                        name="Ligging"
                        id="buildingStreet"
                        floatingLabelText="Ligging"
                        className="form__TextField"
                        onChange={this.updateBuildingStreet}
                    />
                    <TextField
                        name="Bouwplaats"
                        floatingLabelText="Bouwplaats"
                        className="form__TextField"
                        onChange={this.updateBuildingCity}
                        value={this.state.buildingCity}
                    />
                    <TextField
                        name="Aard"
                        floatingLabelText="Aard"
                        className="form__TextField"
                        onChange={this.updateAard}
                    />
                </div>
                <div className="SubmitButton">
                    <button enabled="false" className="RaisedButton" onSubmit={(event) => this.auth(event) } ref={(form) => {this.loginForm = form}} href="/NewPlan">NIEUW PLAN</button>
                </div>
            </form>
        </section>
      );
    }
  }