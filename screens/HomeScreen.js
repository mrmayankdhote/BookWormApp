import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  Image,
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
import { getDatabase, ref, get,setKey, set, child, push, query, orderByChild, equalTo, update } from "firebase/database";
import { snapshotToArray } from "../helpers/firebaseHelpers";
import { bool } from "prop-types";
import ListItem from "../components/ListItem";
import * as Animatable from 'react-native-animatable'

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
    this.textInputRef=null;
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
      const BookListRef = await get(ref(db, "Book/" + user?.uid));
      const Books = snapshotToArray(BookListRef);
      if (currentUser.toJSON()) {
        this.setState((prevState) => ({
          currentUser: currentUser.toJSON(),
          books: Books,
          booksRead: Books.filter((item) => item.read == true),
          booksReading: Books.filter((item) => item.read == false),
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
    this.setState({
      textInput:''
    })
    this. textInputRef.setNativeProps({text: ""});
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
            books: [...state.books, { name: book, read: false }],
            booksReading: [...state.booksReading, { name: book, read: false }],
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

  markAsRead = async (selectedBook, index) => {
    try {
      const dbRef = ref(getDatabase());
      const updates = {};
      updates[
        `Book/${this.state.currentUser?.uid}/${selectedBook?.key}/read`
      ] = true;
      await update(dbRef, updates);
    } catch (e) {
      console.log("markAsRead method error" + e);
    }

    let newList = this.state.books.map((book) => {
      if (book.name == selectedBook.name) {
        return { ...book, read: true };
      } else return book;
    });

    let newBooksReadingList = this.state.booksReading.filter(
      (book) => book.name != selectedBook.name
    );

    this.setState((prevState) => ({
      books: newList,
      booksReading: newBooksReadingList,
      booksRead: [
        ...prevState.booksRead,
        { name: selectedBook.name, read: true },
      ],
      // readCount: prevState.readCount + 1,
      // readingCount: prevState.readingCount - 1,
    }));
  };
  renderItem = (item, index) => (
    // <View style={{  flexDirection: "row",backgroundColor:colors.listItemBg ,minHeight: 100,alignItems:'center',marginVertical:5}}>
    // <View style={styles.imageContainer}>
    // <Image source={require('../assets/icon.png')}  style={styles.image} />
    // </View>
    // <View style={styles.markAsReadContainer}>
    //     <Text style={styles.listItemTitle}>{item.name}</Text>
    //   </View>
    //   {item.read==true ? (
    //     <Ionicons name="checkmark" color={colors.logColor} size={30} />
    //   ) : (
    //     <CustomActionButton
    //       onPress={() => this.markAsRead(item, index)}
    //       style={styles.markAsReadButton}
    //     >
    //       <Text style={styles.markasReadText}>Mark as Read.</Text>
    //     </CustomActionButton>
    //   )}
    // </View>
    <ListItem item={item}>
      {item.read == true ? (
        <Ionicons name="checkmark" color={colors.logColor} size={30} />
      ) : (
        <CustomActionButton
          onPress={() => this.markAsRead(item, index)}
          style={styles.markAsReadButton}
        >
          <Text style={styles.markasReadText}>Mark as Read.</Text>
        </CustomActionButton>
      )}
    </ListItem>
  );

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView />
        {/* <View style={styles.header}> */}
          {/* <Text style={styles.headerTitle}> Book Worm</Text> */}
        {/* </View> */}
        <View style={styles.container}>
          {/* {this.state.isAddNewBookVisible && (
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
          )} */}
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter the Book Name"
              placeholderTextColor={colors.txtPLaceholder}
              onChangeText={(text) => {
                this.setState({ textInputData: text });
              }}

              ref={component => {this.textInputRef= component}}            />
          </View>
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
          <Animatable.View
            animation={
              this.state.textInputData.length > 0
                ? "slideInRight"
                : "slideOutRight"
            }
          >
            <CustomActionButton
              position={"right"}
              style={styles.addNewBookButton}
              onPress={()=>{
                this.addBook(this.state.textInputData);
                }}
            >
              <Text style={styles.addNewBookText}>+</Text>
            </CustomActionButton>
          </Animatable.View>
        </View>

        {/* <View style={styles.footer}>
          <BookCount title={"Total Books"} count={this.state.books?.length} />
          <BookCount
            title={"Reading"}
            count={this.state?.booksReading?.length}
          />
          <BookCount title={"Read"} count={this.state.booksRead?.length} />
        </View> */}
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
    backgroundColor: colors.bgMain,
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
    margin:5
  },
  textInput: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingLeft:5,
    borderColor:colors.listItemBg,
    borderBottomWidth:5,
    fontSize:22,
    fontWeight:'200',
    color:colors.white

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
});
