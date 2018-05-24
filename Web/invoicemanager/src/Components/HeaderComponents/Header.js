import React from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { newStuff, overviewStuff } from './tileData';
import './Header.css';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import * as routes from '../../constants/routes/routes';
import * as firebase from 'firebase';

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Logo from './Logo';
import './Header.css';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 430,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
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
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
});

class Header extends React.Component {
  constructor (props ){
    super (props);
    this.state = {
      open: true,
      anchorEl: null,
      avatarButton: '',
      width: 0, 
      height: 0,
      avatarButton: '',
      unPaid: 0
    }

    this.handleClickAccountMenu = this.handleClickAccountMenu.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.getInvoicesNumber = this.getInvoicesNumber.bind(this);
    this.getInvoices = this.getInvoices.bind(this);
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleClickAccountMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleCloseAccountMenu = () => {
    this.setState({ anchorEl: null });
  };

  handleSignOut = () => {
    firebase.auth().signOut().then(function() {
      this.props.history.push('/Login');
    }).catch(function(error) {
      console.log(error);
    });
  }

  async componentDidMount() {
    await this.getInvoices();
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

    var user = firebase.auth().currentUser;
    var tempUid = '';

    if (user != null) {
      user.providerData.forEach(function (profile) {      
        tempUid = profile.uid;
      });
      this.setState({profileUid: tempUid});
    }
    
    let avatarButton = tempUid.substring(0,1).toUpperCase() + tempUid.split('.')[1].substring(0, 1).toUpperCase()
    this.setState({avatarButton: avatarButton});
  }

  async getInvoices () {
    let allInvoices = [];
    firebase.database().ref('/invoices').on('value', (snapshot) => {
      allInvoices = Object.values(snapshot.val()).map((item, i) => { 
          return item; 
      });      
      this.setState({invoices: allInvoices});
    });  

    await this.getInvoicesNumber();
  }

  getInvoicesNumber () {
    
    var temptUnpaid = 0;

    for (var i = 0; i < this.state.invoices.length; i++){
      if (this.state.invoices[i].datePaid === "") {
        temptUnpaid++;
      }
    }
    this.setState({unPaid: temptUnpaid});
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    if (this.state.width <= 620) this.setState({open: false});
    else if (this.state.width > 620) this.setState({open: true});
  }

  render (){
    const { classes, theme } = this.props;
    const { anchorEl } = this.state;

    return (
      <div className={classes.root + " header__Container"}>
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
              {/* <Logo text="Dedeyne - Coomans"/> */}
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
              Invoice Manager
            </Typography>
            <p className="header__Logout">
              <Button
                aria-owns={anchorEl ? 'simple-menu' : null}
                aria-haspopup="true"
                onClick={this.handleClickAccountMenu}
              >
                <Avatar className="avatar">{this.state.avatarButton}</Avatar>
              </Button>
            </p>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleCloseAccountMenu}
            >
              <MenuItem onClick={this.handleMyAccount}>Mijn Account</MenuItem>
              <MenuItem onClick={this.handleSignOut}>Uitloggen</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>{newStuff}</List>
          <Divider />
          <List>{overviewStuff}</List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Typography noWrap>{'You think water moves fast? You should see ice.'}</Typography>
        </main>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Header);