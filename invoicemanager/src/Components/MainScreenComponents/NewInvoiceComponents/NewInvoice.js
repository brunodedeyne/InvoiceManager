import React, { Component } from 'react';
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import HomeIcon from "../../../assets/img/house.png";
import PhoneIcon from "../../../assets/img/phone.png";
import EmailIcon from "../../../assets/img/email.png";
import BTWIcon from "../../../assets/img/btw.png";
import NumberIcon from "../../../assets/img/number.png";
import BuildingIcon from "../../../assets/img/building.png";
import AardIcon from "../../../assets/img/aard.png";
import DossierIcon from "../../../assets/img/dossier.png";
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

//Import CSS
import './NewInvoice.css';

const items = [];
for (let i = 0; i < 100; i++ ) {
  items.push(<MenuItem value={i} key={i} primaryText={`Item ${i}`} />);
}

export default class NewInvoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            Fee: '',
            Aard: '',
            value: 10
        };
    }
    
    handleChange = (event, index, value) => this.setState({value});
    
    handleExpandChange = (expanded) => {
        this.setState({expanded: expanded});
    };
    
    handleToggle = (event, toggle) => {
        this.setState({expanded: toggle});
    };
    
    handleExpand = () => {
        this.setState({expanded: true});
    };
    
    handleReduce = () => {
        this.setState({expanded: false});
    };

    updateFee = (e) =>{ 
        this.setState({Fee: e.target.value});
    }

    updateAard = (e) =>{ 
        this.setState({Aard: e.target.value});
    }


    render() {
      return (
        <section className="form__Container">    
        <DropDownMenu maxHeight={300} value={this.state.value} onChange={this.handleChange}>
            {items}
        </DropDownMenu>
        <div className="contactCardInvoice">
            <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
                <CardTitle className="title" title={this.state.name + " " + this.state.familyName } expandable={true}/>
                <CardText className="Text" expandable={true}>
                    <div className="info personalInfo">
                        <p> 
                            <img src={HomeIcon} alt="Address Icon" className="addressContactCardImg"/>
                            <div className="addressContactCard">{this.state.street}<br/>
                            {this.state.cityDummy}</div>
                        </p>
                        <p>
                            <img src={PhoneIcon} alt="Phone Icon"/>
                            <div>{this.state.phone}</div>
                        </p>
                        <p>
                            <img src={EmailIcon} alt="Email Icon"/>
                            <div>{this.state.email}</div>
                        </p>
                        <p>
                            <img src={BTWIcon} alt="BTW Icon"/>
                            <div className={ this.state.BTWClasses }>{this.state.BTW}</div>
                        </p>
                        <p>
                            <img src={NumberIcon} alt="Number Icon"/>
                            <div className={ this.state.numberClassesCard }>{this.state.number}</div>
                        </p>
                    </div>
                    <div></div>
                    <div className="info buildingInfo">
                        <p> 
                            <img src={DossierIcon} alt="Dossier Icon" />
                            <div>{this.state.dossierNummer}</div>
                        </p>
                        <p> 
                            <img src={BuildingIcon} alt="Building Icon" className="addressContactCardImg"/>
                            <div className="addressContactCard">{this.state.buildingStreet}<br/>
                            {this.state.buildingCityDummy}</div>
                        </p>
                        <p>
                            <img src={AardIcon} alt="Aard Icon"/>
                            <div className="aardContactCard">{this.state.Aard}</div>
                        </p>
                    </div>
                </CardText>
                <CardActions className="buttons">
                    <FlatButton label="Preview Contact" onClick={this.handleExpand} />
                    <FlatButton label="Verberg Contact"  onClick={this.handleReduce}/>
                </CardActions>
            </Card>
        </div>
            <form className="form" autoComplete="off">
                <div className="form__Plan">
                    <TextField
                        name="Ereloon"
                        floatingLabelText="Ereloon"
                        className="form__TextField"
                        onChange={this.updateFee}
                    />
                    <TextField
                        name="Aard"
                        floatingLabelText="Aard"
                        className="form__TextField"
                        onChange={this.updateAard}
                    />
                </div>
                <div className="SubmitButton">
                    <button enabled="false" className="RaisedButton" onSubmit={(event) => this.auth(event) } ref={(form) => {this.loginForm = form}} href="/NewPlan">NIEUWE FACTUUR</button>
                </div>
            </form>
        </section>
      );
    }
  }