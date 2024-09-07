import { createAsyncThunk } from '@reduxjs/toolkit';
import { csrfFetch } from './csrf';

const FETCH_USER_RATING = 'ratings/FETCH_USER_RATING';
const UPDATE_USER_RATING = 'ratings/UPDATE_USER_RATING';
const DELETE_USER_RATING = 'ratings/DELETE_USER_RATING';

const fetchUserRatingAction = (rating) => ({
    type: FETCH_USER_RATING,
    rating,
});

const updateUserRatingAction = (rating) => ({
    type: UPDATE_USER_RATING,
    rating,
});

const deleteUserRatingAction = (ratingId) => ({
    type: DELETE_USER_RATING,
    ratingId,
});

// Thunk to Submit a Rating
export const submitRating = createAsyncThunk(
    'ratings/submitRating',
    async ({ productId, rating }, { rejectWithValue }) => {
        try {
            const response = await csrfFetch('/api/ratings/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: productId, rating }),
            });

            if (response.ok) {
                const newRating = await response.json();
                return newRating;
            } else {
                const errorData = await response.json();
                return rejectWithValue(errorData);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);



// Thunk to Fetch User's Rating for a Product
export const fetchUserRating = (productId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/ratings?product_id=${productId}`);
        if (response.ok) {
            const rating = await response.json();
            dispatch(fetchUserRatingAction(rating));
        } else if (response.status === 404) {
            dispatch(fetchUserRatingAction(null)); // No rating found
        } else {
            const errorData = await response.json();
            console.error('Failed to fetch user rating:', errorData);
        }
    } catch (error) {
        console.error('Failed to fetch user rating:', error);
    }
};

// Thunk to Update a Rating
export const updateRating = ({ ratingId, rating }) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/ratings/${ratingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating }),
        });

        if (response.ok) {
            const updatedRating = await response.json();
            dispatch(updateUserRatingAction(updatedRating));
        } else {
            const errorData = await response.json();
            console.error('Failed to update rating:', errorData);
        }
    } catch (error) {
        console.error('Failed to update rating:', error);
    }
};

export const resetRatingState = () => ({
    type: 'ratings/resetRatingState',
});

// Thunk to Delete a Rating
export const deleteRating = createAsyncThunk(
    'ratings/deleteRating',
    async (ratingId, { dispatch, rejectWithValue }) => {
        try {
            const response = await csrfFetch(`/api/ratings/${ratingId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                dispatch(deleteUserRatingAction(ratingId));
                return ratingId;
            } else {
                const errorData = await response.json();
                return rejectWithValue(errorData);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Initial State
const initialState = {
    userRating: null,
    isLoading: false,
    error: null,
};

// Ratings Reducer
const ratingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER_RATING: {
            return {
                ...state,
                userRating: action.rating,
            };
        }
        case UPDATE_USER_RATING: {
            return {
                ...state,
                userRating: action.rating,
            };
        }
        case DELETE_USER_RATING: {
            return {
                ...state,
                userRating: null,
            };
        }
        case 'ratings/resetRatingState':
            return {
                ...state,
                userRating: null,
                isLoading: false,
                error: null,
            };
        default:
            return state;
    }
};

export default ratingsReducer;
