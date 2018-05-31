import React, { Component } from 'react';

import NewInvoice from '../NewInvoiceComponents/NewInvoice';
import NewPlan from '../NewPlanComponents/NewPlan';
import Invoices from '../InvoicesComponents/Invoices';
import Clients from '../ClientsComponents/Clients';
import Overview from '../OverviewComponents/Overview';

import * as firebase from 'firebase';
import {
    Container,
    Header,
    Content,
    Icon,
    Text,
    Footer,
    FooterTab,
    Button,
    Body,
    Title,
    Right,
    ActionSheet,
    Root,
    Left
} from 'native-base';

var BUTTONS = [
    { text: "Nieuw Plan", icon: "american-football", iconColor: "#2c8ef4" },
    { text: "Nieuwe Factuur", icon: "analytics", iconColor: "#f42ced" },
    { text: "Cancel", icon: "close", iconColor: "#25de5b" }
];
var CANCEL_INDEX = 2;

class LoggedInStack extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: ''
        };
    }

    renderSelectedTab() {
        switch (this.state.selectedTab) {
            case 'Overzicht':
                return (<Overview />);
                break;
            case 'Cliënten':
                return (<Clients />);
                break;
            case 'Facturatie':
                return (<Invoices />);
                break;
            default:
        }
    }

    render() {
        return (
                <Container>
                    <Header padder>
                        <Left>
                            <Button transparent>
                                <Icon name="account-circle" md-18 type="MaterialIcons" />
                            </Button>
                        </Left>
                        <Body>
                            <Title>{this.state.selectedTab}</Title>
                        </Body>
                        <Right>
                            <Root>
                            <Button
                                transparent
                                onPress={() =>
                                    ActionSheet.show(
                                        {
                                            options: BUTTONS,
                                            cancelButtonIndex: CANCEL_INDEX,
                                        },
                                        buttonIndex => {
                                            this.setState({ clicked: BUTTONS[buttonIndex] });
                                        }
                                    )}
                            >
                                <Icon name="add" type="MaterialIcons" />
                            </Button>
                            </Root>
                        </Right>
                    </Header>
                <Content>
                    {this.renderSelectedTab()}
                </Content>
                <Footer>
                    <FooterTab>
                        <Button active={this.state.selectedTab === 'Overzicht'} vertical onPress={() => this.setState({ selectedTab: 'Overzicht' })} >>
                            <Icon name="view-headline" type="MaterialIcons" />
                            <Text>Overzicht</Text>
                        </Button>
                        <Button active={this.state.selectedTab === 'Cliënten'} vertical onPress={() => this.setState({ selectedTab: 'Cliënten' })} >>
                            <Icon name="description" type="MaterialIcons" />
                            <Text>Cliënten</Text>
                        </Button>
                        <Button active={this.state.selectedTab === 'Facturatie'} vertical onPress={() => this.setState({ selectedTab: 'Facturatie' })} >>
                            <Icon name="folder" type="MaterialIcons" />
                            <Text>Facturatie</Text>
                        </Button>
                    </FooterTab>
                </Footer>
                </Container>
        
        )
    }
}

export default LoggedInStack;