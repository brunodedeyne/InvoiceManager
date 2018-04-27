import React, { Component } from 'react';

import LoginForm from "./LoginFormComponents/LoginForm";
import logoImg from "../../assets/img/logo2.png";
import Header from '../HeaderComponents/Header';
import Menu from '../MenuComponents/Menu';
import AddButton from '../MenuComponents/AddButtonComponents/AddButton';
import OverviewButton from '../MenuComponents/OverviewButtonComponents/OverviewButton';

//Import CSS
import './Login.css';

class Login extends Component {
    state = {
        fields: {}
    };

    onChange = updatedValue => {
        this.setState({
            fields: {
            ...this.state.fields,
            ...updatedValue
            }
        });
    };
      
  render() {
    return (
        <section className="section">
            <section className="section__Background">
                <header className="header">
                    <section className="section__Logo"></section>
                    <p className="header__Title"></p>
                </header>
                <div>
                    <section className="div__Sidebar">
                        <section>
                            <AddButton buttontext=""/>
                            <AddButton buttontext=""/>
                            <OverviewButton buttontext=""/>
                            <OverviewButton buttontext=""/>
                            <OverviewButton buttontext=""/>
                        </section>
                    </section>
                </div>
            </section>
            <div className="section__Box">
                <img src={logoImg} alt="logo" className="section__Img" />
                    <LoginForm className="section__loginForm" />                 
            </div>            
        </section>
    );
  }
}

export default Login;