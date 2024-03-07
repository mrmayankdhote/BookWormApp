import "react-native-gesture-handler";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./AppSwitchNavigator/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import colors from "./assets/color";
import HomeScreen from "./screens/HomeScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import SettingScreen from "./AppSwitchNavigator/SettingScreen";
import CustomDrawerCompoenent from "./DrawerNavigator/CustomDrawerCompoenent";

export default class BookWorm extends React.Component {
  render() {
    const Stack = createStackNavigator();

    const Drawer = createDrawerNavigator();

    function LoginStack() {
      return (
        
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerCompoenent {...props} />}>
        <Drawer.Screen
            name="HomeScreen"
            options={{
              title: "Home",
              headerShown:false,

              drawerStyle: {
                backgroundColor: "#red",
                width: 240,
                headerShown:false
              },
              drawerIcon: ({ color, size }) => (
                <Ionicons name="home" size={24} color={colors.bgMain} />
              ),
            }}
            component={HomeScreen}
          />
          <Drawer.Screen
            name="SettingScreen"
            options={{
              title: "Settings",
              drawerStyle: {
                backgroundColor: "#red",
                width: 240,
              },
              drawerIcon: ({ color, size }) => (
                <Ionicons name='settings' size={24} color={colors.bgMain} />
              ),
            }}
            component={SettingScreen}
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
            presentation:'modal'
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
            name="LoginScreen"
            component={LoginScreen}
            options={{
               headerShown: true,
               headerBackTitle:'Login' 
            
             }}
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
