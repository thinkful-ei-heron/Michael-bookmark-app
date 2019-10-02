import store from './store.js';
import api from './api.js';

const buildAddingScreen = function() {
  //if case we're here because an attempt to add a bookmark failed, we don't want to make the user start over
  const url = $('#bm-url').val();
  const title = $('#bm-title').val();
  const desc = $('#desc').val();

  //I would like to persist rating but not sure how
  //it's the least annoying to redo so it can be a stretch goal
  //we're going to rely on undefined being falsy for the ternary operator:
  let html = `<form name="add-bookmark" id="add">
  <div class="url-section add">
    <label for="url">Add new bookmark:</label>
    <input type="url" name="url" id="bm-url" placeholder="https://google.com" value="${url ? url : ''}" required>
  </div>
  <div class="title add">
    <label for="title">Link title: </label>
    <input type="text" placeholder="A Short Title" name="title" id="bm-title"  value="${title ? title : ''}" required>
  </div>
  <div class="rating add">
    <input type="radio" id="rate-5" name="rating" value="5" required>
    <label for="rate-5">&#x2606;</label>
    <input type="radio" id="rate-4" name="rating" value="4">
    <label for="rate-4">&#x2606;</label>
    <input type="radio" id="rate-3" name="rating" value="3">
    <label for="rate-3">&#x2606;</label>
    <input type="radio" id="rate-2" name="rating" value="2">
    <label for="rate-2">&#x2606;</label>
    <input type="radio" id="rate-1" name="rating" value="1">
    <label for="rate-1">&#x2606;</label>
  </div>
  <div class="description add">
    <label for="desc">Description (optional):</label>
    <textarea name="desc" id="desc"
    placeholder="A longer description of the site you are bookmarking, if you wish to include one.">${desc ? desc : ''}</textarea>
  </div>
  <div class="add-controls">
    ${store.error !== null ? '<div class="error">Error: ' + store.error + '</div>': ''}
  </div>
  </form>
  <button type="button" id="cancel">Cancel</button> <button type="submit" class="ok" id="create">Create</button>`;
  html = html.concat('');

  return html;
};

const buildMainScreen = function() {
  let html = '';
  if(store.error !== null) {
    html = html.concat(`<div class="error">Error: ${store.error}</div>`);
  }
  store.bookmarks.forEach(bm => {
    if(store.filter > bm.rating){
      return; //skip this bookmark
    }
    let ratingString = '';
    for (let i = 0; i < bm.rating; i++) {
      ratingString = ratingString.concat('&starf;');
    }
    for (let i = bm.rating; i < 5; i++) {
      ratingString = ratingString.concat('&star;');
    }

    if(bm.expanded  && !bm.editing){
      html = html.concat(`<div class="bookmark expand container">
      <div class="expand top">
          <button type="button" class="title bookmark expand" id="${bm.id}">${bm.title}</button>
          <button type="button" class="del" id="del-${bm.id}">del</button>

      </div>
      <div class="expand header">
          <a href="${bm.url}" class="visit">Visit Site</a>
          <button type="button" class="${store.editing ? 'hidden' : 'edit'}" id="edit-${bm.id}">edit</button>
          <span class="rating expand">${bm.rating}</span>
      </div>`);
      if(bm.desc){
        html = html.concat(`<div class="expand body">
        <p class="expand body text">${bm.desc}</p>
      </div>`);
      }
      html = html.concat('</div>');
    }  else if (bm.editing) {
      html = html.concat(`<div class="bookmark expand container">
      <div class="expand top">
          <button type="button" class="title bookmark expand" id="${bm.id}">${bm.title}</button>
          <button type="button" class="del" id="del-${bm.id}">del</button>

      </div>
      <div class="expand header">
          <a href="${bm.url}" class="visit">Visit Site</a>
          <button type="button" class="save" id="save-${bm.id}">Save</button>
      </div>
      <div class="rating add edit">
        <input type="radio" id="rate-5" name="rating" value="5"
        ${5 === bm.rating ? 'checked' : ''} required>
        <label for="rate-5">&#x2606;</label>
        <input type="radio" id="rate-4" name="rating" value="4"
        ${4 === bm.rating ? 'checked' : ''}>
        <label for="rate-4">&#x2606;</label>
        <input type="radio" id="rate-3" name="rating" value="3"
        ${3 === bm.rating ? 'checked' : ''}>
        <label for="rate-3">&#x2606;</label>
        <input type="radio" id="rate-2" name="rating" value="2"
        ${2 === bm.rating ? 'checked' : ''}>
        <label for="rate-2">&#x2606;</label>
        <input type="radio" id="rate-1" name="rating" value="1"
        ${1 === bm.rating ? 'checked' : ''}>
        <label for="rate-1">&#x2606;</label>
      </div>
      <div class="description add edit">
      <label for="desc">Description (optional):</label>
      <textarea name="desc" id="desc"
      placeholder="A longer description of the site you are bookmarking, if you wish to include one.">${bm.desc ? bm.desc : ''}</textarea>
    </div>
      `);
    } else {
      html = html.concat(`<button type="button" class="bookmark" id="${bm.id}"><span class="title">${bm.title}</span> <span class="rating">${ratingString}</span></button>`);
    }
  });
  return html;
};




const render = function() {
  let html = '';
  if(store.adding){
    html = buildAddingScreen();
    $('.controls').hide();
    $('main').removeClass('bm-list');
  } else {
    html = buildMainScreen();
    $('.controls').show();
    $('main').addClass('bm-list');
  }
  $('main').html(html);
};

const handleNewClick = function() {
  $('.controls').on('click', '.new', event => {
    event.preventDefault();
    store.setAdding(true);
    render();
  });
};

const handleCreateClick = function() {
  $('main').on('click', '#create', event => {
    event.preventDefault();
    const url = $('#bm-url').val();
    const title = $('#bm-title').val();
    const rating = $('input[name="rating"]:checked').val();
    const desc = $('#desc').val();
    // I don't think we're supposed to do it like this, but this seems easier
    // browser default messages are pretty user friendly and no need to worry about keeping input
    // const valid = $('#add').get(0).reportValidity();
    // if(!valid) {
    //   return false;
    //
    // }
    if(rating && /^https?:\/\//.test(url) && title.length > 0) {
      api.addBookmark({url, title, rating, desc})
        .then(bookmark => {
          store.addBookmark(bookmark);
          store.setAdding(false);
          store.setError(null);
          render();
        })
        .catch(error => {
          store.setError(error.message);
          render();
        });
    } else {
      let missing = [];
      if (!rating){ //null if no rating selected, which is falsy
        missing.push('rating');
      }
      if (!(/^https?:\/\//.test(url))) {
        missing.push('URL');
      }
      if (title.length === 0) {
        missing.push('title');
      }
      let err = `${missing.join(', ')} required`;
      store.setError(err);
      render();
      return false;
    }
  });
};

const handleCancelClick = function() {
  $('main').on('click', '#cancel', event => {
    event.preventDefault();
    store.setAdding(false);
    render();
  });
};

const handleBookmarkClick = function() {
  $('main').on('click', 'button.bookmark', event => {
    const id = event.target.id;
    store.toggleExpanded(id);
    render();
  });
};

const handleDeleteClick = function() {
  $('main').on('click', 'button.del', event => {
    if(confirm('Are you sure you wish to delete this bookmark?')){
      const id = event.target.id.slice(4); //"del-" means that ID begins at index 4
      api.deleteBookmark(id)
        .then(() => {
          store.findAndDelete(id);
          render();
        })
        .catch(err => {
          store.setError(err);
          render();
        });
    }
  });
};

const handleFilter = function() {
  $('.controls').on('change', '.filter', () => {
    let minRating = Number.parseInt($('.filter').val());
    store.setFilter(minRating);
    render();
  });
};

const handleEditClick = function() {
  $('main').on('click', 'button.edit', event => {
    let id = event.target.id.slice(5); //avoid "edit-", just get ID
    if (!store.editing){
      const bm = store.findById(id);
      bm.editing = true;
      store.setEditing(true);
    } else {
      store.setError('something went wrong with edit protection');
    }
    render();
  });
};

const handleSaveClick = function() {
  $('main').on('click', 'button.save', event => {
    let id = event.target.id.slice(5);
    let rating = Number.parseInt($('input[name="rating"]:checked').val());
    let desc = $('#desc').val();
    let updateObj = {};
    let bm = store.findById(id);
    if (rating !== bm.rating){
      Object.assign(updateObj, {rating});
    }
    if(desc !== bm.desc){
      Object.assign(updateObj, {desc});
    }
    if(updateObj.desc === '') {
      Object.assign(updateObj, {desc: null}) //API will reject an empty string
    }
    if(!$.isEmptyObject(updateObj))
    {
      api.updateBookmark(id, updateObj)
        .then( () => {
          Object.assign(updateObj, {editing: false})
          store.findAndUpdate(id, updateObj);
          store.setEditing(false);
          render();
        })
        .catch(err => {
          store.setError(err);
          console.dir(err);
          render();
        });
    } else {
      store.findAndUpdate(id, {editing: false});
      store.setEditing(false);
      render();
    }
  });
};

const bindEventListeners = function() {
  handleNewClick();
  handleCancelClick();
  handleCreateClick();
  handleBookmarkClick();
  handleDeleteClick();
  handleFilter();
  handleEditClick();
  handleSaveClick();
};


export default {
  render,
  bindEventListeners
};
