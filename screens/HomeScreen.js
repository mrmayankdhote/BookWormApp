import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import BookCount from "../components/BookCount";
import { Ionicons } from "@expo/vector-icons";
import CustomActionButton from "../components/CustomActionButton";
import colors from "../assets/color";

class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      totalCount: 0,
      readingCount: 0,
      readCount: 0,
      isAddNewBookVisible: false,
      textInputData: "",
      books: [],
    };
  }

  showAddNewBook = () => {
    this.setState({ isAddNewBookVisible: true });
  };

  hideAddNewBook = () => {
    this.setState({ isAddNewBookVisible: false });
  };

  addBook = (book) => {
    this.setState(
      (state, props) => ({
        books: [...state.books, book],
        totalCount: state.totalCount + 1,
        readingCount: state.readingCount + 1,
        isAddNewBookVisible: false,
      }),
      () => {
        console.log(this.state.books);
      }
    );
  };

  markAsRead = (selectedBook, index) => {
    let newList = this.state.books.filter((item) => item != selectedBook);
    this.setState((prevState) => ({
      books: newList,
      readCount: prevState.readCount + 1,
      readingCount: prevState.readingCount - 1,
    }));
  };
  renderItem = (item, index) => (
    <View style={{ height: 50, flexDirection: "row" }}>
      <View style={styles.markAsReadContainer}>
        <Text>{item}</Text>
      </View>
      <CustomActionButton
        onPress={() => this.markAsRead(item, index)}
        style={styles.markAsReadButton}
      >
        <Text style={styles.markasReadText}>Mark as Read.</Text>
      </CustomActionButton>
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView />
        <View style={styles.header}>
          <Text style={styles.headerTitle}> Book Worm</Text>
        </View>
        <View style={styles.container}>
          {this.state.isAddNewBookVisible && (
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter the Book Name"
                placeholderTextColor={colors.txtPLaceholder}
                onChangeText={(text) => {
                  this.setState({ textInputData: text });
                }}
              />
              <CustomActionButton
                style={styles.checkMarkButton}
                onPress={() => {
                  this.addBook(this.state.textInputData);
                }}
              >
                <Ionicons name="checkmark" color={"white"} size={30} />
              </CustomActionButton>
              <CustomActionButton
                style={{
                  backgroundColor: colors.bgError,
                }}
                onPress={() => {
                  this.hideAddNewBook;
                }}
              >
                <Ionicons name="close" color={"white"} size={30} />
              </CustomActionButton>
            </View>
          )}

          <FlatList
            data={this.state.books}
            renderItem={({ item, index }) => this.renderItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              <View style={styles.listEmptyComponent}>
                <Text style={styles.listEmptyComponentText}>
                  Not Reading any Books.
                </Text>
              </View>
            }
          />
          <CustomActionButton
            position={"right"}
            style={styles.addNewBookButton}
            onPress={this.showAddNewBook}
          >
            <Text style={styles.addNewBookText}>+</Text>
          </CustomActionButton>
        </View>

        <View style={styles.footer}>
          <BookCount title={"Total"} count={this.state.totalCount} />
          <BookCount title={"Reading"} count={this.state.readingCount} />
          <BookCount title={"Read"} count={this.state.readCount} />
        </View>
        <SafeAreaView />

        <StatusBar style="auto" />
      </View>
    );
  }
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  header: {
    height: 70,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.bgTextInput,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
  },
  textInputContainer: {
    height: 50,
    flexDirection: "row",
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.bgTextInput,
    padding: 5,
  },
  checkMarkButton: {
    backgroundColor: colors.bgSuccess,
  },
  listEmptyComponent: {
    marginTop: 50,
    alignItems: "center",
  },
  listEmptyComponentText: {
    fontWeight: "900",
  },
  addNewBookButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.bgPrimary,
  },
  addNewBookText: {
    color: "white",
    fontSize: 30,
  },
  footer: {
    height: 70,
    borderTopWidth: 0.5,
    borderTopColor: colors.bgTextInput,
    flexDirection: "row",
  },
  markAsReadButton: {
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
    backgroundColor: colors.borderColor,
  },
});
