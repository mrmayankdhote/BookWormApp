import "react-native-gesture-handler";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, createB } from "@react-navigation/stack";
import WelcomeScreen from "./AppSwitchNavigator/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import colors from "./assets/color";
import HomeScreen from "./screens/HomeScreen";
import BooksReadScreen from "./screens/HomeTabNavigator/BooksReadScreen";
import BooksReading from "./screens/HomeTabNavigator/BooksReadingScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import SettingScreen from "./AppSwitchNavigator/SettingScreen";
import CustomDrawerCompoenent from "./screens/DrawerNavigator/CustomDrawerCompoenent";
import LoadingScreen from "./screens/LoadingScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BookCountCointainers from "./redux/containers/BookCountCointainers";
export default class BookWorm extends React.Component {
  render() {
    const Stack = createStackNavigator();

    const Drawer = createDrawerNavigator();

    const HomeTabNavigator = createBottomTabNavigator();

    function HomeTab() {
      return (
        <HomeTabNavigator.Navigator
          screenOptions={{
            tabBarStyle: { backgroundColor:colors.bgMain },
            tabBarActiveTintColor:colors.logColor,
            tabBarInactiveTintColor:colors.bgTextInput

          }}
        >
          <HomeTabNavigator.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              title:"Total Books",
              tabBarLabel: "Total Books",
              headerShown: false,
              tabBarIcon:({tintColor})=><BookCountCointainers  color={tintColor} type={'books'} /> 
              
            }}
          />
          <HomeTabNavigator.Screen
            name="BooksReadScreen"
            component={BooksReadScreen}
            options={{
              tabBarLabel: "Books Read",
              headerShown: false,
              tabBarIcon:({tintColor})=><BookCountCointainers  color={tintColor} type={'booksRead'} /> 

            }}
          />

          <HomeTabNavigator.Screen
            name="BooksReading"
            component={BooksReading}
            options={{

              tabBarLabel: "Books Reading",
              headerShown: false,
              tabBarIcon:({tintColor})=><BookCountCointainers  color={tintColor} type={'booksReading'}/> 

            }}
          />
        </HomeTabNavigator.Navigator>
      );
    }

    Drawer.screenOptions = ({ navigation }) => {
      alert(true);
      // const { routeName } = navigation.state.routes[navigation.state.index]
      const { routeName } = navigation.state.routes[navigation.state.index];
      alert(routeName);
    };    

    function LoginStack() {
      return (
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerCompoenent {...props} />}
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.bgMain,
            },
            headerTintColor: colors.white,
          }}
        >
          <Drawer.Screen
            name="HomeScreen"
            
            options={{
              title: "Book Worm",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="home" size={24} color={colors.bgMain} />
              ),
            }}
            component={HomeTab}
          />

          {/* <Drawer.Screen
            name="HomeTabNavigator"
            component={HomeTab}
            options={{
              headerShown: false,
              headerTitle
            }}
          /> */}

          <Drawer.Screen
            name="SettingScreen"
            options={{
              title: "Settings",
              drawerStyle: {
                backgroundColor: "#red",
                width: 240,
              },
              drawerIcon: ({ color, size }) => (
                <Ionicons name="settings" size={24} color={colors.bgMain} />
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
          }}
        >
          <Stack.Screen
            name="LoadingScreen"
            component={LoadingScreen}
            options={{ headerShown: false }}
            screenOptions={{
              headerTitle: null,
            }}
          />
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
              headerBackTitle: "Login",
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
