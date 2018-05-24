
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
    this.getUnPaidAmount = this.getUnPaidAmount.bind(this);
  }

  componentDidMount (){
    this.getUnPaidAmount(); 
    
  }

  getUnPaidAmount () {   
    let itemsInvoices = [];
    let tempUnPaid = 0;
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      this.setState({userUid: user.uid});  
      firebase.database().ref('/invoices').on('value', (snapshotInvoices) => {
        itemsInvoices = Object.values(snapshotInvoices.val()).map((itemInvoices) => { 
          if (itemInvoices.userUid == user.uid) {     
            return itemInvoices; 
          }
        });     
        itemsInvoices = itemsInvoices.filter(Boolean);
        this.setState({dataInvoices: itemsInvoices});      
          for (var i = 0; i < itemsInvoices.length; i++){  
            if (itemsInvoices[i].datePaid != "") tempUnPaid = tempUnPaid + parseInt(itemsInvoices[i].fee);
          }
          this.setState({unPaid: tempUnPaid});
      });
    });
  }

  render () {
    return  (
      <div>
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