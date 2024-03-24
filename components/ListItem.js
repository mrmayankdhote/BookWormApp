import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity, Alert } from "react-native";
import colors from "../assets/color";
import { Ionicons } from "@expo/vector-icons";
import CustomActionButton from "../components/CustomActionButton";

const ListItem = ({ item, children,editabled }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.listItemBg,
        minHeight: 100,
        alignItems: "center",
        marginVertical: 5,
      }}
    >
      <View style={styles.imageContainer}>
      <TouchableOpacity
      disabled={!editabled}
      style={{
        flex:1,
      }} onPress={()=>{alert('action')}}>
        <Image source={require("../assets/icon.png")} style={styles.image} />
        </TouchableOpacity>
      </View>
      <View style={styles.markAsReadContainer}>
        <Text style={styles.listItemTitle}>{item.name}</Text>
      </View>
      {children}
    </View>
  );
};

ListItem.defaultProps = {
  marginVertical:5,
};
export default ListItem;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bgMain,
  },
  markAsReadButton: {
    borderRadius: 0,
    width: 100,
    backgroundColor: colors.bgSuccess,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  markasReadText: {
    fontWeight: "bold",
    color: colors.white,
  },
  markAsReadContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 5,
  },
  listItemTitle: {
    fontWeight: "100",
    fontSize: 22,
    color: colors.white,
  },
  imageContainer: {
    height: 70,
    width: 70,
    marginLeft: 10,
  },
  image: {
    flex: 1,
    height: null,
    width: null,
    borderRadius: 35,
  },
});
