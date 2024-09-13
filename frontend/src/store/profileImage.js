import { csrfFetch } from './csrf';

// Action types
const UPLOAD_START = 'profile/UPLOAD_START';
const UPLOAD_SUCCESS = 'profile/UPLOAD_SUCCESS';
const UPLOAD_FAILURE = 'profile/UPLOAD_FAILURE';

// Action creators
const uploadStart = () => ({ type: UPLOAD_START });
const uploadSuccess = (imageUrl) => ({ type: UPLOAD_SUCCESS, imageUrl });
const uploadFailure = (error) => ({ type: UPLOAD_FAILURE, error });

// Thunk action to upload a profile image
export const uploadProfileImage = (file) => async (dispatch) => {
  dispatch(uploadStart());
  const formData = new FormData();
  formData.append('profileImage', file);

  console.log('FormData file:', file); // Debugging line

  try {
    const response = await csrfFetch('/api/profile/upload-profile', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const { imageUrl } = await response.json();
      dispatch(uploadSuccess(imageUrl));
    } else {
      const errorData = await response.json();
      dispatch(uploadFailure(errorData.error));
    }
  } catch (err) {
    dispatch(uploadFailure('Failed to upload image'));
  }
};

// Reducer
const initialState = {
  imageUrl: null,
  isLoading: false,
  error: null,
};

export default function profileImageReducer(state = initialState, action) {
  switch (action.type) {
    case UPLOAD_START:
      return { ...state, isLoading: true, error: null };
    case UPLOAD_SUCCESS:
      return { ...state, isLoading: false, imageUrl: action.imageUrl };
    case UPLOAD_FAILURE:
      return { ...state, isLoading: false, error: action.error };
    default:
      return state;
  }
}