import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatListComponent } from "react-native";
import PropTypes from "prop-types"; // ES6
import colors from "../assets/color";


function getPosition(positon) {
  switch (positon) {
    case "left":
      return { position: "absolute", bottom: 20, left: 20 };
    default: {
      return { position: "absolute", bottom: 20, right: 20 };
    }
  }
}
const CustomActionButton = ({ children, onPress, style, position }) => {
  const floatingActionButton = position ? getPosition(position) : [];

  return (
    <TouchableOpacity style={floatingActionButton} onPress={onPress}>
      <View style={[styles.button, style]}>{children}</View>
    </TouchableOpacity>
  );
};

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
    backgroundColor: colors.bgSuccess,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
});

export default CustomActionButton;
