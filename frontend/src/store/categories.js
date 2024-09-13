// store/categories.js
import { csrfFetch } from './csrf';

// Action Types
const SET_CATEGORIES = 'categories/SET_CATEGORIES';

// Action Creators
const setCategories = (categories) => ({
  type: SET_CATEGORIES,
  categories,
});

// Thunk Action to fetch categories
export const fetchCategories = () => async (dispatch) => {
  const response = await csrfFetch('/api/categories');
  if (response.ok) {
    const categories = await response.json();
    console.log('Categories:', categories);
    dispatch(setCategories(categories));
  }
};

// Categories Reducer
const categoriesReducer = (state = [], action) => {
  switch (action.type) {
    case SET_CATEGORIES:
      return action.categories;
    default:
      return state;
  }
};

export default categoriesReducer;
