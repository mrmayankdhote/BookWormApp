import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import WelcomeScreen from './AppSwitchNavigator/WelcomeScreen'

const App = () => 
  <AppContainer />
;

const AppSwitchNavigator=createSwitchNavigator({
  WelcomeScreen
})

const AppContainer=createAppContainer(AppSwitchNavigator)
export default App;
