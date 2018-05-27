import React from 'react';

import Parser from 'html-react-parser';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Menu from '../../MenuComponents/Menu';
import Header from '../../HeaderComponents/Header';
import './Clients.css';
import * as firebase from 'firebase';  
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from "material-ui/TextField";

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import HomeIcon from "../../../assets/img/house.png";
import PhoneIcon from "../../../assets/img/phone.png";
import EmailIcon from "../../../assets/img/email.png";
import BTWIcon from "../../../assets/img/btw.png";
import NumberIcon from "../../../assets/img/rrn.png";
import BuildingIcon from "../../../assets/img/building.png";
import AardIcon from "../../../assets/img/aard.png";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';

const columnData = [
  { id: 'dossierNr', label: 'Dossier' },
  { id: 'fullName', label: 'Naam' },
  { id: 'address', label: 'Adres' },
  { id: 'phone', label: 'Telefoon' },
  { id: 'buildingAddress', label: 'Adres Gebouw' },
  { id: 'aard', label: 'Aard' },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead className="Head">
        <TableRow className="Header">
          {columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
                className={column.id + "ColumnHeaderClients"}
              >
                <Tooltip
                  title={"Sorteer " + column.label}
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.black,
    },
  },
});

class EnhancedTable extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'asc',
      orderBy: 'dossierNr',
      selected: [],
      data: [].sort((a, b) => (a.dossierNr < b.dossierNr ? -1 : 1)),
      page: 0,
      rowsPerPage: 10,
      clientData: [],
      openPreview: false,
      expanded: true,
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
      cityErrorText : '',
      phoneErrorText: '',
      emailErrorText : '',
      RRNErrorText: '',
      buildingStreetErrorText: '',
      buildingCityErrorText: '',
      aardErrorText: '',
      userUid: '',
      openDeleteClient: false,
      invoices: [],
      data:[]
    };
    this.database = firebase.database().ref('/plannen');
    this.handleEditPlan = this.handleEditPlan.bind(this);
    this.fillData = this.fillData.bind(this);
  }

  componentWillMount (){
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      if (user) this.setState({userUid: user.uid});        
    });
  }

  componentDidMount () {
    this.fillData();
  }

  fillData () {
    let items = [];
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      if (user) this.setState({userUid: user.uid});    
      let items = [];
      this.database.on('value', (snapshot) => {
          items = Object.entries(snapshot.val()).map((item, i) => { 
            if (user){              
              if (item[1].userUid == user.uid) {
                console.log(i);
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

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  handleClientInfo (event, id) {
    console.log(id);
    console.log(event);
    this.state.nameErrorText == "" ;
    this.state.familyNameErrorText == "" ;
    this.state.streetErrorText == "" ;
    this.state.cityErrorText == "" ;
    this.state.phoneErrorText == "" ;
    this.state.emailErrorText == "" ;
    this.state.RRNErrorText == "" ;
    this.state.buildingStreetErrorText == "" ;
    this.state.buildingCityErrorText == "";
    this.state.aardErrorText == "";
    this.state.clientData = [];
    for (var i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].key === id) {
        //this.setState({
          this.state.selectedName= this.state.data[i].name;
          this.state.selectedFamilyName= this.state.data[i].familyName;
          this.state.selectedStreet= this.state.data[i].street;
          this.state.selectedCity= this.state.data[i].city;
          this.state.selectedFity= this.state.data[i].city;
          this.state.selectedPhone= this.state.data[i].phone;
          this.state.selectedEmail= this.state.data[i].email;
          this.state.selectedBTW= this.state.data[i].BTW;
          this.state.selectedRRN= this.state.data[i].RRN;
          this.state.selectedBuildingStreet= this.state.data[i].buildingStreet;
          this.state.selectedBuildingCity= this.state.data[i].buildingCity;
          this.state.selectedAard= this.state.data[i].aard;
          this.state.selectedDossierNr= this.state.data[i].dossierNr;
          this.state.selectedKey= this.state.data[i].key;
        //});        
      }
      this.setState({openPlanEdit: true});
    }   
  }

  updateName = (e) =>{ 
    if (e.target.value.length <= 0) this.setState({nameErrorText: "Naam mag niet leeg zijn!", selectedName: e.target.value});
    else this.setState({nameErrorText: "", selectedName: e.target.value});
  }

  updateFamilyName = (e) =>{ 
      if (e.target.value.length <= 0) this.setState({familyNameErrorText: "Familienaam mag niet leeg zijn!", selectedFamilyName: e.target.value});
      else this.setState({familyNameErrorText: "", selectedFamilyName: e.target.value});
  }

  updateStreet = (e) =>{ 
    console.log(e.target.value);
      if (e.target.value.length <= 0) this.setState({streetErrorText: "Straat mag niet leeg zijn!", selectedStreet: e.target.value});
      else this.setState({streetErrorText: "", selectedStreet: e.target.value});
  }

  updateCity = (e) =>{ 
    console.log(e.target.value);
    if (e.target.value.length <= 0) this.setState({cityErrorText: "Stad mag niet leeg zijn!", selectedCity: e.target.value});
    else this.setState({cityErrorText: "", selectedCity: e.target.value});
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
          this.setState({selectedPhone: e.target.value});
      }
  }

  updatePhoneOnChange = (e) => {   
      if (e.target.value.length <= 0) this.setState({phoneErrorText: "Telefoonnummer mag niet leeg zijn!", selectedPhone: e.target.value});       
      else if (e.target.value.substring(0, 1) != 0) this.setState({phoneErrorText: "Telefoonnummer moet met 0 beginnen!", selectedPhone: e.target.value});
      else {
          this.setState({selectedPhone: e.target.value, phoneErrorText: ""});
          if (this.state.selectedPhone.length === 11) this.setState({phoneValid: true})
      }
  }

  updateEmail = (e) =>{ 
      if (e.target.value.length <= 0) this.setState({emailErrorText: "Email mag niet leeg zijn!", selectedEmail: e.target.value});       
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
          this.setState({selectedEmail: e.target.value});
      }
  }

  updateRRN = (e) =>{
      if (e.target.value.length === 2 || e.target.value.length === 5 || e.target.value.length === 12) e.target.value += "."; 
      else if (e.target.value.length === 8) e.target.value += "-";
      this.setState({selectedRRN: e.target.value});
  }

  updateRRNOnChange = (e) => {
      if (e.target.value.length <= 0) this.setState({RRNErrorText: "Rijksregisternummer mag niet leeg zijn!", selectedRRN: e.target.value});     
      else {
          this.setState({RRNErrorText: "", selectedRRN: e.target.value});
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
          this.setState({selectedBTW: "BE " + e.target.value});
      }
      if (e.target.value.substring(0,1) != 0){
          if (e.target.value.length ===  3 || e.target.value.length === 7)    e.target.value += ".";       
          this.setState({selectedBTW: "BE 0" + e.target.value});
      }
  }

  updateBuildingStreet = (e) =>{ 
      if (e.target.value.length <= 0) this.setState({buildingStreetErrorText: "Straat mag niet leeg zijn!", selectedBuildingStreet: e.target.value});
      else this.setState({buildingStreetErrorText: "", selectedBuildingStreet: e.target.value});
  }

  updateBuildingCity = (e) =>{ 
      if (e.target.value.length <= 0) this.setState({buildingCityErrorText: "Stad mag niet leeg zijn!", selectedBuildingCity: e.target.value});
      else this.setState({buildingCityErrorText: "", selectedBuildingCity: e.target.value});
  }

  updateAard = (e) =>{ 
      if (e.target.value.length <= 0) this.setState({aardErrorText: "Aard mag niet leeg zijn!", selectedAard: e.target.value});
      else this.setState({aardErrorText: "", selectedAard: e.target.value});
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

  handleDeleteClient = () => {
    firebase.database().ref().child('/plannen/' + this.state.selectedKey).remove();
    const allInvoices = this.state.invoices;
    firebase.database().ref('/invoices').on('child_added', snapshot => {
      
      if (snapshot.val().planKey === this.state.selectedKey){
        allInvoices.push({
          key: snapshot.key,
        })
      }
      this.setState({invoices: allInvoices});
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
    if (!/\d/.test(this.state.selectedStreet)) this.setState({streetErrorText: "Deze straat bevat geen huisnummer!"});
    else this.state.streetErrorText = "";

    if (!/\d/.test(this.state.selectedBuildingStreet)) this.state.buildingStreetErrorText = "Deze straat bevat geen huisnummer!";
    else this.state.buildingStreetErrorText = "";

    if (!/\d/.test(this.state.selectedCity)){this.state.cityErrorText = "Deze Stad bevat geen Postcode!";}
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

    console.log(this.state.nameErrorText);
    console.log(this.state.familyNameErrorText );
    console.log(this.state.streetErrorText );
    console.log(this.state.cityErrorText );
    console.log(this.state.phoneErrorText );
    console.log(this.state.emailErrorText );
    console.log(this.state.RRNErrorText );
    console.log(this.state.buildingStreetErrorText);
    console.log(this.state.buildingCityErrorText );
    console.log(this.state.aardErrorText);
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
          dossierNr: this.state.selectedDossierNr  ,
          userUid: this.state.userUid  
        });
        this.setState({
            openPlanEdit: false, 
            snackBarContent: "Plan van " + this.state.selectedName + " " + this.state.selectedFamilyName + " is aangepast!"
        });
      }    
    }

  handleOpenPlanEdit = () => {
    this.setState({openPlanEdit: true});
  };

  handleClosePlanEdit = () => {
      this.setState({openPlanEdit: false});
  };

  handleOpenDeleteClient = () => {
    this.setState({openDeleteClient: true});
  };

  handleCloseDeleteClient = () => {
      this.setState({openDeleteClient: false});
  };

  handleExpandChange = (expanded) => {
      this.setState({expanded: expanded});
  };

  render() {
    const actionsEditPlan = [
      <RaisedButton
        label="Verwijder Cliënt"
        secondary={true}
        keyboardFocused={true}
        onClick={this.handleOpenDeleteClient}
        className="deleteClient"
      />,
      <FlatButton
        label="Annuleer"
        secondary={true}
        onClick={this.handleClosePlanEdit}
      />,
      <FlatButton
          label="Opslaan"
          primary={true}
          keyboardFocused={true}
          onClick={this.handleEditPlan}
      />,
    ];
    const actionsDeleteClient = [
      <FlatButton
        label="Annuleer"
        primary={true}
        onClick={this.handleCloseDeleteClient}
      />,
      <FlatButton
          label="Verwijder"
          secondary={true}
          keyboardFocused={true}
          onClick={this.handleDeleteClient}
      />,
    ];
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    
    return (
      <div>
        <div className="ContainerClients">
        <Paper className={classes.root}>          
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={this.handleRequestSort}
                rowCount={data.length}
              />
              <TableBody>
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell className="dossierNrColumnClients"><a href="#" onClick={event => this.handleClientInfo(event, n.key)}>{n.dossierNr}</a></TableCell>
                      <TableCell className="fullNameColumnClients">{n.fullName}</TableCell>
                      <TableCell className="addressColumnClients">{Parser(n.address)}</TableCell>
                      <TableCell className="phoneColumnClients">{n.phone}</TableCell>
                      <TableCell className="buildingAddressColumnClients">{Parser(n.buildingAddress)}</TableCell>
                      <TableCell className="aardColumnClients">{n.aard}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
        <Dialog
          title={"Bewerk Plan voor " + this.state.selectedName + " " + this.state.selectedFamilyName + " - " + this.state.selectedDossierNr}
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
              className="form__TextField__NewPlan"
              onChange={this.updateFamilyName}    
              errorText={this.state.familyNameErrorText}
              value={this.state.selectedFamilyName}
          />
          <TextField
              name="name"
              floatingLabelText="Voornaam *"
              className="form__TextField__NewPlan"
              onChange={this.updateName}
              errorText={this.state.nameErrorText}
              value={this.state.selectedName}
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
              value={this.state.selectedStreet}
          />
          <TextField
              name="city"
              floatingLabelText="Postcode + Stad *"
              className="form__TextField__NewPlan"
              onChange={this.updateCity}
              value={this.state.city}
              errorText={this.state.cityErrorText}
              value={this.state.selectedCity}
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
              value={this.state.selectedPhone}
          />
          <TextField
              name="email"
              floatingLabelText="Email *"
              className="form__TextField__NewPlan"
              onChange={this.updateEmail}
              type="email"
              errorText={this.state.emailErrorText}
              value={this.state.selectedEmail}
          />
          <TextField
              name="BTW"
              floatingLabelText="BTW Nummer"
              className={"form__TextField__NewPlan " + this.state.BTWClasses }
              onKeyPress={this.updateBTW}
              maxLength="12"
              errorText={this.state.BTWErrorText}
              value={this.state.selectedBTW}
          />
          <TextField
              name="RRN"
              floatingLabelText="Rijksregisternummer *"
              className={"form__TextField__NewPlan RRNNewPlan " + this.state.RRNClasses }
              onKeyPress={this.updateRRN}
              onChange={this.updateRRNOnChange}
              maxLength="15"
              errorText={this.state.RRNErrorText}
              value={this.state.selectedRRN}
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
              value={this.state.selectedBuildingStreet}
          />
          <TextField
              name="buildingCity"
              floatingLabelText="Bouwplaats *"
              className="form__TextField__NewPlan"
              onChange={this.updateBuildingCity}
              value={this.state.buildingCity}
              errorText={this.state.buildingCityErrorText}
              value={this.state.selectedBuildingCity}
          />
          <TextField
              name="Aard"
              floatingLabelText="Aard *"
              className="form__TextField__NewPlan"
              onChange={this.updateAard}
              errorText={this.state.aardErrorText}
              value={this.state.selectedAard}
          />
            </div>
          </Dialog>
          <Dialog
            title={"Wilt u " + this.state.selectedName + " " + this.state.selectedFamilyName + " - " + this.state.selectedDossierNr + " & Facturen Verwijderen?"}
            actions={actionsDeleteClient}
            modal={false}
            open={this.state.openDeleteClient}
            onRequestClose={this.handleCloseDeleteClient}
          >   
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
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(EnhancedTable);