import "react-native-gesture-handler";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./AppSwitchNavigator/WelcomeScreen";
import SignUpScreen from "./screens/SignUpScreen";
import colors from "./assets/color";
import HomeScreen from "./screens/HomeScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";


export default class BookWorm extends React.Component {
  render() {
    const Stack = createStackNavigator();

    const Drawer = createDrawerNavigator();

    function LoginStack() {
      return (
        <Drawer.Navigator>
          <Drawer.Screen
            name="HomeScreen"
            options={{
              title:'Home',
              drawerStyle: {
                backgroundColor: "#red",
                width: 240,
              },
              drawerIcon: ({color, size}) => (
            <Ionicons
               name='home' size={24} color={colors.bgMain}
            />
          ),
            }}
            component={HomeScreen}
          />
        </Drawer.Navigator>
      );
    }

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
            name="LoginStack"
            component={LoginStack}
            options={{ headerShown: false }}
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
