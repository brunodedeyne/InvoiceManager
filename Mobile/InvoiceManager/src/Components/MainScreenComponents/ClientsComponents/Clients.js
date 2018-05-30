import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import {
  ListItem,
} from 'react-native-material-ui';
import * as firebase from 'firebase';  

const UP = 1;
const DOWN = -1;

class Clients extends React.Component {
  constructor(props) {
    super(props);

    this.offset = 0;
    this.scrollDirection = 0;

    this.state = {
      data: []
    };
    this.renderItem = this.renderItem.bind(this);
    this.database = firebase.database().ref('/plannen');
  }


  renderItem = (title) => {
    return (
      <ListItem
        divider
        centerElement={title}
      />
    );
  }

  onScroll = (ev) => {
    const currentOffset = ev.nativeEvent.contentOffset.y;

    const sub = this.offset - currentOffset;

    // don't care about very small moves
    if (sub > -2 && sub < 2) {
      return;
    }

    this.offset = ev.nativeEvent.contentOffset.y;

    const currentDirection = sub > 0 ? UP : DOWN;

    if (this.scrollDirection !== currentDirection) {
      this.scrollDirection = currentDirection;

      this.setState({
        bottomHidden: currentDirection === DOWN,
      });
    }
  }

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
          this.setState({ data: items });
          console.log(this.state.data);
      });    
    //});
  }

  render() {
    return (
      <View>
        <ScrollView
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="interactive"
          onScroll={this.onScroll}
        >
          {
            this.state.data.map((n) => {
              return (
                <ListItem
                  divider
                  centerElement={n.dossierNr + "  -  " + n.fullName}
                  onPress={() => this.props.navigation.navigate("Invoices")}
                />
              )
            })
          }          
        </ScrollView>
      </View>
    );
  }
}

export default Clients;