import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../assets/color";
import CustomActionButton from "../components/CustomActionButton";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default class WelcomeScreen extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor:'#2E424D'
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="bookmark" size={150} color={colors.logColor} />
          <Text
            style={{
              fontWeight: "100",
              fontSize: 50,
              color:colors.white
            }}
          >
            Book Work
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems:'center'
          }}
        >
          <CustomActionButton
            title="Login In"
            style={{
              width: 200,
              backgroundColor: "transparent",
              borderWidth: 0.5,
              borderColor: colors.bgPrimary,
              marginBottom:10,

            }}
            onPress={() => this.props.navigation.navigate('HomeScreen')}
          >
            <Text
              style={{
                fontWeight:'100',
                color:colors.white
              }}
            >
              Login In
            </Text>
          </CustomActionButton>
          <CustomActionButton
            title="SignUp"
            style={{
              width: 200,
              backgroundColor: "transparent",
              borderWidth: 0.5,
              borderColor: colors.bgError,
            }}
            onPress={() => this.props.navigation.navigate('SignUpScreen')}
          >
            <Text
              style={{
                color:colors.white,
                fontWeight:'100',

              }}
            >
              SignUp{" "}
            </Text>
          </CustomActionButton>
        </View>
      </View>
    );
  }
}