import React, { lazy } from "react";
import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator
} from "react-native";
import BookCount from "../components/BookCount";
import { Ionicons } from "@expo/vector-icons";
import CustomActionButton from "../components/CustomActionButton";
import colors from "../assets/color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase, ref, get,setKey, set, child, push, query, orderByChild, equalTo, update, remove } from "firebase/database";
import { snapshotToArray } from "../helpers/firebaseHelpers";
import { bool } from "prop-types";
import ListItem from "../components/ListItem";
import * as Animatable from 'react-native-animatable'
import { connect } from "react-redux";
import Swipeout from "react-native-swipeout";

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
          // books: Books,
          // booksRead: Books.filter((item) => item.read == true),
          // booksReading: Books.filter((item) => item.read == false),
        }));
        this.props.loadBooks(Books?.reverse())
        this.props.toggleIsLoadingBook(false)

      }
      this.props.toggleIsLoadingBook(false)

    } catch (e) {
      this.props.toggleIsLoadingBook(false)
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
    this.props.toggleIsLoadingBook(true);
    this.setState({
      textInput:''
    })
    this. textInputRef.setNativeProps({text: ""});
    const isBookAlreadyExist = await this.getData(book);
    if (isBookAlreadyExist) {
      alert("Unable to add as book already exists");
      this.props.toggleIsLoadingBook(false);

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

        // this.setState(
        //   (state, props) => ({
        //     books: [...state.books, { name: book, read: false }],
        //     booksReading: [...state.booksReading, { name: book, read: false }],
        //     // booksRead:[],

        //     totalCount: state.totalCount + 1,
        //     readingCount: state.readingCount + 1,
        //     isAddNewBookVisible: false,
        //   }),
        //   () => {
        //     console.log(this.state.books);
        //   }
        // );

         this.props.addBook({name:book,read: false})
         this.props.toggleIsLoadingBook(false)

} catch (e) {
        alert(e);
      }
    }
  };

  markAsRead = async (selectedBook, index) => {
    try {
      this.props.toggleIsLoadingBook(true);

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

    // this.setState((prevState) => ({
    //   books: newList,
    //   booksReading: newBooksReadingList,
    //   booksRead: [
    //     ...prevState.booksRead,
    //     { name: selectedBook.name, read: true },
    //   ],
    //   // readCount: prevState.readCount + 1,
    //   // readingCount: prevState.readingCount - 1,
    // }));
    this.props.markBookAsRead(selectedBook)
    this.props.toggleIsLoadingBook(false)

    
  };

  markAsUnRead = async (selectedBook, index) => {
    try {
      this.props.toggleIsLoadingBook(true);

      const dbRef = ref(getDatabase());
      const updates = {};
      updates[
        `Book/${this.state.currentUser?.uid}/${selectedBook?.key}/read`
      ] = false;
      await update(dbRef, updates);
    } catch (e) {
      console.log("markAsRead method error" + e);
    }

    // let newList = this.state.books.map((book) => {
    //   if (book.name == selectedBook.name) {
    //     return { ...book, read: false };
    //   } else return book;
    // });

    // let newBooksReadingList = this.state.booksReading.filter(
    //   (book) => book.name != selectedBook.name
    // );

    // this.setState((prevState) => ({
    //   books: newList,
    //   booksReading: newBooksReadingList,
    //   booksRead: [
    //     ...prevState.booksRead,
    //     { name: selectedBook.name, read: true },
    //   ],
    //   // readCount: prevState.readCount + 1,
    //   // readingCount: prevState.readingCount - 1,
    // }));
    alert(selectedBook)
    this.props.markBookAsUNRead(selectedBook)
    this.props.toggleIsLoadingBook(false)

    
  };

  deleteBook = async (selectedBook, index) => {
    try {
      this.props.toggleIsLoadingBook(true);

      const dbRef = ref(getDatabase());
      await remove(dbRef, `Book/${this.state.currentUser?.uid}/${selectedBook?.key}`)
      this.props.deleteBook(selectedBook);
      this.props.toggleIsLoadingBook(false);

    } catch (e) {
      alert("deleteBook error" + e);
    }

    this.props.deleteBook(selectedBook)
    this.props.toggleIsLoadingBook(false)

    
  };


  renderItem = (item, index) => {
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

    let swipeoutButtons = [
      !item.read
        ? {
            text: "Mark read",
            component: (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontSize:14,
                  }}
                >
                  Mark read
                </Text>
              </View>
            ),
            backgroundColor: colors.bgSuccess,
            onPress: () => {
              this.markAsRead(item,index)
            },
          }
        : {
            text: "Mark as unread",
            backgroundColor: colors.bgUnread,
            component: (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontSize:14,
                  }}
                >
                  Mark Unread
                </Text>
              </View>
            ),
            onPress: () => {
              this.markAsUnRead(item,index)
            },
          },
      {
        text: "Delete",
        component: (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="trash-bin" size={24} color={colors.white} />
          </View>
        ),
        backgroundColor: colors.bgDelete,
        onPress: () => {
          this.deleteBook(item,index);
        },
      },
    ];


return  (
<Swipeout
autoClose={true}
backgroundColor={colors.bgMain}
right={swipeoutButtons}
 >

<ListItem item={item} marginVertical={0} editabled={true}>
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
</Swipeout>)
  };
  

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
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter the Book Name"
              placeholderTextColor={colors.txtPLaceholder}
              onChangeText={(text) => {
                this.setState({ textInputData: text });
              }}
              ref={(component) => {
                this.textInputRef = component;
              }}
            />
          </View>
          <FlatList
            data={this.props.books.books}
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
              onPress={() => {
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

const mapStateToProps = state => {
  return {
  books: state.books,
  }
}

  
const mapDispatchToProps = (dispatch) => {
  return {
    loadBooks: (books) =>
      dispatch({ type: "LOAD_BOOKS_FROM_SERVER", payload: books }),
      addBook: (books) =>
      dispatch({ type: "ADD_BOOK", payload: books }),
      markBookAsRead: (book) =>
      dispatch({ type: "MARK_BOOK_AS_READ", payload: book }),
      toggleIsLoadingBook: (bool) =>
      dispatch({ type: "TOGGLE_IS_BOOK_LOADING", payload: bool }),
      markBookAsUNRead: (book) =>
      dispatch({ type: "MARK_BOOK_AS_UNREAD", payload: book }),
      deleteBook: (book) =>
      dispatch({ type: "DELETE_BOOK", payload: book })
      

  };
};

export default connect(mapStateToProps,mapDispatchToProps)(HomeScreen);

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
