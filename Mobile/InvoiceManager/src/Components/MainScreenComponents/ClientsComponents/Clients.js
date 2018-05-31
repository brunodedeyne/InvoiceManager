import React from 'react';
import { View, ScrollView, ListView } from 'react-native';
// import {
//   ListItem,
// } from 'react-native-material-ui';
import { createStackNavigator } from 'react-navigation';
import * as firebase from 'firebase';  
import { Container, Header, Body, Content, Button, Icon, List, ListItem, Text } from 'native-base';

// const UP = 1;
// const DOWN = -1;

class Clients extends React.Component {
  //static navigationOptions = { header: null }


  constructor(props) {
    super(props);

    // this.offset = 0;
    // this.scrollDirection = 0;

    // this.state = {
    //   data: []
    // };
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      basic: true,
      //data: [],
      listViewData: [],
    };
    //this.renderItem = this.renderItem.bind(this);
    this.database = firebase.database().ref('/plannen');
  }


  // renderItem = (title) => {
  //   return (
  //     <ListItem
  //       divider
  //       centerElement={title}
  //     />
  //   );
  // }

  // onScroll = (ev) => {
  //   const currentOffset = ev.nativeEvent.contentOffset.y;

  //   const sub = this.offset - currentOffset;

  //   // don't care about very small moves
  //   if (sub > -2 && sub < 2) {
  //     return;
  //   }

  //   this.offset = ev.nativeEvent.contentOffset.y;

  //   const currentDirection = sub > 0 ? UP : DOWN;

  //   if (this.scrollDirection !== currentDirection) {
  //     this.scrollDirection = currentDirection;

  //     this.setState({
  //       bottomHidden: currentDirection === DOWN,
  //     });
  //   }
  // }

  componentDidMount () {
    this.fillData();
  }

  fillData () {
    //this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      //if (user) this.setState({userUid: user.uid});    
      let items = [];
      this.database.on('value', (snapshot) => {
          items = Object.entries(snapshot.val()).map((item, i) => { 
            //if (user){              
              //if (item[1].userUid == user.uid) {
                var itemKey = item[0];
                item = item[1];
                item.key = itemKey;
                item.fullName = item.name + " " + item.familyName;
                item.address = item.street + `<br />` + item.city;
                item.buildingAddress = item.buildingStreet + '<br />' + item.buildingCity;
                return item;
             // }
            //}
          });
          items = items.filter(Boolean);
          this.setState({ listViewData: items });
      });    
    //});
  }

  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return (

      <List
        dataSource={this.ds.cloneWithRows(this.state.listViewData)}
        renderRow={data =>
          <ListItem>
            <Body>
              <Text>{data.fullName}</Text>
              <Text note>{data.dossierNr}</Text>
            </Body>
          </ListItem>
        }
        renderLeftHiddenRow={data =>
          <Button full onPress={() => this.props.navigation.navigate("DetailClients", {fullName: n.fullName})}>
            <Icon active name="information-circle" />
          </Button>}
        // renderRightHiddenRow={(data, secId, rowId, rowMap) =>
        //   <Button full danger onPress={_ => this.deleteRow(secId, rowId, rowMap)}>
        //     <Icon active name="trash" />
        //   </Button>}
        leftOpenValue={75}
        // rightOpenValue={-75}
      >

      </List>
    // return (
    //   <View>
    //     <ScrollView
    //       keyboardShouldPersistTaps="always"
    //       keyboardDismissMode="interactive"
    //       onScroll={this.onScroll}
    //     >
    //       {
    //         this.state.data.map((n) => {
    //           return (
    //             <ListItem
    //               divider
    //               centerElement={n.dossierNr + "  -  " + n.fullName}
    //               onPress={() => this.props.navigation.navigate("DetailClients", {fullName: n.fullName})}
    //             />
    //           )
    //         })
    //       }          
    //     </ScrollView>
    //   </View>
    );
  }
}

export default Clients;