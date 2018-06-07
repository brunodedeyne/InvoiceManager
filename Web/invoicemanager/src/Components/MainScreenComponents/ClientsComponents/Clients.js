// Import Default Components
import React from 'react';
import Parser from 'html-react-parser';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

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
  Close as CloseIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  ExpandLess,
  ExpandMore,
} from "@material-ui/icons";

// Import Material UI Components
import { lighten } from '@material-ui/core/styles/colorManipulator';

import {
  Paper,
  Tooltip,
  Collapse,
  Snackbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
} from '@material-ui/core';

import {
  TextField,
} from 'material-ui';

// Import Database
import * as firebase from 'firebase';
import * as routes from '../../../constants/routes/routes';

// Import CSS
import './Clients.css';

class Clients extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      data: [].sort((a, b) => (a.dossierNr < b.dossierNr ? -1 : 1)),
      clientData: [],
      selectedName: '',
      selectedFamilyName: '',
      selectedStreet: '',
      selectedCity: '',
      selectedPhone: '',
      selectedEmail: '',
      selectedBTW: '',
      selectedRRN: '',
      selectedBuildingStreet: '',
      selectedBuildingCity: '',
      selectedAard: '',
      selectedDossierNr: '',
      selectedKey: '',
      nameErrorText: '',
      familyNameErrorText: '',
      streetErrorText: '',
      cityErrorText: '',
      phoneErrorText: '',
      emailErrorText: '',
      RRNErrorText: '',
      buildingStreetErrorText: '',
      buildingCityErrorText: '',
      aardErrorText: '',
      userUid: '',
      openDeleteClient: false,
      invoices: [],
      data: []
    };
    this.database = firebase.database().ref('/plannen');
    this.handleEditPlan = this.handleEditPlan.bind(this);
    this.fillData = this.fillData.bind(this);
  }

  componentWillMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      if (user) this.setState({ userUid: user.uid });
    });
  }

  componentDidMount() {
    this.fillData();
  }

  fillData() {
    let items = [];
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      if (user) this.setState({ userUid: user.uid });
      let items = [];
      this.database.on('value', (snapshot) => {
        items = Object.entries(snapshot.val()).map((item, i) => {
          if (user) {
            if (item[1].userUid == user.uid) {
              var itemKey = item[0];
              item = item[1];
              item.key = itemKey;
              item.fullName = item.name + " " + item.familyName;
              item.address = item.street + `<br />` + item.city;
              item.buildingAddress = item.buildingStreet + '<br />' + item.buildingCity;
              return item;
            }
          }
        });
        items = items.filter(Boolean);
        this.setState({ data: items })
      });
    });
  }

  handleClientInfo(event, id) {
    this.state.nameErrorText == "";
    this.state.familyNameErrorText == "";
    this.state.streetErrorText == "";
    this.state.cityErrorText == "";
    this.state.phoneErrorText == "";
    this.state.emailErrorText == "";
    this.state.RRNErrorText == "";
    this.state.buildingStreetErrorText == "";
    this.state.buildingCityErrorText == "";
    this.state.aardErrorText == "";
    this.state.clientData = [];
    for (var i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].key === id) {
        //this.setState({
        this.state.selectedName = this.state.data[i].name;
        this.state.selectedFamilyName = this.state.data[i].familyName;
        this.state.selectedStreet = this.state.data[i].street;
        this.state.selectedCity = this.state.data[i].city;
        this.state.selectedFity = this.state.data[i].city;
        this.state.selectedPhone = this.state.data[i].phone;
        this.state.selectedEmail = this.state.data[i].email;
        this.state.selectedBTW = this.state.data[i].BTW;
        this.state.selectedRRN = this.state.data[i].RRN;
        this.state.selectedBuildingStreet = this.state.data[i].buildingStreet;
        this.state.selectedBuildingCity = this.state.data[i].buildingCity;
        this.state.selectedAard = this.state.data[i].aard;
        this.state.selectedDossierNr = this.state.data[i].dossierNr;
        this.state.selectedKey = this.state.data[i].key;
        //});        
      }
      this.setState({ openPlanEdit: true });
    }
  }

  updateName = (e) => {
    if (e.target.value.length <= 0) this.setState({ nameErrorText: "Naam mag niet leeg zijn!", selectedName: e.target.value });
    else this.setState({ nameErrorText: "", selectedName: e.target.value });
  }

  updateFamilyName = (e) => {
    if (e.target.value.length <= 0) this.setState({ familyNameErrorText: "Familienaam mag niet leeg zijn!", selectedFamilyName: e.target.value });
    else this.setState({ familyNameErrorText: "", selectedFamilyName: e.target.value });
  }

  updateStreet = (e) => {
    if (e.target.value.length <= 0) this.setState({ streetErrorText: "Straat mag niet leeg zijn!", selectedStreet: e.target.value });
    else this.setState({ streetErrorText: "", selectedStreet: e.target.value });
  }

  updateCity = (e) => {
    if (e.target.value.length <= 0) this.setState({ cityErrorText: "Stad mag niet leeg zijn!", selectedCity: e.target.value });
    else this.setState({ cityErrorText: "", selectedCity: e.target.value });
  }

  updatePhone = (e) => {
    if (e.target.value.substring(0, 1) == 0) {
      this.setState({ phoneErrorText: "" });
      if (parseInt(e.target.value.substring(1, 2)) !== 4) {
        if (e.target.value.length === 6 || e.target.value.length === 9) e.target.value += ".";
        if (e.target.value.length === 3) e.target.value += "/";
      }
      if (parseInt(e.target.value.substring(1, 2)) === 4) {
        if (e.target.value.length === 8) e.target.value += ".";
        if (e.target.value.length === 4) e.target.value += "/";
      }
      this.setState({ selectedPhone: e.target.value });
    }
  }

  updatePhoneOnChange = (e) => {
    if (e.target.value.length <= 0) this.setState({ phoneErrorText: "Telefoonnummer mag niet leeg zijn!", selectedPhone: e.target.value });
    else if (e.target.value.substring(0, 1) != 0) this.setState({ phoneErrorText: "Telefoonnummer moet met 0 beginnen!", selectedPhone: e.target.value });
    else {
      this.setState({ selectedPhone: e.target.value, phoneErrorText: "" });
      if (this.state.selectedPhone.length === 11) this.setState({ phoneValid: true })
    }
  }

  updateEmail = (e) => {
    if (e.target.value.length <= 0) this.setState({ emailErrorText: "Email mag niet leeg zijn!", selectedEmail: e.target.value });
    else {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var valid = re.test(String(e.target.value).toLowerCase());
      if (!valid) {
        this.setState({ emailClasses: "errorFillIn" });
        this.setState({ emailClassesCard: "errorFillInCard" });
        this.setState({ emailErrorText: "Ongeldig Emailadres!" });
      } else {
        this.setState({ emailClasses: "" });
        this.setState({ emailClassesCard: "" });
        this.setState({ emailErrorText: "" });
      }
      this.setState({ selectedEmail: e.target.value });
    }
  }

  updateRRN = (e) => {
    if (e.target.value.length === 2 || e.target.value.length === 5 || e.target.value.length === 12) e.target.value += ".";
    else if (e.target.value.length === 8) e.target.value += "-";
    this.setState({ selectedRRN: e.target.value });
  }

  updateRRNOnChange = (e) => {
    if (e.target.value.length <= 0) this.setState({ RRNErrorText: "Rijksregisternummer mag niet leeg zijn!", selectedRRN: e.target.value });
    else {
      this.setState({ RRNErrorText: "", selectedRRN: e.target.value });
      if (e.target.value.length === 15) {
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

  updateBTW = (e) => {
    if (e.target.value.substring(0, 1) == 0) {
      if (e.target.value.length === 4 || e.target.value.length === 8) e.target.value += ".";
      this.setState({ selectedBTW: "BE " + e.target.value });
    }
    if (e.target.value.substring(0, 1) != 0) {
      if (e.target.value.length === 3 || e.target.value.length === 7) e.target.value += ".";
      this.setState({ selectedBTW: "BE 0" + e.target.value });
    }
  }

  updateBuildingStreet = (e) => {
    if (e.target.value.length <= 0) this.setState({ buildingStreetErrorText: "Straat mag niet leeg zijn!", selectedBuildingStreet: e.target.value });
    else this.setState({ buildingStreetErrorText: "", selectedBuildingStreet: e.target.value });
  }

  updateBuildingCity = (e) => {
    if (e.target.value.length <= 0) this.setState({ buildingCityErrorText: "Stad mag niet leeg zijn!", selectedBuildingCity: e.target.value });
    else this.setState({ buildingCityErrorText: "", selectedBuildingCity: e.target.value });
  }

  updateAard = (e) => {
    if (e.target.value.length <= 0) this.setState({ aardErrorText: "Aard mag niet leeg zijn!", selectedAard: e.target.value });
    else this.setState({ aardErrorText: "", selectedAard: e.target.value });
  }

  handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ openSnackbar: false });
  };

  handleDeleteClient = () => {
    firebase.database().ref().child('/plannen/' + this.state.selectedKey).remove();
    const allInvoices = this.state.invoices;
    firebase.database().ref('/invoices').on('child_added', snapshot => {

      if (snapshot.val().planKey === this.state.selectedKey) {
        allInvoices.push({
          key: snapshot.key,
        })
      }
      this.setState({ invoices: allInvoices });
    })

    for (var i = 0; i < this.state.invoices.length; i++) {
      firebase.database().ref().child('/invoices/' + this.state.invoices[i].key).remove();
    }

    this.setState({
      openPlanEdit: false,
      openDeleteClient: false,
      snackBarContent: "Cliënt & facturen verwijderd!",
      openSnackbar: true
    })
  }

  handleEditPlan = () => {
    if (!/\d/.test(this.state.selectedStreet)) this.setState({ streetErrorText: "Deze straat bevat geen huisnummer!" });
    else this.state.streetErrorText = "";

    if (!/\d/.test(this.state.selectedBuildingStreet)) this.state.buildingStreetErrorText = "Deze straat bevat geen huisnummer!";
    else this.state.buildingStreetErrorText = "";

    if (!/\d/.test(this.state.selectedCity)) { this.state.cityErrorText = "Deze Stad bevat geen Postcode!"; }
    else this.state.cityErrorText = "";

    if (!/\d/.test(this.state.selectedBuildingCity)) this.state.buildingCityErrorText = "Deze Stad bevat geen Postcode!";
    else this.state.buildingCityErrorText = "";

    if (this.state.selectedName.length === 0) this.state.nameErrorText = "Naam mag niet leeg zijn!";
    if (this.state.selectedFamilyName.length === 0) this.state.familyNameErrorText = "Familienaam mag niet leeg zijn!";
    if (this.state.selectedEmail.length === 0) this.state.emailErrorText = "Email mag niet leeg zijn!";
    if (this.state.selectedPhone.length === 0) this.state.phoneErrorText = "Telefoonnummer mag niet leeg zijn!";
    if (this.state.selectedPhone.length < 11) this.state.phoneErrorText = "Telefoonnummer moet min. 9 lang zijn!";
    if (this.state.selectedStreet.length === 0) this.state.streetErrorText = "Straat mag niet leeg zijn!";
    if (this.state.selectedCity.length === 0) this.state.cityErrorText = "Stad mag niet leeg zijn!";
    if (this.state.selectedRRN.length === 0) this.state.RRNErrorText = "Rijksregisternummer mag niet leeg zijn!";
    if (this.state.selectedRRN.length < 15) this.state.RRNErrorText = "Rijksregisternummer moet min. 11 lang zijn!";
    if (this.state.selectedBuildingStreet.length === 0) this.state.buildingStreetErrorText = "Straat mag niet leeg zijn!";
    if (this.state.selectedBuildingCity.length === 0) this.state.buildingCityErrorText = "Stad mag niet leeg zijn!";
    if (this.state.selectedAard.length === 0) this.state.aardErrorText = "Aard mag niet leeg zijn!";
    if (
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
    ) {
      firebase.database().ref().child('/plannen/' + this.state.selectedKey)
        .set({
          dossierNr: this.state.selectedDossierNr,
          name: this.state.selectedName,
          familyName: this.state.selectedFamilyName,
          street: this.state.selectedStreet,
          city: this.state.selectedCity,
          email: this.state.selectedEmail,
          phone: this.state.selectedPhone,
          RRN: this.state.selectedRRN,
          BTW: this.state.selectedBTW,
          buildingStreet: this.state.selectedBuildingStreet,
          buildingCity: this.state.selectedBuildingCity,
          aard: this.state.selectedAard,
          dossierNr: this.state.selectedDossierNr,
          userUid: this.state.userUid
        });
      this.setState({
        openPlanEdit: false,
        snackBarContent: "Plan van " + this.state.selectedName + " " + this.state.selectedFamilyName + " is aangepast!"
      });
    }
  }

  handleClickExpand = (e) => {
    this.setState({ [e]: !this.state[e] });
  };

  render() {
    const { data} = this.state;

    return (
      <div>
        <div className="ContainerClients">
          <Paper className="root">
            <div className="tableWrapper">
              <List>
                {data == "" ? <div>
                  <ListItem
                    role={undefined}
                    dense
                    button
                  >
                    <ListItemText
                      primary={"Geen items te vinden voor deze filter"}
                    />
                  </ListItem>
                </div> : ""}
                {data.map(value => (
                  <div>
                    <ListItem
                      key={value}
                      role={undefined}
                      onClick={this.handleClickExpand.bind(this, value.fullName + "_" + value.aard)}
                      button
                    >
                      <EditIcon
                        color="secondary"
                        onClick={event => this.handleClientInfo(event, value.key)}
                      />
                      <ListItemText
                        primary={value.dossierNr}
                        secondary={value.fullName}
                      />
                      {this.state[value.fullName + "_" + value.aard] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Divider />
                    <Collapse key={data.values.key + "_" + value.aard} in={this.state[value.fullName + "_" + value.aard]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem className="containerInfo" button>
                          <FullNameIcon className="icon" /><p>{value.fullName}</p><br />
                          <DossierIcon className="icon" /><p>{value.dossierNr}</p><br />
                          <AddressIcon className="icon addressIcon" /><p>{value.street}<br />{value.city}</p><br />
                          <EmailIcon className="icon" /><p>{value.email}</p><br />
                          <PhoneIcon className="icon" /><p>{value.phone}</p><br />
                          <BTWIcon className="icon" /><p>{value.BTW ? value.BTW : "Geen BTW"}</p><br />
                          <RRNIcon className="icon" /><p>{value.RRN}</p><br />
                          <BuildingAddressIcon className="icon buildingAddressIcon" /><p>{value.buildingStreet}<br />{value.buildingCity}</p><br />
                          <AardIcon className="icon" /><p>{value.aard}</p><br />
                        </ListItem>
                      </List>
                    </Collapse>
                    <Divider />
                  </div>
                ))}
              </List>
            </div>
          </Paper>
          <Dialog
            fullScreen={window.innerWidth <= 600 ? true : false}
            open={this.state.openPlanEdit}
            onRequestClose={this.handleCloseEditPlan}
            autoScrollBodyContent={true}
          >
            <DialogContent>
              <div className="formEditPlan">
                <TextField
                  name="familyName"
                  floatingLabelText="Naam *"
                  className="form__TextField__NewPlan form__TextField__EditPlan"
                  onChange={this.updateFamilyName}
                  errorText={this.state.familyNameErrorText}
                  value={this.state.selectedFamilyName}
                />
                <TextField
                  name="name"
                  floatingLabelText="Voornaam *"
                  className=" form__TextField__EditPlan"
                  onChange={this.updateName}
                  errorText={this.state.nameErrorText}
                  value={this.state.selectedName}
                />
                <TextField
                  name="street"
                  id="street"
                  floatingLabelText="Straat + Nummer *"
                  className=" form__TextField__EditPlan"
                  onChange={this.updateStreet}
                  type="text"
                  placeholder=""
                  errorText={this.state.streetErrorText}
                  value={this.state.selectedStreet}
                />
                <TextField
                  name="city"
                  floatingLabelText="Postcode + Stad *"
                  className=" form__TextField__EditPlan"
                  onChange={this.updateCity}
                  value={this.state.city}
                  errorText={this.state.cityErrorText}
                  value={this.state.selectedCity}
                />
                <TextField
                  name="phone"
                  id="phone"
                  floatingLabelText="Telefoon *"
                  className=" form__TextField__EditPlan"
                  maxLength="12"
                  onKeyPress={this.updatePhone}
                  onChange={this.updatePhoneOnChange}
                  errorText={this.state.phoneErrorText}
                  value={this.state.selectedPhone}
                />
                <TextField
                  name="email"
                  floatingLabelText="Email *"
                  className=" form__TextField__EditPlan"
                  onChange={this.updateEmail}
                  type="email"
                  errorText={this.state.emailErrorText}
                  value={this.state.selectedEmail}
                />
                <TextField
                  name="BTW"
                  floatingLabelText="BTW Nummer"
                  className={" form__TextField__EditPlan " + this.state.BTWClasses}
                  onKeyPress={this.updateBTW}
                  maxLength="12"
                  errorText={this.state.BTWErrorText}
                  value={this.state.selectedBTW}
                />
                <TextField
                  name="RRN"
                  floatingLabelText="Rijksregisternummer *"
                  className={" RRNNewPlan form__TextField__EditPlan " + this.state.RRNClasses}
                  onKeyPress={this.updateRRN}
                  onChange={this.updateRRNOnChange}
                  maxLength="15"
                  errorText={this.state.RRNErrorText}
                  value={this.state.selectedRRN}
                />
                <TextField
                  name="buildingStreet"
                  id="buildingStreet"
                  floatingLabelText="Ligging *"
                  className=" form__TextField__EditPlan buildingStreetEditPlan"
                  onChange={this.updateBuildingStreet}
                  placeholder=""
                  errorText={this.state.buildingStreetErrorText}
                  value={this.state.selectedBuildingStreet}
                />
                <TextField
                  name="buildingCity"
                  floatingLabelText="Bouwplaats *"
                  className=" form__TextField__EditPlan buildingCityEditPlan"
                  onChange={this.updateBuildingCity}
                  value={this.state.buildingCity}
                  errorText={this.state.buildingCityErrorText}
                  value={this.state.selectedBuildingCity}
                />
                <TextField
                  name="Aard"
                  floatingLabelText="Aard *"
                  className="aardEditPlan form__TextField__EditPlan"
                  onChange={this.updateAard}
                  errorText={this.state.aardErrorText}
                  value={this.state.selectedAard}
                />
              </div>
            </DialogContent>
            <DialogActions className="actionsEdit">
              <Button
                variant="contained"
                color="secondary"
                keyboardFocused={true}
                onClick={() => this.setState({ openDeleteClient: true })}
                className="deleteClient"
              >Verwijder</Button>
              <Button
                color="secondary"
                onClick={() => this.setState({ openPlanEdit: false })}
                className="cancelButtonClients"
              >Annuleer</Button>
              <Button
                color="primary"
                keyboardFocused={true}
                onClick={this.handleEditPlan}
              >Opslaan</Button>
            </DialogActions>
          </Dialog>

          <Dialog
            modal={false}
            open={this.state.openDeleteClient}
            onRequestClose={() => this.setState({ openDeleteClient: false })}
          >
            <DialogContent>
              {"Wilt u " + this.state.selectedName + " " + this.state.selectedFamilyName + " - " + this.state.selectedDossierNr + " & Facturen Verwijderen?"}
            </DialogContent>
            <DialogActions>
              <Button
                color="primary"
                onClick={() => this.setState({ openDeleteClient: false })}
              >Annuleer</Button>
              <Button
                color="secondary"
                keyboardFocused={true}
                onClick={this.handleDeleteClient}
              >Verwijder</Button>
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
        </div>
      </div>
    );
  }
}

export default Clients;