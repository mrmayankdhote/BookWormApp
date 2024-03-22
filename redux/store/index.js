const redux = require("redux");
const createStore = redux.legacy_createStore;

import booksReducers from "../reducers/BooksReducers";

const store = createStore(redux.combineReducers({
    books:booksReducers
}));

export default store;
