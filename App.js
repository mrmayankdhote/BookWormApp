import "react-native-gesture-handler";
import React from "react";
import BookWorm from "./BookWorm";
import { firebaseConfig } from "./config/config";
import * as firebase from "firebase/app";
import { initializeAuth, getReactNativePersistence  } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


class App extends React.Component {
  constructor() {
    super();
    this.initializeFirebase();
  }
  render() {
    return <BookWorm />;
  }

  initializeFirebase = () => {
    const app = firebase.initializeApp(firebaseConfig);

    initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  };
}

// const App = () =>
//   <BookWorm />
// ;

export default App;
