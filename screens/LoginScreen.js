import React from "react";
import { View, Text, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import colors from "../assets/color";
import CustomActionButton from "../components/CustomActionButton";
import * as firebase from "firebase/app";
import 'firebase/auth';
import { getAuth, createUserWithEmailAndPassword ,initializeAuth, getReactNativePersistence, signInWithEmailAndPassword } from "firebase/auth";


export default class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      isLoading: false,
    };
  }

  onSignIn = async () => {
    if (this.state.email && this.state.password) {
      try {
        this.setState({
          isLoading: true,
        });
        const auth = getAuth();
        signInWithEmailAndPassword(auth, this.state.email, this.state.password)
          .then((userCredential) => {
            // Signed up
            this.setState({
              isLoading: false,
            });
            alert(JSON.stringify(userCredential));
            // ...
          })
          .catch((error) => {
            this.setState({
              isLoading: false,
            });
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(error);
            // ..
          });
      } catch (error) {
        this.setState({
          isLoading: false,
        });
        switch (error?.code) {
          case "auth/user-not-found":
            alert("A user with that email does not exist.Try signing Up");
            break;
          case "auth/invalid-email":
            alert("Please enter an email address");
        }
      }
    } else {
      alert("Please enter a email and password");
    }
  };

  onSignUp = async () => {
    if (this.state.email && this.state.password) {
      try {
        this.setState({
          isLoading: true,
        });
        const auth = getAuth();
        createUserWithEmailAndPassword(
          auth,
          this.state.email,
          this.state.password
        )
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            this.setState({
              isLoading: false,
            });
            this.onSignIn(this.state.email && this.state.password);
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(error);
            this.setState({
              isLoading: false,
            });
            // ..
          });
      } catch (error) {
        if ((error.code = "auth/email-already-in-use")) {
          alert("User already Exists.Try Loggin in");
        }
        this.setState({
          isLoading: false,
        });
      }
    } else {
      alert("Please enter a email and password");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading ? <View style ={[StyleSheet.absoluteFill, {
          justifyContent:'center',
          alignItems:'center',
          zIndex:1000,
          elevation:1000
        }]}><ActivityIndicator  size={'large'} color={colors.logColor} /></View> : null}
        <View style={{ flex: 1, justifyContent: "center" }}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter email"
            placeholderTextColor={colors.bgTextInputDark}
            keyboardType="email-address"
            onChangeText={(email) => this.setState({ email: email })}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Enter password"
            placeholderTextColor={colors.bgTextInputDark}
            secureTextEntry
            onChangeText={(changePassword) =>
              this.setState({ password: changePassword })
            }
          />
          <View
            style={{
              alignItems: "center",
            }}
          >
            <CustomActionButton
              style={[
                styles.loginButton,
                {
                  borderColor: colors.bgPrimary,
                },
              ]}
              onPress={() => {
                this.onSignIn();
              }}
            >
              <Text style={{ color: colors.white }}>Login</Text>
            </CustomActionButton>
            <CustomActionButton
              style={[
                styles.loginButton,
                {
                  borderColor: colors.bgError,
                },
              ]}
              onPress={() => {
                this.onSignUp();
              }}
            >
              <Text style={{ color: colors.white }}>Signup</Text>
            </CustomActionButton>
          </View>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  textInput: {
    height: 50,
    borderWidth: 0.5,
    borderColor: colors.borderColor,
    marginHorizontal: 40,
    marginBottom: 10,
    color: colors.white,
    paddingHorizontal: 10,
  },
  loginButton: {
    borderWidth: 0.5,
    backgroundColor: "transparent",
    marginTop: 10,
    width: 200,
  },
});
