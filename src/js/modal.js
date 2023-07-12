// import { getJson, sendJson } from './helpers.js';
import { AJAX } from './helpers.js';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

//
const createRecipeObject = function (recipe) {
  return {
    title: recipe.title,
    id: recipe.id,
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

//
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    const { recipe } = data.data;

    state.recipe = createRecipeObject(recipe);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

//
export const loadSearchResult = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        title: rec.title,
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        ...(rec.key && { key: rec.key }),
      };
    });

    state.search.page = 1;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//
export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;

  return state.search.results.slice(start, end);
};

//
export const updateServing = function (newServing) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * newServing) / state.recipe.servings)
  );

  state.recipe.servings = newServing;
};

//
const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

//
export const addBookmarks = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmark();
};

//
export const deleteBookmarks = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmark();
};

//
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(ing => ing.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    state.recipe = createRecipeObject(data.data.recipe);

    addBookmarks(state.recipe);
  } catch (err) {
    throw err;
  }
};

(function () {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookmarks = JSON.parse(storage);
})();
