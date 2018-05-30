import React from 'react';
import {Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';


class NewPlan extends React.Component {
    static navigationOptions = {
      title: 'Nieuw Plan',
    };
    render() {
      return (
        <View>
          <Text>Newplan</Text>
        </View>
      );
    }
  }

export default NewPlan;