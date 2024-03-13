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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase, ref, get,setKey, set, child, push, query, orderByChild, equalTo } from "firebase/database";

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
      booksReading: [],
      booksRead: [],
      currentUser: [],
    };
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("user");

      if (value !== null) {
        return JSON.parse(value);
      } else {
        return {};
      }
    } catch (error) {
      alert(error);
      // Error retrieving data
    }
  };
  componentDidMount = async () => {
    const { navigation } = this.props;
    const user = await this._retrieveData();
    const db = getDatabase();
    try {
      const currentUser = await get(ref(db, "users/" + user?.uid));
      if (currentUser.toJSON()) {
        this.setState((prevState) => ({
          currentUser: currentUser.toJSON(),
        }));
      }
    } catch (e) {
      alert(e);
    }
  };

  showAddNewBook = () => {
    this.setState({ isAddNewBookVisible: true });
  };

  hideAddNewBook = () => {
    this.setState({ isAddNewBookVisible: false });
  };

  getData = async (book) => {
    try {
      const db = getDatabase();

      const readNewLogEntries = await get(
        query(
          ref(db, "Book/" + this?.state?.currentUser?.uid),
          orderByChild("name"),
          equalTo(book)
        )
      );
      if (readNewLogEntries.val() != null) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      alert(e);
      return false;
    }
  };

  addBook = async (book) => {
    const isBookAlreadyExist = await this.getData(book);
    if (isBookAlreadyExist) {
      alert("Unable to add as book already exists");
    } else {
      try {
        const db = getDatabase();
        const BookListRef = ref(db, "Book/" + this.state.currentUser.uid);
        const newBookRef = push(BookListRef);
        set(
          newBookRef,
          {
            name: book,
            read: false,
          },
          {
            onlyOnce: true,
          }
        );

        this.setState(
          (state, props) => ({
            books: [...state.books, book],
            booksReading: [...state.booksReading, book],
            // booksRead:[],

            totalCount: state.totalCount + 1,
            readingCount: state.readingCount + 1,
            isAddNewBookVisible: false,
          }),
          () => {
            console.log(this.state.books);
          }
        );
      } catch (e) {
        alert(e);
      }
    }
  };

  markAsRead = (selectedBook, index) => {
    let newList = this.state.books.filter((item) => item != selectedBook);
    let newBooksReadingList = this.state.booksReading.filter(
      (item) => item != selectedBook
    );

    this.setState((prevState) => ({
      books: newList,
      booksReading: newBooksReadingList,
      booksRead: [...prevState.booksRead, selectedBook],
      // readCount: prevState.readCount + 1,
      // readingCount: prevState.readingCount - 1,
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
          <BookCount title={"Total Books"} count={this.state.totalCount} />
          <BookCount
            title={"Reading"}
            count={this.state?.booksReading?.length}
          />
          <BookCount title={"Read"} count={this.state.booksRead?.length} />
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
