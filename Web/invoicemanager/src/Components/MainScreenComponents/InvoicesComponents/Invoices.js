import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import TableHead from '@material-ui/core/TableHead';
import Tooltip from '@material-ui/core/Tooltip';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import IconButton from '@material-ui/core/IconButton';
import Menu from '../../MenuComponents/Menu';
import Header from '../../HeaderComponents/Header';
import './Invoices.css';
import * as firebase from 'firebase';  

import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { SnackbarContent } from '@material-ui/core';


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

const columnData = [
  { id: 'paid', label: 'Betalen' },
  { id: 'dossierNr', label: 'Dossier' },
  { id: 'fullName', label: 'Naam' },
  { id: 'aardInvoice', label: 'Aard Factuur' },
  { id: 'fee', label: 'Ereloon' },
  { id: 'dateCreated', label: 'Opgesteld op' },
  { id: 'datePaid', label: 'Betaald op' },
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
                  className={column.id + "ColumnHeaderInvoices"}
                >
                  <Tooltip
                    title="Sort"
                    placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                    enterDelay={300}
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
  
  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };
  
  const toolbarStyles = theme => ({
    root: {
      paddingRight: theme.spacing.unit,
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    spacer: {
      flex: '1 1 100%',
    },
    actions: {
      color: theme.palette.text.secondary,
    },
    title: {
      flex: '0 0 auto',
    },
  });

class EnhancedTable extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      userUid: '',
      order: 'asc',
      orderBy: 'DateCreated',
      selected: [],
      plannen: [],
      invoices: [],
      dataPlannen: [],
      dataInvoices: [],
      data: [],
      page: 0,
      rowsPerPage: 10,
      openConfirmationDialogPaid: false,
      paimentId: '',
      paimentInvoice: [],
      openSnackbar: false,
      snackBarContent: '',
      kwartaal: '',
      paid: '',
      initialDataCall: false,
      dialogContent: '',
      confirmOrCancel: false
    };
    this.database = firebase.database().ref('/invoices');
    this.filterData = this.filterData.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentWillMount (){
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      if (user) this.setState({userUid: user.uid});        
    });    
  }

  async componentDidMount (){
    await this.getData(); 
  }

  async getData () {   
    let itemsInvoices = [];
    let itemsPlannen = [];
    let tempData = [];
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

          let combinedInvoices = [];
          for (var i = 0; i < itemsInvoices.length; i++){
            for (var j = 0; j < itemsPlannen.length; j++){    
              if (itemsPlannen[j].key === itemsInvoices[i].planKey) {
                combinedInvoices.push ({
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
          this.setState({data: tempData});
        });
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

  pushPaiment = () => {    
    const paidInvoice = this.state.paimentInvoice;

    let now = new Date();
    let val = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;
    var tempDate = '';

    for (var i = 0; i < this.state.data.length; i++){
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
        this.setState({paimentInvoice: paidInvoice});   
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

  handleCloseConfirmationDialogPaid = () => {
    this.setState({openConfirmationDialogPaid: false});
  }

  handleOpenConfirmationDialogPaid = (event, id, datePaid) => {
    var selectedFullName = '';
    var selectedFee = '';
    for (var i = 0; i < this.state.data.length; i++) {
      if (id == this.state.data[i].key){
          selectedFullName = this.state.data[i].fullName,
          selectedFee = this.state.data[i].fee,          
          this.setState({
            confirmOrCancel: datePaid ? false : true,
            openConfirmationDialogPaid: true,
            paimentId: id,
            dialogContent: 
              datePaid ? 
                "Wilt u de factuur van " + selectedFullName + "  -  €" +  selectedFee + " Ongedaan maken?": 
                "Bevestiging van factuur " + selectedFullName + "  -  €" + selectedFee,
            snackBarContent: "Factuur van " + this.state.data[i].fullName + "  -  €" +  this.state.data[i].fee + " Is betaald!",
          });
      }
    }
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

  handleChangeKwartaal = event => {
    this.setState({ [event.target.name]: event.target.value});
  };

  isOfKwartaal (item) {
    if (this.state.kwartaal === "" || this.state.kwartaal == 0) return true;
    if (this.state.kwartaal === 1) {
      if (item.dateCreated.split('/')[1] >= 1 && item.dateCreated.split('/')[1] <= 3){
        return true;
      }     
    }
    else if (this.state.kwartaal === 2) {
      if (item.dateCreated.split('/')[1] >= 4 && item.dateCreated.split('/')[1] <= 6){
        return true;
      }     
    }
    else if (this.state.kwartaal === 3) {
      if (item.dateCreated.split('/')[1] >= 7 && item.dateCreated.split('/')[1] <= 9){
        return true;
      }     
    }
    else if (this.state.kwartaal === 4) {
      if (item.dateCreated.split('/')[1] >= 10 && item.dateCreated.split('/')[1] <= 12){
        return true;
      }     
    }

    return false;
  }

  isPaid (item) {
    if (this.state.paid === "" || this.state.paid == 5) {
      return true;
    }
    else if (this.state.paid == 0) {
      if (item.datePaid == ""){
        return true;
      }     
    }
    else if (this.state.paid == 1) {
      if (item.datePaid != ""){
        return true;
      }     
    }
    return false;
  }

  filterData () {
    let filterData = this.state.data.filter(item => (
      this.isOfKwartaal(item) && this.isPaid(item)
    ));
    return filterData;
  }

  handleChangePaid = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    const actionsConfirmationDialogPaid = [
      <FlatButton
          label={this.state.confirmOrCancel ? "Bevestigen" : "Ongedaan maken"}
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
        <form autoComplete="off" className="formInvoices">
          <FormControl className="formControlInvoices">
            <InputLabel htmlFor="age-simple">Kwartaal</InputLabel>
            <Select
              value={this.state.kwartaal}
              onChange={this.handleChangeKwartaal}
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
              onChange={this.handleChangePaid}
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
                {this.filterData().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
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
                      <TableCell className="paidColumnInvoices">
                        <FlatButton 
                          label={n.datePaid ? "Annuleer" : "Betalen"}
                          primary={!n.datePaid}
                          secondary={n.datePaid} 
                          onClick={event => this.handleOpenConfirmationDialogPaid(event, n.key, n.datePaid)}                          
                        />
                      </TableCell>
                      <TableCell className="dossierNrColumnInvoices">{n.dossierNr}</TableCell>
                      <TableCell className="fullNameColumnInvoices">{n.fullName}</TableCell>
                      <TableCell className="aardInvoiceColumnInvoices">{n.aardInvoice}</TableCell>
                      <TableCell className="feeColumnInvoices">€{n.fee}</TableCell>
                      <TableCell className="dateCreatedColumnInvoices">{n.dateCreated}</TableCell>
                      <TableCell className="datePaidColumnInvoices">{n.datePaid}</TableCell>
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
            title={this.state.dialogContent}
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