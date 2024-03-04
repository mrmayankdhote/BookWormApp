import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator
} from 'react-native';
import BookCount from '../components/BookCount';
import { Ionicons } from '@expo/vector-icons';
import CustomActionButton from '../components/CustomActionButton';
import colors from '../assets/colors';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { snapshotToArray } from '../helpers/firebaseHelpers';
import ListItem from '../components/ListItem';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import ListEmptyComponent from '../components/ListEmptyComponent';
import Swipeout from 'react-native-swipeout';
import * as ImageHelpers from '../helpers/ImageHelpers';

class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      // totalCount: 0,
      // readingCount: 0,
      // readCount: 0,
      isAddNewBookVisible: false,
      books: [],
      booksReading: [],
      booksRead: [],
      textInputData: '',
      currentUser: {}
    };
    console.log('constructor');
    this.textInputRef = null;
  }

  componentDidMount = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const currentUserData = await firebase
      .database()
      .ref('users')
      .child(user.uid)
      .once('value');

    const books = await firebase
      .database()
      .ref('books')
      .child(user.uid)
      .once('value');

    const booksArray = snapshotToArray(books);

    this.setState({
      currentUser: currentUserData.val()
    });

    this.props.loadBooks(booksArray.reverse());
    this.props.toggleIsLoadingBooks(false);
    console.log(this.props.books);
  };

  componentDidUpdate() {
    console.log('update');
  }

  componentWillUnmount() {
    console.log('unmount');
  }

  showAddNewBook = () => {
    this.setState({ isAddNewBookVisible: true });
  };

  hideAddNewBook = () => {
    this.setState({ isAddNewBookVisible: false });
  };

  addBook = async book => {
    this.setState({ textInputData: '' });
    this.textInputRef.setNativeProps({ text: '' });

    try {
      const snapshot = await firebase
        .database()
        .ref('books')
        .child(this.state.currentUser.uid)
        .orderByChild('name')
        .equalTo(book)
        .once('value');

      if (snapshot.exists()) {
        alert('unable to add as book already exists');
      } else {
        const key = await firebase
          .database()
          .ref('books')
          .child(this.state.currentUser.uid)
          .push().key;

        const response = await firebase
          .database()
          .ref('books')
          .child(this.state.currentUser.uid)
          .child(key)
          .set({ name: book, read: false });
        this.props.addBook({ name: book, read: false, key: key });
      }
    } catch (error) {
      console.log(error);
    }
  };

  markAsRead = async (selectedBook, index) => {
    try {
      this.props.toggleIsLoadingBooks(true);

      await firebase
        .database()
        .ref('books')
        .child(this.state.currentUser.uid)
        .child(selectedBook.key)
        .update({ read: true });

      let books = this.state.books.map(book => {
        if (book.name == selectedBook.name) {
          return { ...book, read: true };
        }
        return book;
      });

      let booksReading = this.state.booksReading.filter(
        book => book.name !== selectedBook.name
      );

      this.props.markBookAsRead(selectedBook);
      this.props.toggleIsLoadingBooks(false);
    } catch (error) {
      console.log(error);
      this.props.toggleIsLoadingBooks(false);
    }
  };

  markAsUnread = async (selectedBook, index) => {
    try {
      this.props.toggleIsLoadingBooks(true);

      await firebase
        .database()
        .ref('books')
        .child(this.state.currentUser.uid)
        .child(selectedBook.key)
        .update({ read: false });

      this.props.markBookAsUnread(selectedBook);
      this.props.toggleIsLoadingBooks(false);
    } catch (error) {
      console.log(error);
      this.props.toggleIsLoadingBooks(false);
    }
  };

  deleteBook = async (selectedBook, index) => {
    try {
      this.props.toggleIsLoadingBooks(true);

      await firebase
        .database()
        .ref('books')
        .child(this.state.currentUser.uid)
        .child(selectedBook.key)
        .remove();

      this.props.deleteBook(selectedBook);
      this.props.toggleIsLoadingBooks(false);
    } catch (error) {
      console.log(error);
      this.props.toggleIsLoadingBooks(false);
    }
  };

  uploadImage = async (image, selectedBook) => {
    const ref = firebase
      .storage()
      .ref('books')
      .child(this.state.currentUser.uid)
      .child(selectedBook.key);

    try {
      //converting to blob
      const blob = await ImageHelpers.prepareBlob(image.uri);
      const snapshot = await ref.put(blob);

      let downloadUrl = await ref.getDownloadURL();

      await firebase
        .database()
        .ref('books')
        .child(this.state.currentUser.uid)
        .child(selectedBook.key)
        .update({ image: downloadUrl });

      blob.close();

      return downloadUrl;
    } catch (error) {
      console.log(error);
    }
  };

  openImageLibrary = async selectedBook => {
    const result = await ImageHelpers.openImageLibrary();

    if (result) {
      this.props.toggleIsLoadingBooks(true);
      const downloadUrl = await this.uploadImage(result, selectedBook);
      this.props.updateBookImage({ ...selectedBook, uri: downloadUrl });
      this.props.toggleIsLoadingBooks(false);
    }
  };

  openCamera = async selectedBook => {
    const result = await ImageHelpers.openCamera();

    if (result) {
      this.props.toggleIsLoadingBooks(true);
      const downloadUrl = await this.uploadImage(result, selectedBook);
      this.props.updateBookImage({ ...selectedBook, uri: downloadUrl });
      this.props.toggleIsLoadingBooks(false);
    }
  };

  addBookImage = selectedBook => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = ['Select from Photos', 'Camera', 'Cancel'];
    const cancelButtonIndex = 2;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      buttonIndex => {
        // Do something here depending on the button index selected
        if (buttonIndex == 0) {
          this.openImageLibrary(selectedBook);
        } else if (buttonIndex == 1) {
          this.openCamera(selectedBook);
        }
      }
    );
  };

  renderItem = (item, index) => {
    let swipeoutButtons = [
      {
        text: 'Delete',
        component: (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="ios-trash" size={24} color={colors.txtWhite} />
          </View>
        ),
        backgroundColor: colors.bgDelete,
        onPress: () => this.deleteBook(item, index)
      }
    ];

    if (!item.read) {
      swipeoutButtons.unshift({
        text: 'Mark Read',
        component: (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: colors.txtWhite }}>Mark as Read</Text>
          </View>
        ),
        backgroundColor: colors.bgSuccessDark,
        onPress: () => this.markAsRead(item, index)
      });
    } else {
      swipeoutButtons.unshift({
        text: 'Mark Unread',
        component: (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: colors.txtWhite }}>Mark Unread</Text>
          </View>
        ),
        backgroundColor: colors.bgUnread,
        onPress: () => this.markAsUnread(item, index)
      });
    }

    return (
      <Swipeout
        autoClose={true}
        style={{ marginHorizontal: 5, marginVertical: 5 }}
        backgroundColor={colors.bgMain}
        right={swipeoutButtons}
      >
        <ListItem
          editable
          onPress={() => this.addBookImage(item)}
          editable={true}
          marginVertical={0}
          item={item}
        >
          {item.read && (
            <Ionicons
              style={{ marginRight: 5 }}
              name="ios-checkmark"
              color={colors.logoColor}
              size={30}
            />
          )}
        </ListItem>
      </Swipeout>
    );
  };

  render() {
    console.log('render');
    return (
      <View style={styles.container}>
        <SafeAreaView />

        <View style={styles.container}>
          {this.props.books.isLoadingBooks && (
            <View
              style={{
                ...StyleSheet.absoluteFill,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                elevation: 1000
              }}
            >
              <ActivityIndicator size="large" color={colors.logoColor} />
            </View>
          )}
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Book Name"
              placeholderTextColor={colors.txtPlaceholder}
              onChangeText={text => this.setState({ textInputData: text })}
              ref={component => {
                this.textInputRef = component;
              }}
            />
          </View>

          {/* {this.state.isAddNewBookVisible && (
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter Book Name"
                placeholderTextColor="grey"
                onChangeText={text => this.setState({ textInputdata: text })}
              />
              <CustomActionButton
                style={styles.checkmarkButton}
                onPress={() => this.addBook(this.state.textInputdata)}
              >
                <Ionicons name="ios-checkmark" size={40} color="white" />
              </CustomActionButton>
              <CustomActionButton onPress={this.hideAddNewBook}>
                <Ionicons name="ios-close" size={40} color="white" />
              </CustomActionButton>
             
            </View>
          )} */}

          <FlatList
            data={this.props.books.books}
            renderItem={({ item }, index) => this.renderItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              !this.props.books.isLoadingBooks && (
                <ListEmptyComponent text="Not Reading Any Books." />
              )
            }
          />
          <Animatable.View
            animation={
              this.state.textInputData.length > 0
                ? 'slideInRight'
                : 'slideOutRight'
            }
          >
            <CustomActionButton
              position="right"
              style={styles.addNewBookButton}
              onPress={() => this.addBook(this.state.textInputData)}
            >
              <Text style={styles.addNewBookButtonText}>+</Text>
            </CustomActionButton>
          </Animatable.View>
        </View>

        {/* <View style={styles.footer}>
          <BookCount count={this.state.books.length} title="Total Books" />
          <BookCount count={this.state.booksReading.length} title="Reading" />
          <BookCount count={this.state.booksRead.length} title="Read" />
        </View> */}
        <SafeAreaView />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    books: state.books
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadBooks: books =>
      dispatch({ type: 'LOAD_BOOKS_FROM_SERVER', payload: books }),
    addBook: book => dispatch({ type: 'ADD_BOOK', payload: book }),
    markBookAsRead: book =>
      dispatch({ type: 'MARK_BOOK_AS_READ', payload: book }),
    toggleIsLoadingBooks: bool =>
      dispatch({ type: 'TOGGLE_IS_LOADING_BOOKS', payload: bool }),
    markBookAsUnread: book =>
      dispatch({ type: 'MARK_BOOK_AS_UNREAD', payload: book }),
    deleteBook: book => dispatch({ type: 'DELETE_BOOK', payload: book }),
    updateBookImage: book =>
      dispatch({ type: 'UPDATE_BOOK_IMAGE', payload: book })
  };
};

const wrapper = compose(
  connect(mapStateToProps, mapDispatchToProps),
  connectActionSheet
);

export default wrapper(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain
  },
  header: {
    height: 70,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderColor,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 24
  },
  textInputContainer: {
    height: 50,
    flexDirection: 'row',
    margin: 5
  },
  textInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderColor: colors.listItemBg,
    borderBottomWidth: 5,
    fontSize: 22,
    fontWeight: '200',
    color: colors.txtWhite
  },
  checkmarkButton: {
    backgroundColor: colors.bgSuccess
  },
  listEmptyComponent: {
    marginTop: 50,
    alignItems: 'center'
  },
  listEmptyComponentText: {
    fontWeight: 'bold'
  },
  markAsReadButton: {
    width: 100,
    backgroundColor: colors.bgSuccess
  },
  markAsReadButtonText: {
    fontWeight: 'bold',
    color: 'white'
  },
  addNewBookButton: {
    backgroundColor: colors.bgPrimary,
    borderRadius: 25
  },
  addNewBookButtonText: {
    color: 'white',
    fontSize: 30
  },
  footer: {
    height: 70,
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: colors.borderColor
  }
});
5.4;
