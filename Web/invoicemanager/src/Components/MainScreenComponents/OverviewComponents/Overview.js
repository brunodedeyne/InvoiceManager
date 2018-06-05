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
  Info as InfoIcon,
  ExpandLess,
  ExpandMore,
} from '@material-ui/icons';

// Import Material UI Components
import {
  Paper, 
  Grid,
  Checkbox,
  Collapse,
  ListSubheader,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@material-ui/core';

// Import Extra's
import Parser from 'html-react-parser';

// Import Database
import * as firebase from 'firebase';
import { withRouter } from 'react-router-dom';

// Import CSS
import './Overview.css';

class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unPaid: '1100, 20',
      invoices: [],
      plannen: [],
      dataLastMonth: [],
      dataUnpaid: [],
      dataPlannen: [],
      dataInvoices: [],
      data: [],
      value: 'unPaid',
      openCollapse: false
    };

    this.database = firebase.database().ref('/invoices');
    this.getUnPaidAmount = this.getUnPaidAmount.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentWillMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      if (user) this.setState({ userUid: user.uid });
    });
  }

  async componentDidMount() {
    await this.getData();
    this.getUnPaidAmount();
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

  getUnPaidAmount() {
    let itemsInvoices = [];
    let tempUnPaid = 0;
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      if (user) this.setState({ userUid: user.uid });
      firebase.database().ref('/invoices').on('value', (snapshotInvoices) => {
        itemsInvoices = Object.values(snapshotInvoices.val()).map((itemInvoices) => {
          if (user) {
            if (itemInvoices.userUid == user.uid) {
              return itemInvoices;
            }
          }
        });
        itemsInvoices = itemsInvoices.filter(Boolean);
        this.setState({ dataInvoices: itemsInvoices });
        for (var i = 0; i < itemsInvoices.length; i++) {
          if (itemsInvoices[i].datePaid == "") {
            tempUnPaid = tempUnPaid + parseInt(itemsInvoices[i].fee);
          }
        }
        this.setState({ unPaid: tempUnPaid.toLocaleString().replace(',', ' ') });
      });
    });
  }

  handleChangeRadioButtons = event => {
    this.setState({ value: event.target.value });
  };

  isCategory(category, item) {
    if (category == "unPaid") {
      if (item.datePaid == "") return true;
      else return false;
    }
    if (category == "lastMonth") {
      let now = new Date();
      let val = `${now.getMonth() + 1}`;

      if (item.dateCreated.split('/')[1] === val) return true;
      else return false;
    }
    return true;
  }

  filterData(category) {
    let filterData = this.state.data.filter(item => (
      this.isCategory(category, item)
    ));
    return filterData;
  }

  handleClickExpand = (e) => {
    this.setState({ [e]: !this.state[e] });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className="ContainerOverview">
          <Paper>
            <div >
              <List>
                <ListItem>
                  <ListItemText style={{ textAlign: "center" }} primary={Parser("Onbetaald bedrag: <strong>€" + this.state.unPaid + "</strong>")} />
                </ListItem>
              </List>
              <List className="unPaidInvoices">
                <ListSubheader>Onbetaalde Facturen</ListSubheader>
                <Divider />
                  {this.filterData("unPaid") == "" ? <div>
                    <ListItem
                      role={undefined}
                      dense
                      button
                    >
                      <ListItemText
                        primary={"Geen items te vinden"}
                      />
                    </ListItem>
                  </div> : ""}
                  {this.filterData("unPaid").map(value => (
                    <div>
                      <ListItem
                        onClick={this.handleClickExpand.bind(this, "unPaid_" + value.fullName + "_" + value.aardInvoice)}
                        button
                      >
                        <Checkbox
                          checked={value.datePaid ? true : false}
                          tabIndex={-1}
                          disableRipple
                          disabled
                        /> 
                        <ListItemText
                          primary={value.dossierNr}
                          secondary={value.fullName}
                        />
                        {this.state["unPaid_" + value.fullName + "_" + value.aardInvoice] ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Divider />
                      <Collapse key={"unPaid_" + this.filterData("unPaid_").values.key + "_" + value.aardInvoice} in={this.state["unPaid_" + value.fullName + "_" + value.aardInvoice]} timeout="auto" unmountOnExit>
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
                    </div>
                  ))}
                </List>
                <List className="unPaidInvoices">
                  <ListSubheader>Laatste Maand</ListSubheader>
                  <Divider />
                  {this.filterData("lastMonth") == "" ? <div>
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
                  {this.filterData("lastMonth").map(value => (
                    <div>
                      <ListItem
                        button
                        key={"lastMonth_" + value.key}
                        onClick={this.handleClickExpand.bind(this, "lastMonth_" + value.fullName + "_" + value.aardInvoice)}
                      >
                        <Checkbox
                          checked={value.datePaid ? true : false}
                          tabIndex={-1}
                          disableRipple
                          disabled
                        /> 
                        <ListItemText
                          primary={value.dossierNr}
                          secondary={value.fullName}
                        />
                        {this.state["lastMonth_" + value.fullName + "_" + value.aardInvoice] ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Divider />
                      <Collapse key={"lastMonth_" + this.filterData("lastMonth").values.key + "_" + value.aardInvoice} in={this.state["lastMonth_" + value.fullName + "_" + value.aardInvoice]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          <ListItem className="containerInfo" button>
                            <NameIcon className="icon" /><p>{value.fullName}</p><br />
                            <DossierIcon className="icon" /><p>{value.dossierNr}</p><br />
                            <FeeIcon className="icon" /><p>{value.fee}</p><br />
                            <AardIcon className="icon" /><p>{value.aardInvoice}</p><br />
                            <DateCreatedIcon className="icon" /><p>{value.dateCreated}</p><br />
                            <DatePaidIcon className="icon" /><p>{value.datePaid ? value.datePaid : "Nog niet betaald!"}</p><br />
                          </ListItem>
                        </List>
                      </Collapse>
                    </div>
                  ))}
              </List>
            </div>
          </Paper>
        </div>
      </div >
    )
  }
}

Overview.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default Overview;