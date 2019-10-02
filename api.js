const BASE_URL = 'https://thinkful-list-api.herokuapp.com/mikirsch/bookmarks';
const ctypeHeader = new Headers({
  'Content-Type': 'application/json'
});

const fetchWrapper = function (...args) {
  let error;
  return fetch(...args)
    .then(res => {
      if (!res.ok) {
        error = {code: res};
        console.error(error);
      }
      return res.json();
    })
    .then(data => {
      if(error) {
        error.message = data.message;
        return Promise.reject(error);
      }
      return data;
    });
};

const getBookmarks = function () {
  return fetchWrapper(BASE_URL);
};

const addBookmark = function(bookmarkObj) {
  const bookmark = JSON.stringify(bookmarkObj);
  return fetchWrapper(BASE_URL, {
    method: 'POST',
    headers: ctypeHeader,
    body: bookmark
  });
};

const updateBookmark = function (id, updateObj) {
  const update =JSON.stringify(updateObj);
  return fetchWrapper(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: ctypeHeader,
    body: update
  });
};

const deleteBookmark = function (id) {
  return fetchWrapper(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });
};

export default{
  getBookmarks,
  addBookmark,
  updateBookmark,
  deleteBookmark
};
