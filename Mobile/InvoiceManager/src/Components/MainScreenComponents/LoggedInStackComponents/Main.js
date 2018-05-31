import React from 'react';

import { createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation';

import Overview from '../OverviewComponents/Overview';
import Invoices from '../InvoicesComponents/Invoices';
import Clients from '../ClientsComponents/Clients';
import DetailClients from '../ClientsComponents/DetailClients';
import NewInvoice from '../NewInvoiceComponents/NewInvoice';
import NewPlan from '../NewPlanComponents/NewPlan';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

export default createStackNavigator({
  base: { screen: createMaterialTopTabNavigator({
    Overview: {screen: Overview},
    Invoices: {screen: Invoices},
    Clients: {screen: Clients},
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
        backgroundColor: '#1194F6'
      },
      indicatorStyle: {
        backgroundColor: 'white',
      }
    }
  })},
  DetailClients: { screen: DetailClients },
  NewPlan: { screen: NewPlan },
  NewInvoice: { screen: NewInvoice }
  },
  {
  navigationOptions: {
    header: null 
  }
})

// export default createMaterialTopTabNavigator(
//   {
//     Overview: {screen: Overview},
//     Invoices: {screen: Invoices},
//     Clients: {screen: createStackNavigator({
//         HomeClients: {
//           screen: Clients,
//         },
//         DetailClients: {
//           screen: DetailClients,
//         }
//       },
//       {
//         initialRouteName: 'HomeClients',
//       }
//     )}

//   },
//   {
//     navigationOptions: ({ navigation }) => ({
//       tabBarIcon: ({ focused, tintColor }) => {
//         const { routeName } = navigation.state;
//         let iconName;
//         if (routeName === 'Overview') {
//           iconName = "view-headline";
//         } else if (routeName === 'Invoices') {
//           iconName = "description";
//         } else if (routeName === 'Clients') {
//           iconName = "folder";
//         }
//         return <Icon name={iconName} size={20} color={"white"}/>
//       },
//     }),
//     tabBarOptions: {
//       showIcon: true,
//       activeTintColor: 'white',
//       labelStyle: {
//         color: 'white',
//         fontSize: 13,
//       }, 
//       style: {
//         height: 65,
//         backgroundColor: '#293540'
//       },
//       indicatorStyle: {
//         backgroundColor: 'white',
//       }
//     }
//   }
// );
// const LoggedInStack = StackNavigator({
//   Overview: { screen: Overview },
//   Invoices: { screen: Invoices },
//   Clients: { screen: Clients },
//   NewPlan: { screen: NewPlan },
//   NewInvoice: { screen: NewInvoice },
// });