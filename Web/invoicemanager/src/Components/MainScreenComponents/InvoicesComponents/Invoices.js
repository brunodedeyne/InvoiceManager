import React, {Component} from 'react';
// import Parser from 'html-react-parser';
// import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
// import TableSortLabel from '@material-ui/core/TableSortLabel';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import IconButton from '@material-ui/core/IconButton';
// import Tooltip from '@material-ui/core/Tooltip';
// import DeleteIcon from '@material-ui/icons/Delete';
// import FilterListIcon from '@material-ui/icons/FilterList';
// import { lighten } from '@material-ui/core/styles/colorManipulator';
import Menu from '../../MenuComponents/Menu';
import Header from '../../HeaderComponents/Header';
import './Invoices.css';
import * as firebase from 'firebase';  
// import RaisedButton from 'material-ui/RaisedButton/RaisedButton';

import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import EnhancedTableHead from '../EnhancedTableHead';

// let counter = 0;
// function createData(dossierNr, fullName, AardInvoice, Fee, DateCreated, DatePaid) {
//   counter += 1;
//   return { id: counter, dossierNr, fullName, AardInvoice, Fee, DateCreated, DatePaid };
// }

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

class EnhancedTable extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'asc',
      orderBy: 'DateCreated',
      selected: [],
      plannen: [],
      invoices: [],
      data: [
      ].sort((a, b) => (a.calories < b.calories ? -1 : 1)),
      page: 0,
      rowsPerPage: 10,
      openConfirmationDialogPaid: false,
      //openSuccessPaid: false,
      paimentId: '',
      paimentInvoice: [],
      openSnackbar: false,
      snackBarContent: ''
    };
    this.database = firebase.database().ref('/invoices');
  }

  componentWillMount (){
    const allInvoices = this.state.invoices;
    const allPlans = this.state.plannen;

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
        aard: snapshot.val().aard
      })

      this.setState({plannen: allPlans});
    })

    for (var i = 0; i < this.state.invoices.length; i++){
      for (var j = 0; j < this.state.plannen.length; j++){
        if (this.state.plannen[j].key === this.state.invoices[i].PlanKey) {
          this.state.data.push({
            dossierNr: this.state.plannen[j].dossierNr,
            name: this.state.plannen[j].name,
            familyName: this.state.plannen[j].familyName,
            street: this.state.plannen[j].street,
            city: this.state.plannen[j].city,
            email: this.state.plannen[j].email,
            phone: this.state.plannen[j].phone,
            number: this.state.plannen[j].number,
            BTW: this.state.plannen[j].BTW,
            buildingStreet: this.state.plannen[j].buildingStreet,
            buildingCity: this.state.plannen[j].buildingAddress,
            aard: this.state.plannen[j].aard,
            key: this.state.invoices[i].key,
            AardInvoice: this.state.invoices[i].AardInvoice,
            Fee: this.state.invoices[i].Fee,
            PlanKey: this.state.invoices[i].PlanKey,
            DateCreated: this.state.invoices[i].DateCreated,
            DatePaid: this.state.invoices[i].DatePaid,
            fullName: this.state.plannen[j].name + " " + this.state.plannen[j].familyName,
            address: this.state.plannen[j].street + `<br />` + this.state.plannen[j].city,
            buildingAddress: this.state.plannen[j].buildingStreet + '<br />' + this.state.plannen[j].buildingCity
          })
        }
      } 
    }
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

  pushPaiment = () => {    
    const paidInvoice = this.state.paimentInvoice;

    let now = new Date();
    let val = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;

    for (var i = 0; i < this.state.data.length; i++){
      if (this.state.data[i].key === this.state.paimentId) {        
        paidInvoice.push({
          AardInvoice: this.state.data[i].AardInvoice,
          DateCreated: this.state.data[i].DateCreated,
          DatePaid: val,
          Fee: this.state.data[i].Fee,
          PlanKey: this.state.data[i].PlanKey,
          fullName: this.state.data[i].name + " " + this.state.data[i].familyName,
          paimentId: this.state.paimentId
        });
        this.setState({paimentInvoice: paidInvoice});   
      }
    }

    firebase.database().ref().child('/invoices/' + this.state.paimentInvoice[0].paimentId)
      .set({ 
        AardInvoice: this.state.paimentInvoice[0].AardInvoice,
        DateCreated: this.state.paimentInvoice[0].DateCreated,
        DatePaid: this.state.paimentInvoice[0].DatePaid,
        Fee: this.state.paimentInvoice[0].Fee,
        PlanKey: this.state.paimentInvoice[0].PlanKey
    });
    this.setState({
      openConfirmationDialogPaid: false, 
      openSnackbar: true, 
      paimentInvoice: [], 
      snackBarContent: "Factuur van " + this.state.paimentInvoice[0].fullName + "  -  €" +  this.state.paimentInvoice[0].Fee + " Is betaald!"
    });
  }

  handleCloseConfirmationDialogPaid = () => {
    this.setState({openConfirmationDialogPaid: false});
  }
  handleOpenConfirmationDialogPaid = (event, id) => {
    this.setState({openConfirmationDialogPaid: true, paimentId: id});
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

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    const actionsConfirmationDialogPaid = [
      <FlatButton
          label="Bevestigen"
          primary={true}
          keyboardFocused={true}
          onClick={this.pushPaiment}
      />,
      <FlatButton
          label="Annuleer"
          secondary={true}
          keyboardFocused={true}
          onClick={this.handleCloseConfirmationDialogPaid}
      />
    ];

    return (
      <div>
        <Menu />
        <Header headerTitle="Facturatie"/>
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
                      <TableCell className="PaidColumn">
                        <FlatButton 
                          label="Betalen" 
                          secondary={true} 
                          onClick={event => this.handleOpenConfirmationDialogPaid(event, n.key)}
                          disabled={n.DatePaid}
                        />
                      </TableCell>
                      <TableCell className="dossierNrColumn">{n.dossierNr}</TableCell>
                      <TableCell className="fullNameColumn">{n.fullName}</TableCell>
                      <TableCell className="AardInvoiceColumn">{n.AardInvoice}</TableCell>
                      <TableCell className="FeeColumn">€{n.Fee}</TableCell>
                      <TableCell className="DateCreatedColumn">{n.DateCreated}</TableCell>
                      <TableCell className="DatePaidColumn">{n.DatePaid}</TableCell>
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
        </div>
        
        <Dialog
            title={"Betalingsbevestiging " + this.state.paimentInvoice.fullName + " - €" + this.state.paimentInvoice.Fee}
            actions={actionsConfirmationDialogPaid}
            modal={false}
            open={this.state.openConfirmationDialogPaid}
            onRequestClose={this.handleCloseConfirmationDialogPaid}
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
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);