import {createStackNavigator} from 'react-navigation-stack';

import Profile from './screens/Profile';

const Router = createStackNavigator({
  Profile,
}, {headerMode: 'none'});

export default Router;