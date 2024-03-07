import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import colors from "../assets/color";
import CustomActionButton from "../components/CustomActionButton";

export default class LoginScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter email"
            placeholderTextColor={colors.bgTextInputDark}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.textInput}
            placeholder="Enter password"
            placeholderTextColor={colors.bgTextInputDark}
            secureTextEntry
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
              onPress={() => {}}
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
              onPress={() => {}}
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
