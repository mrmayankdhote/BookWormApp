import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList
} from 'react-native';

import WelcomeScreen from './screens/AppSwitchNavigator/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SettingsScreen from './screens/SettingsScreen';
import CustomDrawerComponent from './screens/DrawerNavigator/CustomDrawerComponent';
import LoadingScreen from './screens/AppSwitchNavigator/LoadingScreen';
import BooksReadingScreen from './screens/HomeTabNavigator/BooksReadingScreen';
import BooksReadScreen from './screens/HomeTabNavigator/BooksReadScreen';
import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator,
  createDrawerNavigator,
  createBottomTabNavigator
} from 'react-navigation';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import colors from './assets/colors';
import { Ionicons } from '@expo/vector-icons';

import * as firebase from 'firebase/app';
import { firebaseConfig } from './config/config';

import { Provider } from 'react-redux';
import store from './redux/store';
import BooksCountContainer from './redux/containers/BooksCountContainer';
class App extends React.Component {
  constructor() {
    super();
    this.initializeFirebase();
  }
  initializeFirebase = () => {
    firebase.initializeApp(firebaseConfig);
  };
  render() {
    return (
      <Provider store={store}>
        <ActionSheetProvider>
          <AppContainer />
        </ActionSheetProvider>
      </Provider>
    );
  }
}
const LoginStackNavigator = createStackNavigator(
  {
    WelcomeScreen: {
      screen: WelcomeScreen,
      navigationOptions: {
        header: null
      }
    },
    LoginScreen
  },
  {
    mode: 'modal',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: colors.bgMain
      }
    }
  }
);

const HomeTabNavigator = createBottomTabNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: 'Total Books',
        tabBarIcon: ({ tintColor }) => (
          <BooksCountContainer color={tintColor} type="books" />
        )
      }
    },
    BooksReadingScreen: {
      screen: BooksReadingScreen,
      navigationOptions: {
        tabBarLabel: 'Books Reading',
        tabBarIcon: ({ tintColor }) => (
          <BooksCountContainer color={tintColor} type="booksReading" />
        )
      }
    },
    BooksReadScreen: {
      screen: BooksReadScreen,
      navigationOptions: {
        tabBarLabel: 'Books Read',
        tabBarIcon: ({ tintColor }) => (
          <BooksCountContainer color={tintColor} type="booksRead" />
        )
      }
    }
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: colors.bgMain
      },
      activeTintColor: colors.logoColor,
      inactiveTintColor: colors.bgTextInput
    }
  }
);

HomeTabNavigator.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation.state.routes[navigation.state.index];

  switch (routeName) {
    case 'HomeScreen':
      return {
        headerTitle: 'Total Books'
      };
    case 'BooksReadingScreen':
      return {
        headerTitle: 'Books Reading'
      };
    case 'BooksReadScreen':
      return {
        headerTitle: 'Books Read'
      };
    default:
      return {
        headerTitle: 'Book Worm'
      };
  }
};

const HomeStackNavigator = createStackNavigator(
  {
    HomeTabNavigator: {
      screen: HomeTabNavigator,
      navigationOptions: ({ navigation }) => {
        return {
          headerLeft: (
            <Ionicons
              name="ios-menu"
              size={30}
              color={colors.logoColor}
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 10 }}
            />
          )
        };
      }
    }
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: colors.bgMain
      },
      headerTintColor: colors.txtWhite
    }
  }
);

const AppDrawerNavigator = createDrawerNavigator(
  {
    HomeStackNavigator: {
      screen: HomeStackNavigator,
      navigationOptions: {
        title: 'Home',
        drawerIcon: () => <Ionicons name="ios-home" size={24} />
      }
    },
    SettingsScreen: {
      screen: SettingsScreen,
      navigationOptions: {
        title: 'Settings',
        drawerIcon: () => <Ionicons name="ios-settings" size={24} />
      }
    }
  },
  {
    contentComponent: CustomDrawerComponent
  }
);

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen,
  LoginStackNavigator,
  AppDrawerNavigator
});

const AppContainer = createAppContainer(AppSwitchNavigator);

export default App;
