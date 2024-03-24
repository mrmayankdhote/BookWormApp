import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import colors from "../../assets/color";
import PropTypes from "prop-types"; // ES6


const BookCountCointainers = ({ color, type,...props }) => (
  <View style={styles.container}>
    <Text
      style={{
        color: color,
      }}
    >
      {props?.books[type]?.length || 0}
    </Text>
  </View>
);

const mapStateToProps = (state) => {
  return {
    books: state.books,
  };
};

BookCountCointainers.defaultProps = {
  color: colors.txtPLaceholder,
};

BookCountCointainers.prototype = {
    color: PropTypes.string,
    type: PropTypes.string.isRequired,
  };
  
export default connect(mapStateToProps)(BookCountCointainers);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
