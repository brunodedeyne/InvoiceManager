// Import Default Components
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import Icons
import {
  Info as AardIcon,
  Fingerprint as DossierIcon,
  Check as DatePaidIcon,
  DateRange as DateCreatedIcon,
  EuroSymbol as FeeIcon,
  AccountCircle as NameIcon,
  Close as CloseIcon,
  GetApp as DownloadButton,
  ExpandLess,
  ExpandMore
} from "@material-ui/icons";

import jsPDF from 'jspdf';

import {
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Snackbar,
  IconButton,
  Collapse,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  ListItemText,
  ListItem,
  List,
  Dialog,
  Divider,
  Paper,
  withStyles
} from '@material-ui/core';



// Import Database
import * as firebase from 'firebase';

// Import CSS
import './Invoices.css';

class Invoices extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      userUid: '',
      plannen: [],
      invoices: [],
      dataPlannen: [],
      dataInvoices: [],
      data: [],
      openConfirmationDialogPaid: false,
      paimentId: '',
      paimentInvoice: [],
      openSnackbar: false,
      snackBarContent: '',
      kwartaal: '',
      paid: '',
      confirmOrCancel: false,
      checked: [0],
    };
    this.database = firebase.database().ref('/invoices');
    this.filterData = this.filterData.bind(this);
    this.getData = this.getData.bind(this);
    this.generateInvoice = this.generateInvoice.bind(this);
  }

  componentWillMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      if (user) this.setState({ userUid: user.uid });
    });
  }

  async componentDidMount() {
    await this.getData();
  }

  async getData() {
    let itemsInvoices = [];
    let itemsPlannen = [];
    let tempData = [];
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      firebase.database().ref('/invoices').on('value', (snapshotInvoices) => {
        itemsInvoices = Object.entries(snapshotInvoices.val()).map((itemInvoices, iInvoices) => {
          if (user) {
            if (user.uid == itemInvoices[1].userUid) {
              var invoiceKey = itemInvoices[0];
              itemInvoices = itemInvoices[1];
              itemInvoices.key = invoiceKey;
              return itemInvoices;
            }
          }
        });
        itemsInvoices = itemsInvoices.filter(Boolean);
        this.setState({ dataInvoices: itemsInvoices });

        firebase.database().ref('/plannen').on('value', (snapshotPlannen) => {
          itemsPlannen = Object.entries(snapshotPlannen.val()).map((itemPlannen, iPlannen) => {
            if (user) {
              if (user.uid == itemPlannen[1].userUid) {
                itemPlannen = itemPlannen[1];
                itemPlannen.key = iPlannen;
                return itemPlannen;
              }
            }
          });
          itemsPlannen = itemsPlannen.filter(Boolean);
          this.setState({ dataPlannen: itemsPlannen });

          let combinedInvoices = [];
          for (var i = 0; i < itemsInvoices.length; i++) {
            for (var j = 0; j < itemsPlannen.length; j++) {
              if (itemsPlannen[j].key == itemsInvoices[i].planKey) {
                combinedInvoices.push({
                  invoiceInfo: itemsInvoices[i],
                  planInfo: itemsPlannen[j]
                })
              }
            }
          }
          tempData = combinedInvoices;
          this.setState({ data: tempData });
        });
      });
    });
  }

  pushPaiment = () => {
    const paidInvoice = [];

    let now = new Date();
    let val = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    var tempDate = '';

    for (var i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].invoiceInfo.key === this.state.paimentId) {
        if (this.state.confirmOrCancel) tempDate = val;
        else tempDate = ""
        paidInvoice.push({
          invoiceInfo: this.state.data[i].invoiceInfo,
          paimentId: this.state.paimentId,
          datePaid: tempDate,
        });
      }
    }
    firebase.database().ref().child('/invoices/' + paidInvoice[0].paimentId)
      .set({
        aardInvoice: paidInvoice[0].invoiceInfo.aardInvoice,
        dateCreated: paidInvoice[0].invoiceInfo.dateCreated,
        datePaid: paidInvoice[0].datePaid,
        fee: paidInvoice[0].invoiceInfo.fee,
        planKey: paidInvoice[0].invoiceInfo.planKey,
        userUid: paidInvoice[0].invoiceInfo.userUid
      });
    this.setState({
      openConfirmationDialogPaid: false,
      openSnackbar: true,
    });
  }

  handleOpenConfirmationDialogPaid = (event, id, datePaid) => {
    var selectedFullName = '';
    var selectedFee = '';
    for (var i = 0; i < this.state.data.length; i++) {
      if (id == this.state.data[i].invoiceInfo.key) {
        selectedFullName = this.state.data[i].planInfo.familyName + " " + this.state.data[i].planInfo.name,
          selectedFee = this.state.data[i].invoiceInfo.fee,
          this.setState({
            confirmOrCancel: datePaid ? false : true,
            openConfirmationDialogPaid: true,
            paimentId: id,
            snackBarContent: "Factuur van " + this.state.data[i].planInfo.familyName + " " + this.state.data[i].planInfo.name + "  -  €" + this.state.data[i].invoiceInfo.fee + " Is betaald!",
            selectedDatePaid: datePaid,
            selectedFullName,
            selectedFee
          });
      }
    }
  }

  handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ openSnackbar: false });
  };

  isOfKwartaal(item) {
    if (this.state.kwartaal === "" || this.state.kwartaal == 0) return true;
    if (this.state.kwartaal === 1) {
      if (item.dateCreated.split('/')[1] >= 1 && item.dateCreated.split('/')[1] <= 3) {
        return true;
      }
    }
    else if (this.state.kwartaal === 2) {
      if (item.dateCreated.split('/')[1] >= 4 && item.dateCreated.split('/')[1] <= 6) {
        return true;
      }
    }
    else if (this.state.kwartaal === 3) {
      if (item.dateCreated.split('/')[1] >= 7 && item.dateCreated.split('/')[1] <= 9) {
        return true;
      }
    }
    else if (this.state.kwartaal === 4) {
      if (item.dateCreated.split('/')[1] >= 10 && item.dateCreated.split('/')[1] <= 12) {
        return true;
      }
    }

    return false;
  }

  isPaid(item) {
    if (this.state.paid === "" || this.state.paid == 5) {
      return true;
    }
    else if (this.state.paid == 0) {
      if (item.datePaid == "") {
        return true;
      }
    }
    else if (this.state.paid == 1) {
      if (item.datePaid != "") {
        return true;
      }
    }
    return false;
  }

  filterData() {
    let filterData = this.state.data.filter(item => (
      this.isOfKwartaal(item) && this.isPaid(item)
    ));
    return filterData;
  }
  handleClickExpand = (e) => {
    this.setState({ [e]: !this.state[e] });
  };

  generateInvoice(id) {
    var selectedInvoice = [];
    for (var i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].invoiceInfo.key == id) selectedInvoice = this.state.data[i];
    }

    var doc = new jsPDF();

    var imgData = 'data:image/png;base64,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';

    doc.addImage(imgData, 'JPEG', 0, 20, 210, 20);


    doc.setFontSize(13);
    doc.text(12, 37, "Torhout, " + selectedInvoice.invoiceInfo.dateCreated);

    doc.setFontSize(15);
    doc.text(51, 50, "ARCHITECTBUREAU DEDEYNE - COOMANS");

    doc.setFontSize(13);
    doc.text(83, 57, "Oude Gentweg 26a");
    doc.text(91, 63, "8820 Torhout");

    doc.setFontSize(11);
    doc.text(22, 75, "012/34.56.78");
    doc.text(22, 80, "bureau@dedeynecoomans.be");

    doc.text(165, 75, "BTW 123.456.789");
    doc.text(137, 80, "Fortis IBAN BE01 2345 6789 0123");

    doc.setFontSize(15);
    doc.text(90, 93, "Ereloonnota");

    doc.setFontSize(12);
    doc.text(35, 112, "BTW");
    doc.text(35, 128, "Cliënt");
    doc.text(35, 158, "Aard");

    doc.text(80, 112, selectedInvoice.planInfo.BTW);

    doc.text(80, 128, selectedInvoice.planInfo.name + " " + selectedInvoice.planInfo.familyName);
    doc.text(80, 132, selectedInvoice.planInfo.street);
    doc.text(80, 139, selectedInvoice.planInfo.city);
    doc.text(80, 147, selectedInvoice.planInfo.aard);

    doc.text(80, 158, selectedInvoice.planInfo.buildingStreet + ", " + selectedInvoice.planInfo.buildingCity);
    doc.text(80, 163, selectedInvoice.invoiceInfo.aardInvoice);

    doc.setFontSize(11);
    doc.text(25, 200, "Verschuldigd Ereloon");
    doc.text(25, 210, "BTW (21°)");
    doc.text(25, 225, "Totaal");

    doc.setFontSize(10);
    doc.text(170, 200, selectedInvoice.invoiceInfo.fee);
    var btw = (parseInt(selectedInvoice.invoiceInfo.fee) / 100) * 21;
    doc.text(170, 210, btw.toString());
    doc.text(170, 225, (parseInt(selectedInvoice.invoiceInfo.fee) + btw).toString());

    doc.text(25, 250, "Algemene Voorwaarde:");
    doc.text(25, 255, "ERELOONNOTA ZIJN BETAALBAAR BINNEN  14  DAGEN NA FAKTUURDATUM.BIJ NIET TIJDIGE ");
    doc.text(25, 260, "BETALING ZAL VANAF DE VERVALDAG VAN RECHTSWEGE EN ZONDER INGEBREKESTELLING EEN ");
    doc.text(25, 265, "INTREST VAN 1% PER MAAND VERSCHULDIGD ZIJN.");
    doc.text(25, 270, "BIJ GESCHILLEN ZIJN BEVOEGD: VREDEGERECHT TORHOUT EN RECHTBANKEN TE BRUGGE OF ");
    doc.text(25, 275, "OOSTENDE");
    doc.line(0, 190, 210, 190);
doc.line(0, 230, 210, 230);
doc.line(72, 96, 72, 190);
doc.line(0, 96, 210, 96);
doc.line(25, 215, 180, 215);

    doc.save(selectedInvoice.invoiceInfo.dateCreated + "_" + selectedInvoice.planInfo.dossierNr + "_" + selectedInvoice.invoiceInfo.aardInvoice + ".pdf");
  }

  render() {
    const { fullScreen } = this.props;
    const { data } = this.state;
    return (
      <div>
        <form autoComplete="off" className="formInvoices">
          <FormControl className="formControlInvoices">
            <InputLabel htmlFor="age-simple">Kwartaal</InputLabel>
            <Select
              value={this.state.kwartaal}
              onChange={(event) => this.setState({ [event.target.name]: event.target.value })}
              inputProps={{
                name: 'kwartaal',
                id: 'kwartaal',
              }}
            >
              <MenuItem value={0}>Alles</MenuItem>
              <MenuItem value={1}>Kwartaal 1</MenuItem>
              <MenuItem value={2}>Kwartaal 2</MenuItem>
              <MenuItem value={3}>Kwartaal 3</MenuItem>
              <MenuItem value={4}>Kwartaal 4</MenuItem>
            </Select>
          </FormControl>
          <FormControl className="formControlInvoices">
            <InputLabel htmlFor="age-simple">Betalingsstatus</InputLabel>
            <Select
              value={this.state.paid}
              onChange={(event) => this.setState({ [event.target.name]: event.target.value })}
              inputProps={{
                name: 'paid',
                id: 'paid',
              }}
            >
              <MenuItem value={5}>Alles</MenuItem>
              <MenuItem value={1}>Betaald</MenuItem>
              <MenuItem value={0}>Onbetaald</MenuItem>
            </Select>
          </FormControl>
        </form>
        <div className="ContainerInvoices">
          <Paper className="root">

            <div className="tableWrapper">
              <List>
                {this.filterData() == "" ? <div>
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
                {this.filterData().map(value => (
                  <div>
                    <ListItem
                      key={value}
                      role={undefined}
                      onClick={this.handleClickExpand.bind(this, value.invoiceInfo.key)}
                      button
                    >
                      <Checkbox
                        checked={value.invoiceInfo.datePaid ? true : false}
                        tabIndex={-1}
                        disableRipple
                        onClick={event => this.handleOpenConfirmationDialogPaid(event, value.invoiceInfo.key, value.invoiceInfo.datePaid)}
                      />
                      <ListItemText
                        primary={value.planInfo.dossierNr}
                        secondary={value.planInfo.familyName + " " + value.planInfo.name}
                      />
                      {this.state[value.invoiceInfo.key] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Divider />
                    <Collapse key={this.filterData().values.key} in={this.state[value.invoiceInfo.key]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem className="containerInfo" button>
                          <DownloadButton style={{ color: "#3f51b5" }} className="icon" /><p onClick={() => this.generateInvoice(value.invoiceInfo.key)}><p style={{ color: "#3f51b5" }} >Download deze Factuur</p></p><br />
                          <NameIcon className="icon" /><p>{value.planInfo.familyName + " " + value.planInfo.name}</p><br />
                          <DossierIcon className="icon" /><p>{value.planInfo.dossierNr}</p><br />
                          <FeeIcon className="icon" /><p>{value.invoiceInfo.fee}</p><br />
                          <AardIcon className="icon" /><p>{value.invoiceInfo.aardInvoice}</p><br />
                          <DateCreatedIcon className="icon" /><p>{value.invoiceInfo.dateCreated}</p><br />
                          <DatePaidIcon className="icon" style={{ color: value.invoiceInfo.datePaid ? "black" : "red" }} /><p>{value.invoiceInfo.datePaid ? value.invoiceInfo.datePaid : <p style={{ color: "red" }}>Nog niet betaald!</p>}</p><br />
                        </ListItem>
                      </List>
                    </Collapse>
                    <Divider />
                  </div>
                ))}
              </List>
            </div>
          </Paper>
        </div>
        <Dialog
          fullScreen={false}
          open={this.state.openConfirmationDialogPaid}
          onRequestClose={this.handleClose}
          modal={false}
        >
          <DialogContent>
            {this.state.selectedDatePaid ?
              "Wilt u deze Factuur annuleren?" :
              "Wilt u deze Factuur bevestigingen?"}<br />
            <NameIcon className="icon" /><p>{this.state.selectedFullName}</p><br />
            <FeeIcon className="icon" /><p>{this.state.selectedFee}</p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.pushPaiment}
              color="primary"
            >{this.state.confirmOrCancel ? "Bevestigen" : "Ongedaan"}</Button>
            <Button
              onClick={() => this.setState({ openConfirmationDialogPaid: false })}
              color="secondary"
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
      </div >
    );
  }
}

export default Invoices;