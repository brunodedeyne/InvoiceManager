// Import Default Components
import React, { Component } from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Switch, 
  withRouter, 
  Link
} from 'react-router-dom';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import classNames from 'classnames';
import Badge from 'material-ui/Badge';

// Import Custom Components
import NewPlan from './Components/MainScreenComponents/NewPlanComponents/NewPlan';
import NewInvoice from './Components/MainScreenComponents/NewInvoiceComponents/NewInvoice';
import MyAccount from './Components/MainScreenComponents/MyAccountComponents/MyAccount';
import Overview from './Components/MainScreenComponents/OverviewComponents/Overview';
import Clients from './Components/MainScreenComponents/ClientsComponents/Clients';
import Invoices from './Components/MainScreenComponents/InvoicesComponents/Invoices';
import Login from './Components/LoginComponents/Login';
import Loading from './Components/Loading';

// Import Icons
import {
  CreateNewFolder as NewPlanIcon,
  ViewHeadline as OverviewIcon,
  Folder as ClientsIcon,
  NoteAdd as NewInvoiceIcon,
  Description as InvoicesIcon,
  Menu as MenuIcon
} from '@material-ui/icons';

// Import Material UI Components
import {
  Divider,
  Typography,
  List,
  Toolbar,
  AppBar,
  Drawer,
  IconButton,
  Avatar,
  Button,
  Menu,
  MenuItem,
  ListItem,
  ListItemIcon,
  ListItemText,
  withStyles
} from '@material-ui/core';

// Import Database
import * as routes from './constants/routes/routes';
import * as firebase from 'firebase';

// Import CSS
import './App.css';
injectTapEventPlugin();

// Database Config + init Database
var config = {
  apiKey: "AIzaSyDiYwctQZs8cq4LwrUJ0JZvs0ne2f9Bjbg",
  authDomain: "invoicemanager-1525702104034.firebaseapp.com",
  databaseURL: "https://invoicemanager-1525702104034.firebaseio.com",
  projectId: "invoicemanager-1525702104034",
  storageBucket: "invoicemanager-1525702104034.appspot.com",
  messagingSenderId: "908003589667"
};
firebase.initializeApp(config);

// Set DrawerWidth
const drawerWidth = 240;

// Set Basicstyles For the Components
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
    // marginLeft: 12,
    // marginRight: 36,
    float: 'left',
    marginLeft: -12,
    marginRight: 20,
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
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      anchorEl: null,
      avatarButton: '',
      profileUid: '',
      title: 'Overzicht',
      numberOfUnpaidInvoices: 0,
      valueBottom: 0,
    }

    this.database = firebase.database().ref('/invoices');
    this.getNumberOfUnPaidInvoices = this.getNumberOfUnPaidInvoices.bind(this);
  }

  handleSignOut = () => {
    firebase.auth().signOut().then(function () {
      this.props.history.push('/InvoiceManager/Inloggen');
    }).catch(function (error) {

    });
  }

  getNumberOfUnPaidInvoices() {
    let itemsInvoices = [];
    let tempNumber = 0;
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      firebase.database().ref('/invoices').on('value', (snapshotInvoices) => {
        itemsInvoices = Object.values(snapshotInvoices.val()).map((itemInvoices) => {
          if (user) {            
            if (itemInvoices.userUid == user.uid) {
              return itemInvoices;
            }
          }
        });
        this.setState({ dataInvoices: itemsInvoices });

        let number = 0;
        itemsInvoices = itemsInvoices.filter(Boolean);
        if (itemsInvoices != "") {
          for (var i = 0; i < itemsInvoices.length; i++) {
            if (itemsInvoices[i].datePaid == "") number++;
          }
          tempNumber = number;
          this.setState({ numberOfUnpaidInvoices: tempNumber });
        }
      });
    });
  }

  componentDidMount() {
    var currentRoute = window.location.href.split('/')[(window.location.href.split('/').length) - 1];
    if (currentRoute == "Cli%C3%ABnten") currentRoute = "Cliënten";
    if (currentRoute == "") this.setState({ title: "Overzicht" });
    else this.setState({ title: currentRoute.replace('_', ' ') });
    this.getNumberOfUnPaidInvoices();
    var avatarButton = '';
    var tempUid = '';

    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.providerData.forEach(function (profile) {
          tempUid = profile.uid;
        });
        avatarButton = tempUid.substring(0, 1).toUpperCase() + tempUid.split('.')[1].substring(0, 1).toUpperCase()
      }
      this.setState({
        loading: false,
        user: user,
        avatarButton: avatarButton,
      });
    });
    // var tempNumberOfUnpaidInvoices = 0;

    // this.database.on('value', snapshot => {
    //   tempNumberOfUnpaidInvoices = snapshot.numChildren();
    // })
    // this.setState({ numberOfUnpaidInvoices: tempNumberOfUnpaidInvoices });
    // this.forceUpdate();
  }

  componentWillUnmount() {
    this.authSubscription();
  }

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    if (this.state.loading) return (
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
                    className={classNames(classes.appBar, true && classes.appBarShift, "appBarToolbar")}
                  >
                    <Toolbar disableGutters={false}>
                      <section className="archBureau">
                        <p>Architectenbureau</p><br />
                        <p>Dedeyne - Coomans</p>
                      </section>
                      <div className={classes.toolbar}>
                      </div>
                      <Typography variant="title" color="inherit" noWrap>
                        {this.state.title}
                      </Typography>
                      <p className="header__Logout">
                        <Button
                          aria-owns={anchorEl ? 'simple-menu' : null}
                          aria-haspopup="true"
                          onClick={(event) => this.setState({ anchorEl: event.currentTarget })}
                        >
                          <Avatar className="avatar">{this.state.avatarButton}</Avatar>
                        </Button>
                      </p>
                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => this.setState({ anchorEl: null })}
                      >
                        <Link to={routes.My_ACCOUNT} onClick={(value) => this.setState({ title: "Mijn Account", value })}><MenuItem onClick={() => this.setState({ anchorEl: null })}>Mijn Account</MenuItem></Link>
                        <MenuItem onClick={this.handleSignOut}>Uitloggen</MenuItem>
                      </Menu>
                    </Toolbar>
                  </AppBar>


                  <AppBar
                    className="appBarTabs"
                  >
                    <Toolbar>
                      <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                        <MenuIcon onClick={() => this.setState({left: true})} />
                      </IconButton>
                      <Typography variant="title" color="inherit" className={classes.flex}>
                        {this.state.title}
                      </Typography>
                      <div>
                        <IconButton
                          aria-owns={null}
                          aria-haspopup="true"
                          onClick={(event) => this.setState({ anchorEl: event.currentTarget })}
                          color="inherit"
                        >
                          <Avatar className="avatar">{this.state.avatarButton}</Avatar>
                        </IconButton>
                        <Menu
                          id="simple-menu"
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={this.handleCloseAccountMenu}
                        >
                          <Link to={routes.My_ACCOUNT} onClick={(value) => this.setState({ title: "Mijn Account", value })}><MenuItem onClick={this.handleMyAccount}>Mijn Account</MenuItem></Link>
                          <MenuItem onClick={this.handleSignOut}>Uitloggen</MenuItem>
                        </Menu>
                      </div>
                    </Toolbar>
                  </AppBar>


                  <Drawer open={this.state.left} onClose={() => this.setState({left: false})}>
                    <div
                      tabIndex={0}
                      role="button"
                      onClick={() => this.setState({left: false})}
                      onKeyDown={() => this.setState({left: true})}
                    >
                      <section className={classes.flex + " archBureau"}>
                        <p>Architectenbureau</p><br />
                        <p>Dedeyne - Coomans</p>
                      </section>
                      <Divider />
                      <List className="newStuff">
                        <div className="newStuffDivider">
                          <Link to={routes.NEW_PLAN} onClick={(value) => this.setState({ title: "Nieuw Plan", value })}>
                            <ListItem button>
                              <ListItemIcon className="listItems">
                                <NewPlanIcon />
                              </ListItemIcon>
                              <ListItemText primary="Nieuw Plan" className="listItems" />
                            </ListItem>
                          </Link>
                          <Link to={routes.NEW_INVOICE} onClick={(value) => this.setState({ title: "Nieuwe Factuur", value })}>
                            <ListItem button>
                              <ListItemIcon className="listItems">
                                <NewInvoiceIcon />
                              </ListItemIcon>
                              <ListItemText primary="Nieuwe Factuur" className="listItems" />
                            </ListItem>
                          </Link>
                        </div>
                      </List>
                      <Divider />
                      <List>
                        <div>
                          <Link to={routes.OVERVIEW} onClick={(value) => this.setState({ title: "Overzicht", value })}>
                            <ListItem button>
                              <ListItemIcon className="listItems">
                                <OverviewIcon />
                              </ListItemIcon>
                              <ListItemText primary="Overzicht" className="listItems" />
                            </ListItem>
                          </Link>
                          <Link to={routes.CLIENTS} onClick={(value) => this.setState({ title: "Cliënten", value })}>
                            <ListItem button>
                              <ListItemIcon className="listItems">
                                <ClientsIcon />
                              </ListItemIcon>
                              <ListItemText primary="Cliënten" className="listItems" />
                            </ListItem>
                          </Link>
                          <Link to={routes.INVOICES} onClick={(value) => this.setState({ title: "Facturatie", value })}>
                            <ListItem button>
                              <Badge
                                badgeContent={this.state.numberOfUnpaidInvoices}
                                secondary={true}
                                className="badge"
                              >
                                <ListItemIcon className="listItems">
                                  <InvoicesIcon />
                                </ListItemIcon >
                              </Badge>
                              <ListItemText primary="Facturatie" className="listItems" />
                            </ListItem>
                          </Link>
                        </div>
                      </List>
                    </div>
                  </Drawer>


                  <Drawer
                    variant="permanent"
                    classes={{
                      paper: classNames(classes.drawerPaper, false && classes.drawerPaperClose),
                    }}
                    className="Drawer appTool"
                  >
                    <List className="newStuff">
                      <div className="newStuffDivider">
                        <Link to={routes.NEW_PLAN} onClick={(value) => this.setState({ title: "Nieuw Plan", value })}>
                          <ListItem button>
                            <ListItemIcon className="listItems">
                              <NewPlanIcon />
                            </ListItemIcon>
                            <ListItemText primary="Nieuw Plan" className="listItems" />
                          </ListItem>
                        </Link>
                        <Link to={routes.NEW_INVOICE} onClick={(value) => this.setState({ title: "Nieuwe Factuur", value })}>
                          <ListItem button>
                            <ListItemIcon className="listItems">
                              <NewInvoiceIcon />
                            </ListItemIcon>
                            <ListItemText primary="Nieuwe Factuur" className="listItems" />
                          </ListItem>
                        </Link>
                      </div>
                    </List>
                    <Divider />
                    <List>
                      <div>
                        <Link to={routes.OVERVIEW} onClick={(value) => this.setState({ title: "Overzicht", value })}>
                          <ListItem button>
                            <ListItemIcon className="listItems">
                              <OverviewIcon />
                            </ListItemIcon>
                            <ListItemText primary="Overzicht" className="listItems" />
                          </ListItem>
                        </Link>
                        <Link to={routes.CLIENTS} onClick={(value) => this.setState({ title: "Cliënten", value })}>
                          <ListItem button>
                            <ListItemIcon className="listItems">
                              <ClientsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Cliënten" className="listItems" />
                          </ListItem>
                        </Link>
                        <Link to={routes.INVOICES} onClick={(value) => this.setState({ title: "Facturatie", value })}>
                          <ListItem button>
                            <Badge
                              badgeContent={this.state.numberOfUnpaidInvoices}
                              secondary={true}
                              className="badge"
                            >
                              <ListItemIcon className="listItems">
                                <InvoicesIcon />
                              </ListItemIcon >
                            </Badge>
                            <ListItemText primary="Facturatie" className="listItems" />
                          </ListItem>
                        </Link>
                      </div>
                    </List>
                  </Drawer>
                  <main className={classes.content + " content"}>
                    <div className={classes.toolbar} />
                    <Switch>
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
                      <Route
                        path="*"
                        component={() => <Overview />}
                      />
                    </Switch>
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