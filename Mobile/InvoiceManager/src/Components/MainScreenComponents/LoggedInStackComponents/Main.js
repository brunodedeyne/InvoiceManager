import React from 'react';

import { createMaterialTopTabNavigator, StackNavigator } from 'react-navigation';

import Overview from '../OverviewComponents/Overview';
import Invoices from '../InvoicesComponents/Invoices';
import Clients from '../ClientsComponents/Clients';
import NewInvoice from '../NewInvoiceComponents/NewInvoice';
import NewPlan from '../NewPlanComponents/NewPlan';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { YellowBox, Stack } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

export default createMaterialTopTabNavigator(
  {
    Overview: {screen: Overview},
    Invoices: {screen: Invoices},
    Clients: {screen: StackNavigator({
      NewPlan: {
        screen: NewPlan,
      },
      NewInvoice: {
        screen: NewInvoice,
      }
    })},
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Overview') {
          iconName = "view-headline";
        } else if (routeName === 'Invoices') {
          iconName = "description";
        } else if (routeName === 'Clients') {
          iconName = "folder";
        }
        return <Icon name={iconName} size={20} color={"white"}/>
      },
    }),
    tabBarOptions: {
      showIcon: true,
      activeTintColor: 'white',
      labelStyle: {
        color: 'white',
        fontSize: 13,
      }, 
      style: {
        height: 65,
        backgroundColor: '#293540'
      },
      indicatorStyle: {
        backgroundColor: 'white',
      }
    }
  }
);
// const LoggedInStack = StackNavigator({
//   Overview: { screen: Overview },
//   Invoices: { screen: Invoices },
//   Clients: { screen: Clients },
//   NewPlan: { screen: NewPlan },
//   NewInvoice: { screen: NewInvoice },
// });