import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import NewInvoiceIcon from '@material-ui/icons/NoteAdd';
import NewPlanIcon from '@material-ui/icons/CreateNewFolder';
import OverviewIcon from '@material-ui/icons/ViewHeadline';
import ClientsIcon from '@material-ui/icons/Folder';
import InvoicesIcon from '@material-ui/icons/Description';
import { Link } from 'react-router-dom';
import * as routes from '../../constants/routes/routes';
import './tileData.css';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';

import * as firebase from 'firebase';


export const newStuff = (
  <div className="newStuffDivider">
    <Link to={routes.NEW_PLAN}>
      <ListItem button>
        <ListItemIcon className="listItems">
          <NewPlanIcon />
        </ListItemIcon>
        <ListItemText primary="Nieuw Plan" className="listItems"/>
      </ListItem>
    </Link>
    <Link to={routes.NEW_INVOICE}>
      <ListItem button>
        <ListItemIcon className="listItems">
          <NewInvoiceIcon />
        </ListItemIcon>
        <ListItemText primary="Nieuwe Factuur" className="listItems"/>
      </ListItem>
    </Link>
  </div>
);

export const overviewStuff = (
  <div>
    <Link to={routes.OVERVIEW}>
      <ListItem button>
        <ListItemIcon className="listItems">
          <OverviewIcon />
        </ListItemIcon>
        <ListItemText primary="Overzicht"  className="listItems"/>
      </ListItem>
    </Link>
    <Link to={routes.CLIENTS}>
      <ListItem button>
        <ListItemIcon className="listItems">
          <ClientsIcon />
        </ListItemIcon>
        <ListItemText primary="Cliënten" className="listItems"/>
      </ListItem>
    </Link>  
    <Link to={routes.INVOICES}>
      <ListItem button>
        <Badge
          
          secondary={true}
          className="badge"
          badgeContent={5}
        >
          <ListItemIcon className="listItems">
            <InvoicesIcon />
          </ListItemIcon >
        </Badge>
        <ListItemText primary="Facturatie" className="listItems"/>
      </ListItem>
    </Link>
    
  </div>
);