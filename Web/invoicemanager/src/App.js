import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { browserHistory } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Redirect } from 'react-router'

//import Main from './Components/Main';
import NewPlan from './Components/MainScreenComponents/NewPlanComponents/NewPlan';
import NewInvoice from './Components/MainScreenComponents/NewInvoiceComponents/NewInvoice';
import MyAccount from './Components/MainScreenComponents/MyAccountComponents/MyAccount';
import Overview from './Components/MainScreenComponents/OverviewComponents/Overview';
import Clients from './Components/MainScreenComponents/ClientsComponents/Clients';
import Invoices from './Components/MainScreenComponents/InvoicesComponents/Invoices';
import Header from './Components/HeaderComponents/Header';
import Login from './Components/LoginComponents/Login';
import Loading from './Components/Loading';
import NewInvoiceIcon from '@material-ui/icons/NoteAdd';
import NewPlanIcon from '@material-ui/icons/CreateNewFolder';
import OverviewIcon from '@material-ui/icons/ViewHeadline';
import ClientsIcon from '@material-ui/icons/Folder';
import InvoicesIcon from '@material-ui/icons/Description';

import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
//import { mailFolderListItems, otherMailFolderListItems, newStuff, overviewStuff } from './Components/HeaderComponents/tileData';
import './Components/HeaderComponents/Header.css';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';
//import './Components/HeaderComponents/tileData.css';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';

import * as routes from './constants/routes/routes';
import * as firebase from 'firebase';

//Import CSS
import './assets/css/styles.min.css';
import './App.css';
injectTapEventPlugin();

var config = {
  apiKey: "AIzaSyDiYwctQZs8cq4LwrUJ0JZvs0ne2f9Bjbg",
  authDomain: "invoicemanager-1525702104034.firebaseapp.com",
  databaseURL: "https://invoicemanager-1525702104034.firebaseio.com",
  projectId: "invoicemanager-1525702104034",
  storageBucket: "invoicemanager-1525702104034.appspot.com",
  messagingSenderId: "908003589667"
};

firebase.initializeApp(config);

const drawerWidth = 240;

const styles = theme => ({  
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
    float: 'left',
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
  },
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      open: false,
      anchorEl: null,
      avatarButton: '',
      width: 0, 
      height: 0,
      avatarButton: '',
      profileUid: '',
      title: 'Default',
      numberOfUnpaidInvoices: 0,
      zIndexCss: ''
    }

    this.database = firebase.database().ref('/invoices');
    this.handleClickAccountMenu = this.handleClickAccountMenu.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.getNumberOfUnPaidInvoices = this.getNumberOfUnPaidInvoices.bind(this);
    this.changeURL = this.changeURL.bind(this);
  }  

  handleDrawerOpen = () => {
    this.setState({ open: true, });
  };

  handleDrawerClose = () => {
    this.setState({ open: false, zIndexCss: "header__HighZIndex" });
  };

  handleClickAccountMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleCloseAccountMenu = () => {
    this.setState({ anchorEl: null });
  };

  handleSignOut = () => {
    firebase.auth().signOut().then(function() {
      this.props.history.push('/Inloggen');
    }).catch(function(error) {
      console.log(error);
    });
  }

  handleMyAccount = () => {
    this.setState({ anchorEl: null });
  }

  updateWindowDimensions() {
    if (window.innerWidth <= 600) this.setState({open: false});
    else if (window.innerWidth > 600) this.setState({open: true});
  }

  getNumberOfUnPaidInvoices () {   
    let itemsInvoices = [];
    let tempNumber = 0;
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      firebase.database().ref('/invoices').on('value', (snapshotInvoices) => {
        itemsInvoices = Object.values(snapshotInvoices.val()).map((itemInvoices) => { 
          if (user){
            if (itemInvoices.userUid == user.uid) {     
              return itemInvoices; 
            }
          }
        });     
        itemsInvoices = itemsInvoices.filter(Boolean);
        this.setState({dataInvoices: itemsInvoices});    

        let number = 0;
        if (itemsInvoices != ""){
          for (var i = 0; i < itemsInvoices.length; i++){
            if (itemsInvoices[i].datePaid == "") number++;
          }
          tempNumber = number;
          this.setState({numberOfUnpaidInvoices: tempNumber});
        }        
      });
    });
  }

  changeURL (url){
    this.setState({ title: url});
  }

  componentDidMount() {
    console.log(process.env.PUBLIC_URL);
    if (window.innerWidth <= 600) this.setState({open: false});
    else if (window.innerWidth > 600) this.setState({open: true});
    var currentRoute = window.location.href.split('/')[(window.location.href.split('/').length) - 1];
    this.setState({ title: currentRoute.replace('_', ' ')});
    this.getNumberOfUnPaidInvoices(); 
    var avatarButton = '';
    var tempUid = '';

    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      if (user) {        
        user.providerData.forEach(function (profile) {      
          tempUid = profile.uid;
        });
        avatarButton = tempUid.substring(0,1).toUpperCase() + tempUid.split('.')[1].substring(0, 1).toUpperCase()
      }
      else {
        console.log("Uitgelogd: "  + user);
      }
      this.setState({
        loading: false,
        user: user,
        avatarButton: avatarButton,
      });            
    });
    window.addEventListener('resize', this.updateWindowDimensions);

    var tempNumberOfUnpaidInvoices = 0;

    this.database.on('value', snapshot => {
      tempNumberOfUnpaidInvoices = snapshot.numChildren();
    }) 
    this.setState({numberOfUnpaidInvoices: tempNumberOfUnpaidInvoices});
    this.forceUpdate();
  }

  componentWillUnmount() {
    this.authSubscription();
  }

render () {
  const { classes, theme } = this.props;
  const { anchorEl } = this.state;
  if (this.state.loading) return(
    <Loading />
  );
  if (this.state.user) 
  return (
    <div className="AppDiv">
      <Router>
        <MuiThemeProvider>
          <div className="App">
            <div className={"root header__Container header__ZIndex"}>
              <AppBar
                position="absolute"
                className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
              >
                <Toolbar disableGutters={!this.state.open}>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={this.handleDrawerOpen}
                    className={classNames(classes.menuButton, this.state.open && classes.hide)}
                  >
                    <MenuIcon />
                  </IconButton>
                  <div className={classes.toolbar}>
                    <IconButton 
                      onClick={this.handleDrawerClose}
                      className={classNames(classes.menuButton, !this.state.open && classes.hide)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                  <Typography variant="title" color="inherit" noWrap>
                    {this.state.title}
                  </Typography>
                  <p className="header__Logout">
                    <Button
                      aria-owns={anchorEl ? 'simple-menu' : null}
                      aria-haspopup="true"
                      onClick={this.handleClickAccountMenu}
                    >
                      <Avatar className="avatar">BD</Avatar>
                    </Button>
                  </p>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleCloseAccountMenu}
                  >
                    <Link to={routes.My_ACCOUNT}  onClick={() => this.changeURL("Mijn Account")}><MenuItem onClick={this.handleMyAccount}>Mijn Account</MenuItem></Link>
                    <MenuItem onClick={this.handleSignOut}>Uitloggen</MenuItem>
                  </Menu>
                </Toolbar>
                
              </AppBar>
              <Drawer
                variant="permanent"
                classes={{
                  paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
                }}
                className="Drawer"
                open={this.state.open}
              >
                <div className={classes.toolbar}>
   
                </div>
                <List className="newStuff">
                  <div className="newStuffDivider">
                    <Link to={routes.NEW_PLAN} onClick={() => this.changeURL("Nieuw Plan")}>
                      <ListItem button>
                        <ListItemIcon className="listItems">
                          <NewPlanIcon />
                        </ListItemIcon>
                        <ListItemText primary="Nieuw Plan" className="listItems"/>
                      </ListItem>
                    </Link>
                    <Link to={routes.NEW_INVOICE} onClick={() => this.changeURL("Nieuwe Factuur")}>
                      <ListItem button>
                        <ListItemIcon className="listItems">
                          <NewInvoiceIcon />
                        </ListItemIcon>
                        <ListItemText primary="Nieuwe Factuur" className="listItems"/>
                      </ListItem>
                    </Link>
                  </div>
                </List>
                <List>
                <div>
                  <Link to={routes.OVERVIEW} onClick={() => this.changeURL("Overzicht")}>
                    <ListItem button>
                      <ListItemIcon className="listItems">
                        <OverviewIcon />
                      </ListItemIcon>
                      <ListItemText primary="Overzicht"  className="listItems"/>
                    </ListItem>
                  </Link>
                  <Link to={routes.CLIENTS} onClick={() => this.changeURL("Cliënten")}>
                    <ListItem button>
                      <ListItemIcon className="listItems">
                        <ClientsIcon />
                      </ListItemIcon>
                      <ListItemText primary="Cliënten" className="listItems"/>
                    </ListItem>
                  </Link>  
                  <Link to={routes.INVOICES} onClick={() => this.changeURL("Facturatie")}>
                    <ListItem button>
                      <Badge
                        badgeContent={this.state.numberOfUnpaidInvoices }
                        secondary={true}
                        className="badge"
                      >
                        <ListItemIcon className="listItems">
                          <InvoicesIcon />
                        </ListItemIcon >
                      </Badge>
                      <ListItemText primary="Facturatie" className="listItems"/>
                    </ListItem>
                  </Link>    
                </div>
              </List>
              </Drawer>
              <main className={classes.content + " content"}>
                <div className={classes.toolbar} />
                <Route
                  exact path={routes.NEW_PLAN}
                  component={() => <NewPlan />}
                /> 
                <Route
                  exact path={routes.NEW_INVOICE}
                  component={() => <NewInvoice />}
                />
                <Route
                  exact path={routes.OVERVIEW}
                  component={() => <Overview />}
                />
                <Route
                  exact path={routes.CLIENTS}
                  component={() => <Clients />}
                />
                <Route
                  exact path={routes.INVOICES}
                  component={() => <Invoices />}         
                />    
                <Route
                  exact path={routes.LOGIN}
                  component={() => <Login />}         
                />
                <Route
                  exact path={routes.My_ACCOUNT}
                  component={() => <MyAccount />}         
                />
              </main>
            </div>   
          </div>
        </MuiThemeProvider>
        </Router>
      </div>
    );
  return (
    <div className="AppDiv">
      <MuiThemeProvider>
        <Login />
      </MuiThemeProvider>
    </div>
  )
}
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(App);