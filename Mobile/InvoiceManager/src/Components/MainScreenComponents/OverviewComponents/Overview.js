'use strict'

import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView
} from 'react-native';
// import {
//   BottomNavigation,
//   Toolbar
// } from 'react-native-material-ui';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// import {
//   StackNavigator,
// } from 'react-navigation';

// import ActionButton from 'react-native-action-button';

// import * as firebase from 'firebase';

class Overview extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     active: 'overview',
  //   }
  // }

  render() {
    return (
      <View>
        <Text>Overview</Text>
      </View>
      // <View style={styles.container}>
      //   {/* <Toolbar
      //     leftElement="menu"
      //     centerElement="Searchable"
      //     searchable={{
      //       autoFocus: true,
      //       placeholder: 'Search',
      //     }}
      //     style={styles.toolbar}
      //   /> */}
      //   <View style={styles.body}>
      //     <Text style={{ fontSize: 20 }}>KUTSPEL</Text>
      //   </View>
      //   <ActionButton style={styles.actionButton} buttonColor="#2e8b57">
      //     <ActionButton.Item buttonColor='rgba(231,76,60,1)' title="Nieuw Plan" onPress={() => this.props.navigation.navigate('NewPlan')}>
      //       <Icon name="create-new-folder" style={styles.actionButtonIcon} />
      //     </ActionButton.Item>
      //     <ActionButton.Item buttonColor='rgba(231,76,60,1)' title="Nieuwe Factuur" onPress={() => this.props.navigation.navigate('NewInvoice')}>
      //       <Icon name="note-add" style={styles.actionButtonIcon} />
      //     </ActionButton.Item>
      //   </ActionButton>
      //   <View style={styles.footer}>
      //     <BottomNavigation 
      //       active={this.state.active} 
      //       style={{ container:{right: 0, left: 0, bottom: 0} }}
      //     >
      //       <BottomNavigation.Action
      //           key="overview"
      //           icon="view-headline"
      //           label="Overzicht"
      //           onPress={() => this.props.navigation.navigate('Overview')}
      //       />
      //       <BottomNavigation.Action
      //           key="clients"
      //           icon="folder"
      //           label="Cliënten"
      //           onPress={() => this.props.navigation.navigate('Clients')}
      //       />
      //       <BottomNavigation.Action
      //           key="invoices"
      //           icon="description"
      //           label="Facturatie"
      //           onPress={() => this.props.navigation.navigate('Invoices')}
      //       />
      //     </BottomNavigation>
      //   </View>
      // </View>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#F5FCFF',
//     flex: 1,
//     justifyContent: 'center'
//   },
//   toolbar: {
//     backgroundColor: 'white',
//   },
//   body: {
//     flex: 1,
//     backgroundColor: 'skyblue',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   actionButton: {
//     marginBottom: 40,
//     right: 0,
//     position: 'absolute'
//   },
//   actionButtonIcon: {
//     fontSize: 20,
//     height: 22,
//     color: 'white',
//   },
// });


export default Overview;