
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import Header from '../../HeaderComponents/Header';
import Menu from '../../MenuComponents/Menu';
import * as firebase from 'firebase';  
import {withRouter} from 'react-router-dom';

//Import CSS
import './Overview.css';

class Overview extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      unPaid: '1100, 20',
      invoices: [],
      plannen: [],
      data: []
    };

    this.database = firebase.database().ref('/invoices');
  }

  componentWillMount (){
    const allInvoices = this.state.invoices;
    const allPlans = this.state.plannen;
    var temptUnpaid = 0;

    this.database.on('child_added', snapshot => {
      allInvoices.push({
            key: snapshot.key,
            AardInvoice: snapshot.val().AardInvoice,
            Fee: snapshot.val().Fee,
            PlanKey: snapshot.val().PlanKey,
            DateCreated: snapshot.val().DateCreated,
            DatePaid: snapshot.val().DatePaid
        })
        this.setState({invoices: allInvoices});
    })

    for (var i = 0; i < this.state.invoices.length; i++){
      if (this.state.invoices[i].DatePaid === "") {
        temptUnpaid += parseInt(this.state.invoices[i].Fee);
      }
    }
    this.setState({unPaid: temptUnpaid});

    // firebase.database().ref('/plannen').on('child_added', snapshot => {
    //   allPlans.push({
    //     key: snapshot.key,
    //     dossierNr: snapshot.val().DossierNr,
    //     name: snapshot.val().name,
    //     familyName: snapshot.val().familyName,
    //     street: snapshot.val().street,
    //     city: snapshot.val().city,
    //     email: snapshot.val().email,
    //     phone: snapshot.val().phone,
    //     number: snapshot.val().number,
    //     BTW: snapshot.val().BTW,
    //     buildingStreet: snapshot.val().buildingStreet,
    //     buildingCity: snapshot.val().buildingCity,
    //     aard: snapshot.val().aard
    //   })

    //   this.setState({plannen: allPlans});
    // })

    // for (var i = 0; i < this.state.invoices.length; i++){
    //   for (var j = 0; j < this.state.plannen.length; j++){
    //     if (this.state.plannen[j].key === this.state.invoices[i].PlanKey) {
    //       this.state.data.push({
    //         dossierNr: this.state.plannen[j].dossierNr,
    //         name: this.state.plannen[j].name,
    //         familyName: this.state.plannen[j].familyName,
    //         street: this.state.plannen[j].street,
    //         city: this.state.plannen[j].city,
    //         email: this.state.plannen[j].email,
    //         phone: this.state.plannen[j].phone,
    //         number: this.state.plannen[j].number,
    //         BTW: this.state.plannen[j].BTW,
    //         buildingStreet: this.state.plannen[j].buildingStreet,
    //         buildingCity: this.state.plannen[j].buildingAddress,
    //         aard: this.state.plannen[j].aard,
    //         key: this.state.invoices[i].key,
    //         AardInvoice: this.state.invoices[i].AardInvoice,
    //         Fee: this.state.invoices[i].Fee,
    //         PlanKey: this.state.invoices[i].PlanKey,
    //         DateCreated: this.state.invoices[i].DateCreated,
    //         DatePaid: this.state.invoices[i].DatePaid,
    //         fullName: this.state.plannen[j].name + " " + this.state.plannen[j].familyName,
    //         address: this.state.plannen[j].street + `<br />` + this.state.plannen[j].city,
    //         buildingAddress: this.state.plannen[j].buildingStreet + '<br />' + this.state.plannen[j].buildingCity
    //       })
    //     }
    //   } 
    // }
  }

  render () {
    return  (
      <div>
        <Header headerTitle="Overzicht"/>
        <Menu /> 
        <div>
        <div>
          <div className="container paddingClass">
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Paper className="unPaid paddingClass shadowClass">Bedrag bij Cliënten: <strong>€{this.state.unPaid}</strong></Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className="paddingClass shadowClass">
                  
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className="paddingClass shadowClass">xs=6</Paper>
              </Grid>
            </Grid>
          </div>
        </div>
        </div>
      </div>
    )
  }
}


export default Overview;