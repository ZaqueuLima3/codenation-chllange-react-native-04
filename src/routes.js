import {createStackNavigator} from 'react-navigation-stack';

import CameraApp from './screens/CameraApp';
import Profile from './screens/Profile';

const Router = createStackNavigator({
  Profile,
  CameraApp,
}, {headerMode: 'none'});

export default Router;