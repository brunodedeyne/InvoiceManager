import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';
import Login from './src/Components/Login/Login';
import Login from './src/Components/MainScreenComponents/OverviewComonents/Overview';

type Props = {};
export default class App extends Component<Props> {
 render() {
    return (
      <View style={styles.container}>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
});
