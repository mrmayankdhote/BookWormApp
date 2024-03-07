import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomActionButton from "../components/CustomActionButton";
import colors from "../assets/color";

export default class SettingScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
          <CustomActionButton
            title="Login In"
            style={{
              width: 200,
              backgroundColor: "transparent",
              borderWidth: 0.5,
              borderColor: colors.bgPrimary,
              marginBottom:10,

            }}
            onPress={() => this.props.navigation.navigate('WelcomeScreen')}
          >
            <Text
              style={{
                fontWeight:'100',
                color:colors.white
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
