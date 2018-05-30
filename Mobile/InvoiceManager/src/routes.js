import { StackNavigator } from 'react-navigation';

import Overview from './src/Components/MainScreenComponents/OverviewComponents/Overview';
import Invoices from './src/Components/MainScreenComponents/OverviewComponents/Overview';
import Clients from './src/Components/MainScreenComponents/OverviewComponents/Overview';
import NewInvoice from './src/Components/MainScreenComponents/OverviewComponents/Overview';
import NewPlan from './src/Components/MainScreenComponents/OverviewComponents/Overview';

const AppNavigator = StackNavigator({
    overview: { screen: Overview },
    clients: { screen: Clients },
    invoices: { screen: Invoices },
    newPlan: { screen: NewPlan },
    newInvoice: { screen: NewInvoice }
}, {
    headerMode: 'none',
});

export default AppNavigator;
