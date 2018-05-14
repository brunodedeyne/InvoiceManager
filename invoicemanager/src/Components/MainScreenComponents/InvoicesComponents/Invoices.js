import React, { Component } from 'react';
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";

import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

//Import CSS
import './Invoices.css';
import * as firebase from 'firebase';

const styles = {
  propContainer: {
    width: 200,
    overflow: 'hidden',
    margin: '20px auto 0',
  },
  propToggleHeader: {
    margin: '20px auto 10px',
  },
};

const tableData = [
  {
    name: 'John Smith',
    status: 'Employed',
  }
];



class Invoices extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        fixedHeader: false,
        fixedFooter: false,
        stripedRows: true,
        showRowHover: true,
        selectable: true,
        multiSelectable: false,
        enableSelectAll: false,
        deselectOnClickaway: true,
        showCheckboxes: false,
        height: '500px',
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

        AardInvoicesDummy: '',
        AardInvoices: '',
        
        feeDummy: '',
        fee: '',

        invoices: [],
        plannen: []
    };
  }

  handleCellClick (rowNumber, columnId) {
    console.log(rowNumber);
    console.log(columnId);
  }

  componentWillMount (){
    const allInvoices = this.state.invoices;
    const allPlans = this.state.plannen;

    firebase.database().ref('/plannen').on('child_added', snapshot => {
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
    
    firebase.database().ref('/invoices').on('child_added', snapshot => {
      allInvoices.push({
            key: snapshot.key,
            /*dossierNr: snapshot.val().DossierNr,
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
            Aard: snapshot.val().Aard,*/
            AardInvoices: snapshot.val().AardInvoice,
            fee: snapshot.val().Fee
        })

        this.setState({invoices: allInvoices});
    })
    console.log(" + " + this.state.plannen.length);
    for (var i; i < this.state.invoices.length + 1; i++){
      console.log("invies" + this.state.invoices[i]);
          
      for (var j; j < this.state.plannen.length + 1; j++){
          console.log("plannen" +this.state.plannen[j]);
        if (this.state.plannen[j].key == this.state.invoices[i]. key){
          this.state.invoices[i].name = this.state.plannen[j].name;
          console.log(this.state.invoices[i]);
          console.log(this.state.plannen[j]);
        }
      }
    }
}

  handleToggle = (event, toggled) => {
    this.setState({
      [event.target.name]: toggled,
    });
  };
  render() {
    return (
      <div>
        <Table
          className="table"
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
          onCellClick={this.handleCellClick}
        >
          <TableHeader
            displaySelectAll={this.state.showCheckboxes}
            adjustForCheckbox={this.state.showCheckboxes}
            enableSelectAll={this.state.enableSelectAll}
          >
            <TableRow>
              {this.props.headerTitle}
              {/* <TableHeaderColumn tooltip="Het dossiernummer van deze cliënt">Dossier Nummer</TableHeaderColumn>
              <TableHeaderColumn tooltip="De naam van deze cliënt">Naam</TableHeaderColumn>
              <TableHeaderColumn tooltip="Het adres van deze cliënt">Adres</TableHeaderColumn>
              <TableHeaderColumn tooltip="Het emailadres van deze cliënt">Email</TableHeaderColumn>
              <TableHeaderColumn tooltip="Het telefoonummer van deze cliënt">Telefoon</TableHeaderColumn>
              <TableHeaderColumn tooltip="Het rijksregisternummer van deze cliënt">Rijksregisternummer</TableHeaderColumn>
              <TableHeaderColumn tooltip="Het BTW nummer van deze cliënt">BTW nummer</TableHeaderColumn>
              <TableHeaderColumn tooltip="Het adres van het gebouw">Adres Gebouw</TableHeaderColumn>
              <TableHeaderColumn tooltip="De aard van het plan">Aard</TableHeaderColumn> */}
              <TableHeaderColumn tooltip="Key van de cliënt">Key</TableHeaderColumn>
              <TableHeaderColumn tooltip="Aard van de factuur">Aard Factuur</TableHeaderColumn>
              <TableHeaderColumn tooltip="Ereloon op deze factuur">Ereloon</TableHeaderColumn>
              <TableHeaderColumn tooltip="De naam van deze cliënt">Naam</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
            {this.state.invoices.map( (row, index) => (
              <TableRow key={index}>
                {/* <TableRowColumn>{row.dossierNr}</TableRowColumn>
                <TableRowColumn>{row.name + " " + row.familyName}</TableRowColumn>
                <TableRowColumn>{row.street + ", " + row.city}</TableRowColumn>
                <TableRowColumn>{row.email}</TableRowColumn>
                <TableRowColumn>{row.phone}</TableRowColumn>
                <TableRowColumn>{row.number}</TableRowColumn>
                <TableRowColumn>{row.BTW}</TableRowColumn>
                <TableRowColumn>{row.buildingStreet + ", " + row.buildingCity}</TableRowColumn>
                <TableRowColumn>{row.Aard}</TableRowColumn> */}
                <TableRowColumn>{row.key}</TableRowColumn>
                <TableRowColumn>{row.AardInvoices}</TableRowColumn>
                <TableRowColumn>€{row.fee}</TableRowColumn>
                <TableRowColumn>€{row.name}</TableRowColumn>
              </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default Invoices;