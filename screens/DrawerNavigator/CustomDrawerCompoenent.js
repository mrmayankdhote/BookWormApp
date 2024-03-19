import React from "react";
import { View, StyleSheet, ScrollView, SafeAreaView, Text } from "react-native";
import colors from "../../assets/color";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";

export default class CustomDrawerCompoenent extends React.Component {
  render() {
    return (

      <DrawerContentScrollView
      
        {...this.props}
      >
        <SafeAreaView
          style={{
            flex:1,
            backgroundColor: colors.bgMain,
            padding:20

          }}
        />
        <View
          style={{
            height: 150,
            backgroundColor: colors.bgMain,
            justifyContent: "center",
            alignItems:'center'
          }}
        >
          <Ionicons name="bookmark" size={100} color={colors.logColor} />
          <Text style={{
            fontSize:24,
            color:colors.white,
            fontWeight:'100',
          }}> BookWorm </Text>
        </View>
        <DrawerItemList {...this.props} />

      </DrawerContentScrollView>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bgMain,
  },
});
