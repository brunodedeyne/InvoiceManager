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
  ExpandLess,
  ExpandMore
} from "@material-ui/icons";

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
              if (itemsPlannen[j].key === itemsInvoices[i].planKey) {
                combinedInvoices.push({
                  userUid: itemsInvoices[i].userUid,
                  dossierNr: itemsPlannen[j].dossierNr,
                  key: itemsInvoices[i].key,
                  aardInvoice: itemsInvoices[i].aardInvoice,
                  fee: itemsInvoices[i].fee,
                  planKey: itemsInvoices[i].planKey,
                  dateCreated: itemsInvoices[i].dateCreated,
                  datePaid: itemsInvoices[i].datePaid,
                  fullName: itemsPlannen[j].name + " " + itemsPlannen[j].familyName,
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
    const paidInvoice = this.state.paimentInvoice;

    let now = new Date();
    let val = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    var tempDate = '';

    for (var i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].key === this.state.paimentId) {
        if (this.state.confirmOrCancel) tempDate = val;
        else tempDate = ""
        paidInvoice.push({
          aardInvoice: this.state.data[i].aardInvoice,
          dateCreated: this.state.data[i].dateCreated,
          datePaid: tempDate,
          fee: this.state.data[i].fee,
          planKey: this.state.data[i].planKey,
          fullName: this.state.data[i].name + " " + this.state.data[i].familyName,
          paimentId: this.state.paimentId,
          userUid: this.state.data[i].userUid
        });
        this.setState({ paimentInvoice: paidInvoice });
      }
    }

    firebase.database().ref().child('/invoices/' + this.state.paimentInvoice[0].paimentId)
      .set({
        aardInvoice: this.state.paimentInvoice[0].aardInvoice,
        dateCreated: this.state.paimentInvoice[0].dateCreated,
        datePaid: this.state.paimentInvoice[0].datePaid,
        fee: this.state.paimentInvoice[0].fee,
        planKey: this.state.paimentInvoice[0].planKey,
        userUid: this.state.paimentInvoice[0].userUid
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
      if (id == this.state.data[i].key) {
        selectedFullName = this.state.data[i].fullName,
          selectedFee = this.state.data[i].fee,
          this.setState({
            confirmOrCancel: datePaid ? false : true,
            openConfirmationDialogPaid: true,
            paimentId: id,
            snackBarContent: "Factuur van " + this.state.data[i].fullName + "  -  €" + this.state.data[i].fee + " Is betaald!",
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
              onChange={(event) =>  this.setState({ [event.target.name]: event.target.value })}
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
              onChange={(event) =>  this.setState({ [event.target.name]: event.target.value })}
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
                      onClick={this.handleClickExpand.bind(this, value.fullName + "_" + value.aardInvoice)}
                      button
                    >
                      <Checkbox
                        checked={value.datePaid ? true : false}
                        tabIndex={-1}
                        disableRipple
                        onClick={event => this.handleOpenConfirmationDialogPaid(event, value.key, value.datePaid)}
                      />
                      <ListItemText
                        primary={value.dossierNr}
                        secondary={value.fullName}
                      />
                      {this.state[value.fullName + "_" + value.aardInvoice] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Divider />
                    <Collapse key={this.filterData("lastMonth").values.key + "_" + value.aardInvoice} in={this.state[value.fullName + "_" + value.aardInvoice]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem className="containerInfo" button>
                          <NameIcon className="icon" /><p>{value.fullName}</p><br />
                          <DossierIcon className="icon" /><p>{value.dossierNr}</p><br />
                          <FeeIcon className="icon" /><p>{value.fee}</p><br />
                          <AardIcon className="icon" /><p>{value.aardInvoice}</p><br />
                          <DateCreatedIcon className="icon" /><p>{value.dateCreated}</p><br />
                          <DatePaidIcon className="icon" style={{color: value.datePaid ? "black" : "red" }}/><p>{value.datePaid ? value.datePaid : <p style={{color: "red"}}>Nog niet betaald!</p>}</p><br />
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
              label={this.state.confirmOrCancel ? "Bevestigen" : "Ongedaan"}
            />
            <Button
              onClick={() => this.setState({ openConfirmationDialogPaid: false })}
              color="secondary"
              label={"Annuleer"}
            />
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