import React from 'react';
import TextField from "material-ui/TextField";
// import RaisedButton from "material-ui/RaisedButton";
import {
    Card, 
    //CardActions, 
    //CardHeader, 
    //CardMedia, 
    CardTitle, 
    CardText
} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import HomeIcon from "../../../assets/img/house.png";
import PhoneIcon from "../../../assets/img/phone.png";
import EmailIcon from "../../../assets/img/email.png";
import BTWIcon from "../../../assets/img/btw.png";
import RRNIcon from "../../../assets/img/rrn.png";
import BuildingIcon from "../../../assets/img/building.png";
import AardIcon from "../../../assets/img/aard.png";
//Import CSS
import './NewPlan.css';
import * as firebase from 'firebase';
import {withRouter} from 'react-router-dom';
import Dialog from 'material-ui/Dialog';

// import Header from '../../HeaderComponents/Header';
// import Menu from '../../MenuComponents/Menu';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

class NewPlan extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: true,
            //nameDummy : 'John',
            name: '',

            //familyNameDummy: 'Doe',
            familyName: '',

            //streetDummy: '123 Main Street',
            street: '',

            //cityDummy: 'Anytown',
            city: '',      

            //phoneDummy: '+32 498/123.456',
            phone: '',

            //emailDummy: 'Johndoe@gmail.com',
            email: '', 
            
            //BTWDummy: 'BE 0999.999.999',
            BTW: '',

            //RRNDummy: '97.11.21-275.45',
            RRN: '',

            //buildingStreetDummy: '124 Main Street',
            buildingStreet: '', 

            //buildingCityDummy: "Anytown",
            buildingCity: '',

            //aardDummy: 'verbouwing bestaande woning',
            aard: '',

            dossierNrs: [],
            lastDossierNr: '',

            openPreview: false,

            RRNValid: false,
            phoneValid: false,

            RRNClasses: '',
            RRNClassesCard: '',
            emailClasses: '',
            emailClassesCard: '',
            BTWClasses: '',
            openSnackbar: false,
            userUid: '',
            nameErrorText: "",
            familyNameErrorText: '',
            streetErrorText: '',
            cityErrorText : '',
            phoneErrorText: '',
            emailErrorText : '',
            RRNErrorText: '',
            buildingStreetErrorText: '',
            buildingCityErrorText: '',
            aardErrorText: '',
        };

        this.database = firebase.database().ref('/plannen');
        this.handleOpenPreview = this.handleOpenPreview.bind(this);
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
        if (e.target.value.length <= 0) this.setState({nameErrorText: "Naam mag niet leeg zijn!", name: e.target.value});
        else this.setState({nameErrorText: "", name: e.target.value});
    }

    updateFamilyName = (e) =>{ 
        if (e.target.value.length <= 0) this.setState({familyNameErrorText: "Familienaam mag niet leeg zijn!"});
        else this.setState({familyNameErrorText: "", familyName: e.target.value, familyNameDummy: e.target.value});
    }

    updateStreet = (e) =>{ 
        if (e.target.value.length <= 0) this.setState({streetErrorText: "Straat mag niet leeg zijn!"});
        else this.setState({streetErrorText: "", street: e.target.value, streetDummy: e.target.value});
    }

    updateCity = (e) =>{ 
        if (e.target.value.length <= 0) this.setState({cityErrorText: "Stad mag niet leeg zijn!", city: e.target.value, cityDummy: e.target.value});
        else this.setState({cityErrorText: "", city: e.target.value, cityDummy: e.target.value});
    }

    updatePhone = (e) =>{ 
        if (e.target.value.substring(0,1) == 0) {   
            this.setState({phoneErrorText: ""});        
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
        if (e.target.value.length <= 0) this.setState({phoneErrorText: "Telefoonnummer mag niet leeg zijn!"});       
        else if (e.target.value.substring(0, 1) != 0) this.setState({phoneErrorText: "Telefoonnummer moet met 0 beginnen!"});
        else {
            this.setState({phone: e.target.value, phoneDummy: e.target.value, phoneErrorText: ""});
            if (this.state.phone.length === 11) this.setState({phoneValid: true})
        }
    }

    updateEmail = (e) =>{ 
        if (e.target.value.length <= 0) this.setState({emailErrorText: "Email mag niet leeg zijn!"});       
        else { 
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var valid =  re.test(String(e.target.value).toLowerCase());
            if (!valid) {
                this.setState({ emailClasses: "errorFillIn" });
                this.setState({ emailClassesCard: "errorFillInCard" });
                this.setState({ emailErrorText: "Ongeldig Emailadres!" }); 
            } else {
                this.setState({ emailClasses: "" });
                this.setState({ emailClassesCard: "" });
                this.setState({ emailErrorText: "" }); 
            }
            this.setState({email: e.target.value, emailDummy: e.target.value});
        }
    }

    updateRRN = (e) =>{
        if (e.target.value.length === 2 || e.target.value.length === 5 || e.target.value.length === 12) e.target.value += "."; 
        else if (e.target.value.length === 8) e.target.value += "-";
        this.setState({RRN: e.target.value, RRNDummy: e.target.value});
    }

    updateRRNOnChange = (e) => {
        if (e.target.value.length <= 0) this.setState({RRNErrorText: "Rijksregisternummer mag niet leeg zijn!"});     
        else {
            this.setState({RRNErrorText: "", RRN: e.target.value, RRNDummy: e.target.value});
            if(e.target.value.length === 15) {
                var numb = parseInt(e.target.value.substring(0, 12).replace(/\./g, "").replace("-", "")); 
                if (97 - (numb % 97) !== parseInt(e.target.value.substring(13, 15))) {
                    this.setState({ RRNClasses: "errorFillIn" });
                    this.setState({ RRNClassesCard: "errorFillInCard" });
                    this.setState({ RRNErrorText: "Ongeldig Rijksregisternummer!" }); 
                    this.setState({ RRNValid: false }); 
                }       
                else {
                    this.setState({ RRNClasses: "" });
                    this.setState({ RRNClassesCard: "" });
                    this.setState({ RRNErrorText: "" }); 
                    this.setState({ RRNValid: true }); 
                }
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
        if (e.target.value.length <= 0) this.setState({buildingStreetErrorText: "Straat mag niet leeg zijn!"});
        else this.setState({buildingStreetErrorText: "", buildingStreet: e.target.value, buildingStreetDummy: e.target.value});
    }

    updateBuildingCity = (e) =>{ 
        if (e.target.value.length <= 0) this.setState({buildingCityErrorText: "Stad mag niet leeg zijn!", buildingCity: e.target.value, buildingCityDummy: e.target.value});
        else this.setState({buildingCityErrorText: "", buildingCity: e.target.value, buildingCityDummy: e.target.value});
    }

    updateAard = (e) =>{ 
        if (e.target.value.length <= 0) this.setState({aardErrorText: "Aard mag niet leeg zijn!"});
        else this.setState({aardErrorText: "", aard: e.target.value, aardDummy: e.target.value});
    }
    
    componentDidMount () {
        this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
            console.log(user.uid);
            this.setState({userUid: user.uid});        
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
    pushForm = (e) => {                
        const newArray = [];
        for (var i = 0;i < this.state.dossierNrs.length; i++){
            newArray.push(parseInt(this.state.dossierNrs[i].dossierNr.split('/')[1]));
            console.log(parseInt(this.state.dossierNrs[i].dossierNr.split('/')[1]));
        }
        var maxDossierNr = (parseInt(Math.max.apply(Math, newArray))) + 1;
        if (this.state.dossierNrs.length === 0) maxDossierNr = 1;
        console.log(maxDossierNr);
        
        let now = new Date();
        let newDossierNr = now.getFullYear() + "/" + maxDossierNr;
        this.setState({lastDossierNr: newDossierNr});  

        e.preventDefault();
        let item = {
            userUid: this.state.userUid,
            name: this.state.name,
            familyName: this.state.familyName,
            street: this.state.street,
            city: this.state.city,
            RRN: this.state.RRN,
            BTW: this.state.BTW,
            phone: this.state.phone,
            email: this.state.email,
            buildingStreet: this.state.buildingStreet,
            buildingCity: this.state.buildingCity,
            aard: this.state.aard,
            dossierNr: newDossierNr,
        }
        firebase.database().ref('plannen').push(item);
        this.setState({openSnackbar: true, openPreview: false});
    }

    componentWillMount (){
        const dossiern = this.state.dossierNrs;

        this.database.on('child_added', snapshot => {
            if (snapshot.val().userUid === this.state.userUid){
                dossiern.push({
                    dossierNr: snapshot.val().dossierNr,
                })
            }
        })
        this.setState({dossierNrs: dossiern});
    }

    handleOpenPreview () {
        if (!/\d/.test(this.state.street)) this.setState({streetErrorText: "Deze straat bevat geen huisnummer!"});
        else this.state.streetErrorText = "";

        if (!/\d/.test(this.state.buildingStreet)) this.state.buildingStreetErrorText = "Deze straat bevat geen huisnummer!";
        else this.state.buildingStreetErrorText = "";

        if (!/\d/.test(this.state.city)){this.state.cityErrorText = "Deze Stad bevat geen Postcode!";}
        else this.state.cityErrorText = "";

        if (!/\d/.test(this.state.buildingCity)) this.state.buildingCityErrorText = "Deze Stad bevat geen Postcode!";
        else this.state.buildingCityErrorText = "";
        
        if (this.state.name.length === 0) this.state.nameErrorText = "Naam mag niet leeg zijn!";
        if (this.state.familyName.length === 0) this.state.familyNameErrorText = "Familienaam mag niet leeg zijn!";
        if (this.state.email.length === 0) this.state.emailErrorText = "Email mag niet leeg zijn!";
        if (this.state.phone.length === 0) this.state.phoneErrorText = "Telefoonnummer mag niet leeg zijn!";
        if (this.state.phone.length < 11) this.state.phoneErrorText = "Telefoonnummer moet min. 9 lang zijn!";
        if (this.state.street.length === 0) this.state.streetErrorText = "Straat mag niet leeg zijn!";
        if (this.state.city.length === 0) this.state.cityErrorText = "Stad mag niet leeg zijn!";
        if (this.state.RRN.length === 0) this.state.RRNErrorText = "Rijksregisternummer mag niet leeg zijn!";
        if (this.state.RRN.length < 15) this.state.RRNErrorText = "Rijksregisternummer moet min. 11 lang zijn!";
        if (this.state.buildingStreet.length === 0) this.state.buildingStreetErrorText = "Straat mag niet leeg zijn!";
        if (this.state.buildingCity.length === 0) this.state.buildingCityErrorText = "Stad mag niet leeg zijn!";
        if (this.state.aard.length === 0) this.state.aardErrorText = "Aard mag niet leeg zijn!";
        if(
            this.state.nameErrorText == "" &&
            this.state.familyNameErrorText == "" &&
            this.state.streetErrorText == "" &&
            this.state.cityErrorText == "" &&
            this.state.phoneErrorText == "" &&
            this.state.emailErrorText == "" &&
            this.state.RRNErrorText == "" &&
            this.state.buildingStreetErrorText == "" &&
            this.state.buildingCityErrorText == "" &&
            this.state.aardErrorText == ""
        ) { this.setState({openPreview: true});}
    };

    handleClosePreview = () => {
        this.setState({openPreview: false});
    };

    handleOpenSnackbar = () => {
        this.setState({ openSnackbar: true });
      };
    
    handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        this.setState({ openSnackbar: false });
    };

    render() {
        const actions = [
            <FlatButton
              label="Annuleer"
              secondary={true}
              onClick={this.handleClosePreview}
            />,
            <FlatButton
                label="Opslaan"
                primary={true}
                keyboardFocused={true}
                onClick={this.pushForm}
          />,
        ];

        return (            
            <div>
                <section className="form__ContainerNewPlan"> 
                    <form className="formNewPlan" >
                        <div className="form__PersonalNewPlan">
                            <TextField
                                name="familyName"
                                floatingLabelText="Naam *"
                                className="form__TextField__NewPlan"
                                onChange={this.updateFamilyName}    
                                errorText={this.state.familyNameErrorText}
                            />
                            <TextField
                                name="name"
                                floatingLabelText="Voornaam *"
                                className="form__TextField__NewPlan"
                                onChange={this.updateName}
                                errorText={this.state.nameErrorText}
                            />
                            <TextField
                                name="street"
                                id="street"
                                floatingLabelText="Straat + Nummer *"
                                className="form__TextField__NewPlan"
                                onChange={this.updateStreet}
                                type="text"
                                placeholder=""
                                errorText={this.state.streetErrorText}
                            />
                            <TextField
                                name="city"
                                floatingLabelText="Postcode + Stad *"
                                className="form__TextField__NewPlan"
                                onChange={this.updateCity}
                                value={this.state.city}
                                errorText={this.state.cityErrorText}
                            />
                            <TextField
                                name="phone"
                                id="phone"
                                floatingLabelText="Telefoon *"
                                className="form__TextField__NewPlan"
                                maxLength="12"
                                onKeyPress={this.updatePhone}
                                onChange={this.updatePhoneOnChange}
                                errorText={this.state.phoneErrorText}
                            />
                            <TextField
                                name="email"
                                floatingLabelText="Email *"
                                className="form__TextField__NewPlan"
                                onChange={this.updateEmail}
                                type="email"
                                errorText={this.state.emailErrorText}
                                Autocomplete="off"
                            />
                            <TextField
                                name="BTW"
                                floatingLabelText="BTW Nummer"
                                className={"form__TextField__NewPlan " + this.state.BTWClasses }
                                onKeyPress={this.updateBTW}
                                maxLength="12"
                                errorText={this.state.BTWErrorText}
                            />
                            <TextField
                                name="RRN"
                                floatingLabelText="Rijksregisternummer *"
                                className={"form__TextField__NewPlan RRNNewPlan " + this.state.RRNClasses }
                                onKeyPress={this.updateRRN}
                                onChange={this.updateRRNOnChange}
                                maxLength="15"
                                errorText={this.state.RRNErrorText}
                            />
                        </div>
                        <div className="border"></div>
                        <div className="form__PlanNewPlan">
                            <TextField
                                name="buildingStreet"
                                id="buildingStreet"
                                floatingLabelText="Ligging *"
                                className="form__TextField__NewPlan buildingStreetNewPlan"
                                onChange={this.updateBuildingStreet}
                                placeholder=""
                                errorText={this.state.buildingStreetErrorText}
                            />
                            <TextField
                                name="buildingCity"
                                floatingLabelText="Bouwplaats *"
                                className="form__TextField__NewPlan"
                                onChange={this.updateBuildingCity}
                                value={this.state.buildingCity}
                                errorText={this.state.buildingCityErrorText}
                            />
                            <TextField
                                name="Aard"
                                floatingLabelText="Aard *"
                                className="form__TextField__NewPlan"
                                onChange={this.updateAard}
                                errorText={this.state.aardErrorText}
                            />
                        </div>
                        <div >
                            <Dialog
                                actions={actions}
                                modal={false}
                                open={this.state.openPreview}
                                onRequestClose={this.handleClosePreview}
                                className="parent"
                            >
                            <div>
                                <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange} className="contactCard">
                                    <CardTitle className="title" title={this.state.name + " " + this.state.familyName} expandable={true}/>
                                    <CardText className="Text" expandable={true}>
                                        <div className="infoNewPlan personalInfoNewPlan">
                                            <div> 
                                                <img src={HomeIcon} alt="Address Icon" className="addressContactCardImg"/>
                                                <div className="addressContactCard">{this.state.street}<br/>
                                                {this.state.city}</div>
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
                                                {this.state.BTW.length > 0 &&
                                                    <div className={ this.state.BTWClasses }>{this.state.BTWDummy}</div>
                                                }
                                                {this.state.BTW.length == 0 &&
                                                    <div className={ this.state.BTWClasses }>{this.state.BTW}</div>
                                                }                                           
                                            </div>
                                            <div>
                                                <img src={RRNIcon} alt="RRN Icon"/>
                                                <div className={ this.state.RRNClassesCard }>{this.state.RRNDummy}</div>
                                            </div>
                                        </div>
                                        <div></div>
                                        <div className="infoNewPlan buildingInfoNewPlan">
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
                                    </CardText>
                                </Card>
                            </div>
                            </Dialog>
                        </div>

                        <div className="SubmitButton">                        
                            <input value="NIEUW PLAN" onClick={this.handleOpenPreview} className="RaisedButton"/>
                        </div>
                    </form>

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
                        message={<span id="message-id">{this.state.name + " " + this.state.familyName + "  -  " + this.state.lastDossierNr +  " Aangemaakt!"}</span>}
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
  export default withRouter(NewPlan)