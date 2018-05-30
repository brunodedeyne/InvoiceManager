import React from 'react';

import { StackNavigator } from 'react-navigation';

import Overview from '../OverviewComponents/Overview';
import Invoices from '../InvoicesComponents/Invoices';
import Clients from '../ClientsComponents/Clients';
import NewInvoice from '../NewInvoiceComponents/NewInvoice';
import NewPlan from '../NewPlanComponents/NewPlan';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const CustomStack = StackNavigator({
  NewPlan: { screen: NewPlan },
  NewInvoice: { screen: NewInvoice },
});

export default CustomStack;