import api from './api.js';
import store from './store.js';
import bookmarks from './bookmarks.js';

function init() {
  api.getBookmarks()
    .then(marks => {
      marks.forEach(bookmark => store.addBookmark(bookmark));
      bookmarks.render();
    })
    .catch(err => {
      store.setError(err);
      bookmarks.render();
    });
  bookmarks.bindEventListeners();
}

$(init);
