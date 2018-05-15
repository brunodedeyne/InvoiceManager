import React, {Component} from 'react';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

import './Clients.css';
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

/**
 * A more complex example, allowing the table height to be set, and key boolean properties to be toggled.
 */
export default class TableExampleComplex extends Component {
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
        height: '100%',
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

        plannen: []
    };

    this.database = firebase.database().ref('/plannen');
  }

  handleCellClick (rowNumber, columnId) {
    console.log(rowNumber);
    console.log(columnId);
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
            Aard: snapshot.val().aard
        })

        this.setState({plannen: allPlans});
    })
}

  handleToggle = (event, toggled) => {
    this.setState({
      [event.target.name]: toggled,
    });
  };
  render() {
    return (
      <div className="ContainerClients">
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
              <TableHeaderColumn className="DossierNrColumn" tooltip="Het dossiernummer van deze cliënt">Dossier <br/>Nummer</TableHeaderColumn>
              <TableHeaderColumn className="NaamColumn" tooltip="De naam van deze cliënt">Naam</TableHeaderColumn>
              <TableHeaderColumn className="AdresColumn" tooltip="Het adres van deze cliënt">Adres</TableHeaderColumn>
              <TableHeaderColumn className="PhoneColumn" tooltip="Het Telefoonnummer van deze cliënt">Telefoon</TableHeaderColumn>
              <TableHeaderColumn className="GebouwAdresColumn" tooltip="Het adres van het gebouw">Adres Gebouw</TableHeaderColumn>
              <TableHeaderColumn className="AardColumn" tooltip="De aard van het plan">Aard</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
            {this.state.plannen.map( (row, index) => (
              <TableRow key={index}>
                <TableRowColumn className="DossierNrColumn">{row.dossierNr}</TableRowColumn>
                <TableRowColumn className="NaamColumn">{row.name + " " + row.familyName}</TableRowColumn>
                <TableRowColumn className="AdresColumn">{row.street}<br/>
                  {row.city}</TableRowColumn>
                <TableRowColumn className="PhoneColumn">{row.phone}</TableRowColumn>
                <TableRowColumn className="GebouwAdresColumn">{row.buildingStreet}<br/>
                  {row.buildingCity}</TableRowColumn>
                <TableRowColumn className="AardColumn">{row.Aard}</TableRowColumn>
              </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}