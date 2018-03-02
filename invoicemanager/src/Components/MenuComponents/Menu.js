import React, { Component } from 'react';
import AddButton from './AddButtonComponents/AddButton';
import OverviewButton from './OverviewButtonComponents/OverviewButton';
import LogoutButton from './LogoutButtonComponents/LogoutButton';

//Import CSS
import './Menu.css';

class Menu extends Component {
  render() {
    return (
        <div>
            <section className="div__Sidebar">
                <section>
                    <AddButton buttontext="Nieuw Plan"/>
                    <AddButton buttontext="Nieuwe Factuur"/>
                    <OverviewButton buttontext="Overzicht"/>
                    <OverviewButton buttontext="Plannen"/>
                    <OverviewButton buttontext="Facturatie"/>
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