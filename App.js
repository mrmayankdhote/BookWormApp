import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BookCount from "./components/BookCount";
import { Ionicons } from "@expo/vector-icons";

class App extends React.Component {
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
        isAddNewBookVisible:false,

      }),
      () => {
        console.log(this.state.books);
      }
    );
  };

  markAsRead=(selectedBook,index)=>{
    let newList = this.state.books.filter((item)=>item!=selectedBook);
    this.setState((prevState)=>({
      books:newList,
      readCount:prevState.readCount+1,
      readingCount:prevState.readingCount-1,
    }))

  }
  renderItem = (item, index) => (
      <View style={{ height: 50, flexDirection: "row" }}>
      <View style={{flex:1,justifyContent:'center',padding:5,
      backgroundColor: "#ececec",
    }}>
        <Text>{item}</Text>
        </View>
        <TouchableOpacity
        onPress={() => this.markAsRead(item,index)}
      >
        <View
          style={{
            width: 100,
            backgroundColor: "#aedeba",
            alignItems: "center",
            justifyContent: "center",
            height: 50,
          }}
        >
        <Text style={{
          fontWeight:'bold',
          color:'white'
        }}>
        Mark as Read.
        </Text>
        </View>
      </TouchableOpacity>
      </View> 
  );

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView />
        <View
          style={{
            height: 70,
            borderBottomWidth: 0.5,
            borderBottomColor: "#E9E9E9",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 24,
            }}
          >
            {" "}
            Book Worm
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          {this.state.isAddNewBookVisible && (
            <View
              style={{
                height: 50,
                flexDirection: "row",
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: "#ececec",
                  padding: 5,
                }}
                placeholder="Enter the Book Name"
                placeholderTextColor={"grey"}
                onChangeText={(text) => {
                  this.setState({ textInputData: text });
                }}
              />
              <TouchableOpacity
                onPress={() => this.addBook(this.state.textInputData)}
              >
                <View
                  style={{
                    width: 50,
                    backgroundColor: "#aedeba",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 50,
                  }}
                >
                  <Ionicons name="checkmark" color={"white"} size={30} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.hideAddNewBook}>
                <View
                  style={{
                    width: 50,
                    backgroundColor: "#deada5",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 50,
                  }}
                >
                  <Ionicons name="close" color={"white"} size={30} />
                </View>
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            data={this.state.books}
            renderItem={({ item, index }) => this.renderItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              <View style={{ marginTop: 50, alignItems: "center" }}>
                <Text
                  style={{
                    fontWeight: "900",
                  }}
                >
                  Not Reading any Books.
                </Text>
              </View>
            }
          />
          <TouchableOpacity
            onPress={this.showAddNewBook}
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#AAD1E6",
              }}
            >
              <Text style={{ color: "white", fontSize: 30 }}>+</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            height: 70,
            borderTopWidth: 0.5,
            borderTopColor: "#E9E9E9",
            flexDirection: "row",
          }}
        >
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
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
});
