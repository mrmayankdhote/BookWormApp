import "react-native-gesture-handler";
import React from "react";
import {
  getAuth, 
  onAuthStateChanged,
} from "firebase/auth";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


class LoadingScreen extends React.Component {
  componentDidMount = () => {
    this.checkIfLoggedIn();
  };


  checkIfLoggedIn = () => {
    try {
    
      const auth = getAuth();
      this.unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
         const _storeData = async (user) => {
            try {
              await AsyncStorage.setItem("user", JSON.stringify(user));
              this.props.navigation.navigate("LoginStack");
            } catch (error) {
              alert(error)
              // Error saving data
            }
          };
    
         _storeData(user);
        } else {
          this.props.navigation.navigate("LoginScreen");
        }
      });
    } catch (error) {
      alert(error);
    }
  };

  componentWillUnmount = () => {
    this.unsubscribe();
  };
  render() {
    return <View />;
  }
}

export default LoadingScreen;
