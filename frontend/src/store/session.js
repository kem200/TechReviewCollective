import { csrfFetch } from './csrf';

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";
const SET_ERRORS = "session/setErrors"; // New action type for errors

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

const setErrors = (errors) => ({ // New action creator for errors
  type: SET_ERRORS,
  payload: errors
});

export const signup = (user) => async (dispatch) => {
  const { username, display_name, email, password } = user;
  try {
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ username, email, display_name, password }),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(setUser(data.user));
      dispatch(setErrors(null)); // Clear errors on success
      return { ok: true };
    }
  } catch (error) {
    console.log(error);
    const { data } = error; // Destructure the data from the error object
    const errorData = data.errors || [data.error]; // Extract errors or message
    dispatch(setErrors(errorData)); // Dispatch errors to Redux store
    return { ok: false, errors: errorData };
  }
};

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  try {
    const response = await csrfFetch("/api/session", {
      method: "POST",
      body: JSON.stringify({
        credential,
        password
      })
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    dispatch(setErrors(null)); // Clear errors on success
    return { success: true, data };
  } catch (error) {
    const errorData = error.data.errors || [error.data.message]; // Extract errors or message
    dispatch(setErrors(errorData)); // Dispatch errors to Redux store
    return { success: false, errors: errorData };
  }
};

export const restoreUser = () => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    if (response.ok) {
      dispatch(setUser(data.user));
      dispatch(setErrors(null)); // Clear any errors on successful restore
    }
  } catch (error) {
    console.log("Error restoring user session:", error);
    const errorData = error.data.errors || [error.data.message]; // Extract errors or message
    dispatch(setErrors(errorData)); // Dispatch errors to Redux store
  }
};

export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE'
  });
  dispatch(removeUser());
  return response;
};
const initialState = { user: null, errors: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload, errors: null };
    case REMOVE_USER:
      return { ...state, user: null, errors: null };
    case SET_ERRORS: // New case to handle errors
      return { ...state, errors: action.payload };
    default:
      return state;
  }
};

// Export setErrors so it can be used in other components
export { setErrors };

export default sessionReducer;
