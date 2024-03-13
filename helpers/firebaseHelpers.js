export const snapshotToArray = (BookListData) => {
  let returnArray = [];

  BookListData.forEach((BookData) => {
    let item = BookData.val();
    item.key=BookData.key;
    returnArray.push(item)
  });
  return returnArray;
};
