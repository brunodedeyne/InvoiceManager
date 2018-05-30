import React from 'react';
import {Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';


class Invoices extends React.Component {
    static navigationOptions = {
      title: 'Facturatie',
    };
    render() {
      return (
        <View>
          <Text>Invoices</Text>
        </View>
      );
    }
  }

export default Invoices;