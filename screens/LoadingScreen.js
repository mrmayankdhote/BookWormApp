import "react-native-gesture-handler";
import React from "react";
import {
  getAuth, 
  onAuthStateChanged,
} from "firebase/auth";
import { View } from "react-native";


class LoadingScreen extends React.Component {
  componentDidMount = () => {
    this.checkIfLoggedIn();
  };

  checkIfLoggedIn = () => {
    try {
      const auth = getAuth();
      this.unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) { 
          this.props.navigation.navigate('LoginStack',{
            user:user
          });
        } else {
          this.props.navigation.navigate('LoginScreen')

        }
      });
    } catch (error) {
      alert(error)
     
    }
  };

  componentWillUnmount = () => {
    this.unsubscribe();
  }
  render() {
    return <View />;
  }
}

export default LoadingScreen;
