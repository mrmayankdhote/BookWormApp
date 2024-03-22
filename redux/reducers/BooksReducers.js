const initialState = {
  books: [],
  booksReading: [],
  booksRead: [],
};

const booksReducers = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_BOOKS_FROM_SERVER":
      return {
        books: action.payload,
        booksReading: action.payload.filter((books) => !books.read),
        booksRead: action.payload.filter((books) => books.read),
      };
    case "ADD_BOOK":
      return {
        books: [action.payload, ...state.books],
        booksReading: [action.payload, ...state.booksReading],
      };
    case "ADD_BOOK":
      return {
        books: [action.payload, ...state.books],
        booksReading: [action.payload, ...state.booksReading],
      };
    case "MARK_BOOK_AS_READ":
      return {
        ...state,
        books: state.books.map((book) => {
          if (book.name == action.payload.name) {
            return { ...book, read: true };
          }
          return book;
        }),
        booksRead: [...state.booksRead, action.payload],
        booksReading: state.books.filter(
          (book) => book.name !== action.payload.name
        ),
      };
    default:
      return state;
  }
};

export default booksReducers;
