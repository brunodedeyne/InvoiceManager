
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Checkbox from '@material-ui/core/Checkbox';
import TableRow from '@material-ui/core/TableRow';


import Header from '../../HeaderComponents/Header';
import Menu from '../../MenuComponents/Menu';
import * as firebase from 'firebase';  
import {withRouter} from 'react-router-dom';

//Import CSS
import './Overview.css';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const data = [
  createData('Frozen yoghurt', 159, 6.0, 24),
  createData('Ice cream sandwich', 237, 9.0, 37),
  createData('Eclair', 262, 16.0, 24),
  createData('Cupcake', 305, 3.7, 67),
  createData('Gingerbread', 356, 16.0, 49),
];

const data2 = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

class Overview extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      unPaid: '1100, 20',
      invoices: [],
      plannen: [],
      dataLastMonth: [],
      dataUnpaid: [],
      dataPlannen: [],
      dataInvoices: []
    };

    this.database = firebase.database().ref('/invoices');
    this.getUnPaidAmount = this.getUnPaidAmount.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentWillMount (){
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      if (user) this.setState({userUid: user.uid});        
    });    
  }

  async componentDidMount (){
    await this.getData(); 
    this.getUnPaidAmount(); 
  }

  async getData () {   
    let itemsInvoices = [];
    let itemsPlannen = [];
    let tempDataLastMonth = [];
    let tempDataUnpaid = [];
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      firebase.database().ref('/invoices').on('value', (snapshotInvoices) => {
        itemsInvoices = Object.entries(snapshotInvoices.val()).map((itemInvoices, iInvoices) => { 
          if (user){
            if (user.uid == itemInvoices[1].userUid){
              var invoiceKey = itemInvoices[0];
              itemInvoices = itemInvoices[1];
              itemInvoices.key = invoiceKey;
              return itemInvoices; 
            }
        }
        });     
        itemsInvoices = itemsInvoices.filter(Boolean);
        this.setState({dataInvoices: itemsInvoices});
        
        firebase.database().ref('/plannen').on('value', (snapshotPlannen) => {
          itemsPlannen = Object.entries(snapshotPlannen.val()).map((itemPlannen, iPlannen) => {     
            if (user){     
              if (user.uid == itemPlannen[1].userUid){ 
                itemPlannen = itemPlannen[1];
                itemPlannen.key = iPlannen;
                return itemPlannen;  
              }
            }
          });
          itemsPlannen = itemsPlannen.filter(Boolean);  
          this.setState({dataPlannen: itemsPlannen});

          let now = new Date();
          let val = `${now.getMonth()+1}`;

          let combinedInvoicesLastMonth = [];
          var statusPaimentLastMonth = "";
          for (var i = 0; i < itemsInvoices.length; i++){
            for (var j = 0; j < itemsPlannen.length; j++){    
              if (itemsPlannen[j].key === itemsInvoices[i].planKey && itemsInvoices[i].dateCreated.split('/')[1] === val) {
                combinedInvoicesLastMonth.push ({
                  dossierNr: itemsPlannen[j].dossierNr,
                  fee: itemsInvoices[i].fee,
                  dateCreated: itemsInvoices[i].dateCreated,
                  datePaid: itemsInvoices[i].datePaid,         
                })
              }
            }
          }
          tempDataLastMonth = combinedInvoicesLastMonth;
          this.setState({dataLastMonth: tempDataLastMonth});

          let combinedInvoicesUnpaid = [];
          var statusPaimentUnpaid = "";
          for (var i = 0; i < itemsInvoices.length; i++){
            for (var j = 0; j < itemsPlannen.length; j++){    
              if (itemsPlannen[j].key === itemsInvoices[i].planKey && itemsInvoices[i].datePaid == "") {
                if (itemsInvoices[i].datePaid == "") statusPaimentUnpaid = "Onbetaald";
                else statusPaimentUnpaid = "Betaald";
                combinedInvoicesUnpaid.push ({
                  dossierNr: itemsPlannen[j].dossierNr,
                  fee: itemsInvoices[i].fee,
                  dateCreated: itemsInvoices[i].dateCreated,
                  datePaid: itemsInvoices[i].datePaid,
                  status: statusPaimentUnpaid
                })                
              }
            }
          }
          tempDataUnpaid = combinedInvoicesUnpaid;
          this.setState({dataUnpaid: tempDataUnpaid});
        });
      });
    });
  }

  getUnPaidAmount () {   
    let itemsInvoices = [];
    let tempUnPaid = 0;
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      if (user) this.setState({userUid: user.uid});  
      firebase.database().ref('/invoices').on('value', (snapshotInvoices) => {
        itemsInvoices = Object.values(snapshotInvoices.val()).map((itemInvoices) => { 
          if (user) {
            if (itemInvoices.userUid == user.uid) {     
              return itemInvoices; 
            }
          }          
        });     
        itemsInvoices = itemsInvoices.filter(Boolean);
        this.setState({dataInvoices: itemsInvoices});      
          for (var i = 0; i < itemsInvoices.length; i++){  
            if (itemsInvoices[i].datePaid == "") {
              tempUnPaid = tempUnPaid + parseInt(itemsInvoices[i].fee);              
            }
          }
          this.setState({unPaid: tempUnPaid.toLocaleString().replace(',', ' ')});
      });
    });
  }

  render () {
    const { classes } = this.props;
    return  (
      <div>
        <div>
        <div>
          <div className="containerOverview paddingClassOverview">
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Paper className="unPaidOverview paddingClassOverview shadowClassOverview">Bedrag bij Cliënten: <strong>€{this.state.unPaid}</strong></Paper>
              </Grid>

              <Grid item xs={6} className="gridUnPaid">
                <Paper className="paddingClassOverview shadowClassOverview">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className="statusHeaderUnPaid">Status</TableCell>
                        <TableCell className="dossierHeaderUnPaid" numeric>Dossier</TableCell>
                        <TableCell className="feeHeaderUnPaid" numeric>Ereloon</TableCell>
                        <TableCell className="dateHeaderUnPaid" numeric>Datum</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.dataUnpaid.map(n => {
                        return (
                          <TableRow key={n.id}>
                            <Checkbox disabled />
                            <TableCell className="dossierUnPaid" numeric>{n.dossierNr}</TableCell>
                            <TableCell className="feeUnPaid" numeric>€{n.fee}</TableCell>
                            <TableCell className="dateUnPaid" numeric>{n.dateCreated}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>

              <Grid item xs={6} className="gridMonth">
                <Paper className="paddingClass shadowClass">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className="statusHeaderMonth">Status</TableCell>
                        <TableCell className="dossierHeaderMonth" numeric>Dossier</TableCell>
                        <TableCell className="feeHeaderMonth" numeric>Ereloon</TableCell>
                        <TableCell className="dateCreatedHeaderMonth" numeric>Datum</TableCell>
                        <TableCell className="datePaidHeaderMonth" numeric>BetaalDatum</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.dataLastMonth.map(n => {
                        return (
                          <TableRow key={n.id}>
                            {n.datePaid ? 
                              <Checkbox disabled checked value="checkedE" /> :
                              <Checkbox disabled value="checkedD" />}
                            <TableCell className="dossierNrMonth" numeric>{n.dossierNr}</TableCell>
                            <TableCell className="feeMonth" numeric>{n.fee}</TableCell>
                            <TableCell className="dateCreatedMonth" numeric>{n.dateCreated}</TableCell>
                            <TableCell className="datePaidMonth" numeric>{n.datePaid}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Paper>
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