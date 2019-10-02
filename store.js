const bookmarks = [];
/**
 * bookmark:
 * {
 *  id: str
 *  title: str
 *  rating: 1-5
 *  url: url
 *  desc: str
 *  expanded: false
 *  editing: false
 * }
 */
let error = null;
let adding = false;
let filter = 0;

const findById = function (id) {
  const result = this.bookmarks.find(cur => cur.id === id);
  return result;
};

const setFilter = function(filterLevel) {
  this.filter = filterLevel;

};

const setError = function (err) {
  this.error = err;
};

const setAdding = function(bool) {
  this.adding = bool;
};

const addBookmark = function(bookmark) {
  Object.assign(bookmark, {expanded:false, editing:false});
  this.bookmarks.push(bookmark);
};

const findAndDelete = function(id) {
  this.bookmarks = this.bookmarks.filter(cur => cur.id !== id);
};

const findAndUpdate = function(id, newData) {
  const bookmark = this.findById(id);
  Object.assign(bookmark, newData);
};

const toggleExpanded = function(id) {
  const bookmark = this.findById(id);
  bookmark.expanded = !bookmark.expanded;
};

const setEditing = function(bool) {
  this.editing = bool;
};

export default {
  bookmarks,
  error,
  adding,
  filter,
  findById,
  setFilter,
  setError,
  setAdding,
  addBookmark,
  findAndDelete,
  findAndUpdate,
  toggleExpanded,
  setEditing
};
