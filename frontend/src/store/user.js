import { csrfFetch } from './csrf';

// Action types
const UPDATE_USER = 'user/UPDATE_USER';
const DELETE_USER = 'user/DELETE_USER';
const USER_ERROR = 'user/USER_ERROR';

// Action creators
const updateUser = (user) => ({
  type: UPDATE_USER,
  user,
});

const deleteUser = () => ({
  type: DELETE_USER,
});

const userError = (error) => ({
  type: USER_ERROR,
  error,
});

// Thunk action to update user information
export const updateUserInfo = (userData) => async (dispatch) => {
  try {
    const response = await csrfFetch('/api/profile/update-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const updatedUser = await response.json();
      dispatch(updateUser(updatedUser));
    } else {
      const errorData = await response.json();
      dispatch(userError(errorData.error));
    }
  } catch (err) {
    dispatch(userError('Failed to update profile'));
  }
};

// Thunk action to delete user account
export const deleteUserAccount = () => async (dispatch) => {
  try {
    const response = await csrfFetch('/api/profile/delete-account', {
      method: 'DELETE',
    });

    if (response.ok) {
      dispatch(deleteUser());
      // Log out the user after deleting the account
      window.location.href = '/'; // Redirect to home or login page
    } else {
      const errorData = await response.json();
      dispatch(userError(errorData.error));
    }
  } catch (err) {
    dispatch(userError('Failed to delete account'));
  }
};

// Reducer
const initialState = {
  user: {},
  error: null,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_USER:
      return { ...state, user: action.user, error: null };
    case DELETE_USER:
      return initialState; // Reset state after account deletion
    case USER_ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
}
