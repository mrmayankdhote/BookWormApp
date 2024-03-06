import React from "react";
import { createAppContainer, createSwitchNavigator,createStackNavigator,createDrawerNavigator } from "react-navigation";
import WelcomeScreen from './AppSwitchNavigator/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';


const App = () => 
  <AppContainer />
;

const LoginStackNavigator = createStackNavigator({
  WelcomeScreen: {
    screen: WelcomeScreen,
    navigationOptions:{
      header:null
    }
  },
  SignUpScreen,
});
const AppDrawerNavigator=createDrawerNavigator({
  HomeScreen
})

const AppSwitchNavigator=createSwitchNavigator({
  LoginStackNavigator,
  AppDrawerNavigator
})

const AppContainer=createAppContainer(AppSwitchNavigator)
export default App;
