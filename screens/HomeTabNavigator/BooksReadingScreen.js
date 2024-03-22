import "react-native-gesture-handler";
import React from "react";
import colors from "../../assets/color";
import { FlatList, StyleSheet, View, Text, ActivityIndicator } from "react-native";
import ListItem from "../../components/ListItem";
import { connect } from "react-redux";

class BooksReadingScreen extends React.Component {
  constructor() {
    super();
  }

  renderItem = (item, index) => <ListItem item={item} />;

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bgMain,
        }}
      >
              {this.props.books.isLoadingBooks && (
          <View
            style={{
              ...StyleSheet.absoluteFill,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              elevation: 1000,
            }}
          >
            <ActivityIndicator size={"large"} color={colors.logColor} />
          </View>
        )}

        <FlatList
          data={this.props.books.booksReading}
          renderItem={({ item, index }) => this.renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={!this.props.books.isLoadingBooks  ? null :
            <View style={styles.listEmptyComponent}>
              <Text style={styles.listEmptyComponentText}>
                Not Reading any Books.
              </Text>
            </View>
          }
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    books: state.books,
  };
};

export default connect(mapStateToProps)(BooksReadingScreen);

const styles = StyleSheet.create({
  listEmptyComponent: {
    marginTop: 50,
    alignItems: "center",
  },
  listEmptyComponentText: {
    fontWeight: "900",
  },
});
