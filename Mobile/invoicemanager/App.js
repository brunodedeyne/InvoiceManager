import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View
} from 'react-native';
import Login from './src/Components/Login/Login';
import LoggedInStack from './src/Components/MainScreenComponents/LoggedInStackComponents/LoggedInStack';
import * as firebase from 'firebase';
import { 
  Container, 
  Spinner
} from 'native-base';

var config = {
  apiKey: "AIzaSyDiYwctQZs8cq4LwrUJ0JZvs0ne2f9Bjbg",
  authDomain: "invoicemanager-1525702104034.firebaseapp.com",
  databaseURL: "https://invoicemanager-1525702104034.firebaseio.com",
  projectId: "invoicemanager-1525702104034",
  storageBucket: "invoicemanager-1525702104034.appspot.com",
  messagingSenderId: "908003589667"
};

firebase.initializeApp(config);

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: ''
    }
  }

  componentDidMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.providerData.forEach(function (profile) {
          tempUid = profile.uid;
        });
      }
      else {
        console.log("Uitgelogd: " + user);
      }
      this.setState({
        loading: false,
        user: user
      });
    });
  }

  render() {
    if (this.state.loading) return(
      <Container>
        <Spinner color='blue' />
      </Container>
    );
    if (this.state.user) {
      return (
        <LoggedInStack />

        // <ThemeProvider uiTheme={uiTheme}>
        // {/* <CustomStack /> */}
        // <LoggedInStack />
        // {/* <ActionButton style={styles.actionButton} buttonColor="#2e8b57">
        //     <ActionButton.Item buttonColor='rgba(231,76,60,1)' title="Nieuw Plan" onPress={() => this.props.navigation.navigate('DetailClients')}>
        //       <Icon name="create-new-folder" style={styles.actionButtonIcon} />
        //     </ActionButton.Item>
        //     <ActionButton.Item buttonColor='rgba(231,76,60,1)' title="Nieuwe Factuur" onPress={() => this.props.navigation.navigate('NewInvoice')}>
        //       <Icon name="note-add" style={styles.actionButtonIcon} />
        //     </ActionButton.Item>
        //   </ActionButton>  
        // </ThemeProvider>         */}
        //);
        // }
        // return (
        //   <PaperProvider>
        //     <View style={styles.container}>
        //       <Login />
        //     </View>
        //   </PaperProvider>
        // );
      )
    }
    // return (
    //   <Login />
    // )
  }
}

// const uiTheme = {
//   toolbar: {
//     container: {
//       height: 50,
//       bottom: 0,
//     },
//   },
// };

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
//     right: 0,
//     bottom: 0
//   },
//   actionButtonIcon: {
//     fontSize: 20,
//     height: 22,
//     color: 'white',
//   },
// });