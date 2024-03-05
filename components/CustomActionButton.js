import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types"; // ES6

const CustomActionButton = ({ children, onPress, style }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.button, style]}>{children}</View>
  </TouchableOpacity>
);

CustomActionButton.prototype = {
  onPress: PropTypes.func.isRequired,
  children:PropTypes.element.isRequired,
  styles:PropTypes.object
};

PropTypes.defaultProps={
    style:{}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 50,
    backgroundColor: "#aedeba",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
});

export default CustomActionButton;
