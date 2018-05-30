import React from 'react';
import {Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';


class NewInvoice extends React.Component {
    static navigationOptions = {
      title: 'Nieuwe Factuur',
    };
    render() {
      return (
        <View>
          <Text>NewInvoice</Text>
        </View>
      );
    }
  }

export default NewInvoice;