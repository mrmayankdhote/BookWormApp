import 'react-native-gesture-handler';
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./AppSwitchNavigator/WelcomeScreen";
import SignUpScreen from "./screens/SignUpScreen";
import colors from "./assets/color";
import HomeScreen from "./screens/HomeScreen";
import { createDrawerNavigator } from '@react-navigation/drawer';




export default class BookWorm extends React.Component {
  render() {
    const Stack = createStackNavigator();

    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.bgMain,
            },
            headerBackTitleVisible: false,
            headerTintColor: colors.white,
          }}
        >
          <Stack.Screen
            name="WelcomeScreen"
            component={WelcomeScreen}
            options={{ headerShown: false }}
            screenOptions={{
              headerTitle: null,
            }}
          />
          <Stack.Screen
            name="SignUpScreen"
            component={SignUpScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
