import React from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types"; // ES6

const BookCount = ({ title, count }) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text
      style={{
        fontSize: 20,
      }}
    >
      {title}
    </Text>
    <Text> {count}</Text>
  </View>
);

BookCount.prototype = {
  count: PropTypes.number.isRequired,
  title: PropTypes.string,
};

BookCount.defaultProps = {
  title: "Title",
};
export default BookCount;
