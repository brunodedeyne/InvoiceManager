import React from 'react';
import HomeIcon from "../../../assets/img/house.png";
import PhoneIcon from "../../../assets/img/phone.png";
import EmailIcon from "../../../assets/img/email.png";
import BTWIcon from "../../../assets/img/btw.png";
import NumberIcon from "../../../assets/img/rrn.png";
import BuildingIcon from "../../../assets/img/building.png";
import AardIcon from "../../../assets/img/aard.png";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';


class DialogContactCard extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            expanded: true,
        };
    }

    handleOpenPreview = () => {
        this.setState({openPreview: true});
    };

    handleClosePreview = () => {
        this.setState({openPreview: false});
    };

    handleExpandChange = (expanded) => {
        this.setState({expanded: expanded});
    };

    render () {
        return (            
            <div>
                <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange} className="contactCard">
                    <CardTitle className="title" title={this.props.data.nameDummy + " " + this.props.data.familyNameDummy} expandable={true}/>
                    <CardText className="Text" expandable={true}>
                        <div className="infoNewPlan personalInfoNewPlan">
                            <div> 
                                {this.props.data}
                                <img src={HomeIcon} alt="Address Icon" className="addressContactCardImg"/>
                                <div className="addressContactCard">{this.props.data.streetDummy}<br/>
                                {this.props.data.cityDummy}</div>
                            </div>
                            <div>
                                <img src={PhoneIcon} alt="Phone Icon"/>
                                <div>{this.props.data.phoneDummy}</div>
                            </div>
                            <div>
                                <img src={EmailIcon} alt="Email Icon"/>
                                <div>{this.props.data.emailDummy}</div>
                            </div>
                            <div>
                                <img src={BTWIcon} alt="BTW Icon"/>
                                                                        
                            </div>
                            <div>
                                <img src={NumberIcon} alt="Number Icon"/>
                                <div className={ this.props.data.numberClassesCard }>{this.props.data.numerDummy}</div>
                            </div>
                        </div>
                        <div></div>
                        <div className="infoNewPlan buildingInfoNewPlan">
                            <div> 
                                <img src={BuildingIcon} alt="Building Icon" className="addressContactCardImg"/>
                                <div className="addressContactCard">{this.props.data.buildingStreetDummy}<br/>
                                {this.props.data.buildingCityDummy}</div>
                            </div>
                            <div>
                                <img src={AardIcon} alt="Aard Icon"/>
                                <div className="aardContactCard">{this.props.data.AardDummy}</div>
                            </div>
                        </div>
                    </CardText>
                </Card>
            </div>            
        )
    }
};

export default DialogContactCard;