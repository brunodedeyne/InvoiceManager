import React, { Component } from 'react';
import AddButton from './AddButtonComponents/AddButton';
import OverviewButton from './OverviewButtonComponents/OverviewButton';
import LogoutButton from './LogoutButtonComponents/LogoutButton';
import { Link } from 'react-router-dom';
import * as routes from '../../constants/routes/routes';

//Import CSS
import './Menu.css';

class Menu extends Component {
  render() {
    return (
        <div>
            <section className="div__Sidebar">
                <section>
                    <Link to={routes.NEW_PLAN}><AddButton buttontext="Nieuw Plan"/></Link>    
                    <Link to={routes.NEW_INVOICE}><AddButton buttontext="Nieuwe Factuur"/></Link>                    
                    <Link to={routes.OVERVIEW}><OverviewButton buttontext="Overzicht"/></Link>
                    <Link to={routes.CLIENTS}><OverviewButton buttontext="Cliënten"/></Link>
                    <Link to={routes.INVOICES}><OverviewButton buttontext="Facturatie"/></Link>
                </section>
                <section className="div__Sidebar-UnderSection">
                    <p className="div__Sidebar-Copyright">&copy; Bruno Dedeyne</p>
                </section>
            </section>
        </div>
    );
  }
}

export default Menu;