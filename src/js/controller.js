import * as modal from './modal.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addrecipeView.js';
import { MODAL_CLOSE_SEC, UPDATE_FORM_SEC } from './config.js';

///////////////////////////////////////
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    resultView.update(modal.getSearchResultPage());

    bookmarkView.update(modal.state.bookmarks);

    await modal.loadRecipe(id);

    recipeView.render(modal.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

//
const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;

    await modal.loadSearchResult(query);

    resultView.render(modal.getSearchResultPage());

    paginationView.render(modal.state.search);
  } catch (err) {
    resultView.renderError();
  }
};

//
const controlPage = function (goToPage) {
  resultView.render(modal.getSearchResultPage(goToPage));

  paginationView.render(modal.state.search);
};

//
const controlUpdateServing = function (newServing) {
  modal.updateServing(newServing);

  recipeView.update(modal.state.recipe);
};

//
const controlAddBookmarks = function () {
  if (!modal.state.recipe.bookmarked) modal.addBookmarks(modal.state.recipe);
  else modal.deleteBookmarks(modal.state.recipe.id);

  recipeView.update(modal.state.recipe);

  bookmarkView.render(modal.state.bookmarks);
};

//
const controlBookmarks = function () {
  bookmarkView.render(modal.state.bookmarks);
};

//
const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await modal.uploadRecipe(newRecipe);

    recipeView.render(modal.state.recipe);

    window.history.pushState(null, '', `#${modal.state.recipe.id}`);

    addRecipeView.renderMessage();

    bookmarkView.render(modal.state.bookmarks);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    setTimeout(function () {
      addRecipeView.render(true);
    }, UPDATE_FORM_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

//
// const init = function () {
//   bookmarkView.addHandlerRender(controlBookmarks);
//   recipeView.addHandlerRender(controlRecipes);
//   recipeView.addHandlerUpdateServing(controlUpdateServing);
//   recipeView.addHandlerBookmark(controlAddBookmarks);
//   searchView.addHandlerSearch(controlSearchResults);
//   paginationView.addHandlerClick(controlPage);
//   addRecipeView.addHandlerUploadRecipe(controlAddRecipe);
// };
// init();

//
(function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServing(controlUpdateServing);
  recipeView.addHandlerBookmark(controlAddBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPage);
  addRecipeView.addHandlerUploadRecipe(controlAddRecipe);
})();
