import React from 'react';
import { View, ScrollView, ListView } from 'react-native';

import { createStackNavigator } from 'react-navigation';
import * as firebase from 'firebase';  
import { Container, Header, Body, Content, Button, Icon, List, ListItem, Text } from 'native-base';


class Clients extends React.Component {
  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      listViewData: [],
    };
    this.database = firebase.database().ref('/invoices');
  }

  async componentDidMount (){
    await this.getData(); 
  }

  async getData () {   
    let itemsInvoices = [];
    let itemsPlannen = [];
    let tempData = [];
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      firebase.database().ref('/invoices').on('value', (snapshotInvoices) => {
        itemsInvoices = Object.entries(snapshotInvoices.val()).map((itemInvoices, iInvoices) => { 
          if (user){
            if (user.uid == itemInvoices[1].userUid){
              var invoiceKey = itemInvoices[0];
              itemInvoices = itemInvoices[1];
              itemInvoices.key = invoiceKey;
              return itemInvoices; 
            }
        }
        });     
        itemsInvoices = itemsInvoices.filter(Boolean);
        this.setState({dataInvoices: itemsInvoices});
        
        firebase.database().ref('/plannen').on('value', (snapshotPlannen) => {
          itemsPlannen = Object.entries(snapshotPlannen.val()).map((itemPlannen, iPlannen) => {     
            if (user){     
              if (user.uid == itemPlannen[1].userUid){ 
                itemPlannen = itemPlannen[1];
                itemPlannen.key = iPlannen;
                return itemPlannen;  
              }
            }
          });
          itemsPlannen = itemsPlannen.filter(Boolean);  
          this.setState({dataPlannen: itemsPlannen});

          let combinedInvoices = [];
          for (var i = 0; i < itemsInvoices.length; i++){
            for (var j = 0; j < itemsPlannen.length; j++){    
              if (itemsPlannen[j].key === itemsInvoices[i].planKey) {
                combinedInvoices.push ({
                  userUid: itemsInvoices[i].userUid,
                  dossierNr: itemsPlannen[j].dossierNr,
                  key: itemsInvoices[i].key,
                  aardInvoice: itemsInvoices[i].aardInvoice,
                  fee: itemsInvoices[i].fee,
                  planKey: itemsInvoices[i].planKey,
                  dateCreated: itemsInvoices[i].dateCreated,
                  datePaid: itemsInvoices[i].datePaid,
                  fullName: itemsPlannen[j].name + " " + itemsPlannen[j].familyName,
                })
                
              }
            }
          }
          tempData = combinedInvoices;
          this.setState({listViewData: tempData});
        });
      });
    });
  }

  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return (
      <List
        dataSource={this.ds.cloneWithRows(this.state.listViewData)}
        renderRow={data =>
          <ListItem>
            <Body>
              <Text>{data.fullName + "  -  " + data.fee}</Text>
              <Text note>{data.dateCreated}</Text>
            </Body>
          </ListItem>
        }
        renderLeftHiddenRow={data =>
          <Button full onPress={() => this.props.navigation.navigate("DetailClients", {fullName: n.fullName})}>
            <Icon active name="information-circle" />
          </Button>}
        leftOpenValue={75}
      >
      </List>
    );
  }
}

export default Clients;