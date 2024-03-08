import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import CustomActionButton from "../components/CustomActionButton";
import colors from "../assets/color";
import {
  getAuth, 
  signOut,
} from "firebase/auth";


export default class SettingScreen extends React.Component {

  constructor() {
    super();
    this.state = {  
      isLoading: false,
    };
  }


  onSignOut = async () => {
    try {
      this.setState({
        isLoading: true,
      });
      const auth = getAuth();
     await signOut(auth)
        .then(() => {
          this.setState({
            isLoading: false,
          });
          this.props.navigation.navigate("WelcomeScreen");
        })
        .catch((error) => {
          alert("Something went wrong...!");
          this.setState({
            isLoading: false,
          });
        });
    } catch (error) {
      if ((error.code = "auth/email-already-in-use")) {
        alert("User already Exists.Try Loggin in");
      }
      this.setState({
        isLoading: false,
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading ? (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
                elevation: 1000,
              },
            ]}
          >
            <ActivityIndicator size={"large"} color={colors.logColor} />
          </View>
        ) : null}

        <CustomActionButton
          title="Login In"
          style={{
            width: 200,
            backgroundColor: "transparent",
            borderWidth: 0.5,
            borderColor: colors.bgPrimary,
            marginBottom: 10,
          }}
          onPress={() => this.onSignOut()}
        >
          <Text
            style={{
              fontWeight: "100",
              color: colors.white,
            }}
          >
            Login Out
          </Text>
        </CustomActionButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:colors.bgMain
  },
});
