import { csrfFetch } from "./csrf";

// Action Types
const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
const GET_REVIEW = 'reviews/GET_REVIEW';
const ADD_REVIEW = 'reviews/ADD_REVIEW';
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';
const LOAD_USER_REVIEWS = 'reviews/LOAD_USER_REVIEWS';

// Action Creators
const loadReviews = (productId, reviews, totalPages, currentPage) => ({
    type: LOAD_REVIEWS,
    productId,
    reviews,
    totalPages,
    currentPage,
});

const addReview = (productId, review) => ({
    type: ADD_REVIEW,
    productId,
    review,
});

const updateReview = (productId, review) => ({
    type: UPDATE_REVIEW,
    productId,
    review,
});

const deleteReview = (productId, reviewId) => ({
    type: DELETE_REVIEW,
    productId,
    reviewId,
});

const loadUserReviews = (userId, reviews) => ({
    type: LOAD_USER_REVIEWS,
    userId,
    reviews,
});

// Thunk to Fetch All Reviews for a Product with Pagination
export const fetchReviews = (productId, page = 1, limit = 20) => async (dispatch) => {
    const queryString = new URLSearchParams({
        page,
        limit,
    }).toString();

    const response = await csrfFetch(`/api/reviews/product/${productId}?${queryString}`);

    if (response.ok) {
        const data = await response.json();
        dispatch(loadReviews(productId, data.reviews, data.totalPages, data.currentPage));
        return data.reviews;
    } else {
        console.error('Failed to fetch reviews:', response.status);
        return null;
    }
};

// Thunk to Fetch All Reviews from a User
export const fetchUserReviews = (userId, productId = null) => async (dispatch) => {
    let url = `/api/reviews/user/${userId}`; // Base URL

    // Add productId to the URL if it's provided
    if (productId) {
      url += `?productId=${productId}`;
    }

    const response = await csrfFetch(url); // Use the constructed URL

    if (response.ok) {
      const data = await response.json();
      dispatch(loadUserReviews(userId, data)); // Dispatch the action to load reviews
      return data;
    } else {
      console.error('Failed to fetch user reviews:', response.status);
      return null;
    }
  };

// Thunk to Create a Review
export const createReview = (reviewData) => async (dispatch) => {
    console.log(reviewData)
    const response = await csrfFetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
    });

    if (response.ok) {
        const newReview = await response.json();
        dispatch(addReview(reviewData.product_id, newReview));
    } else {
        console.error('Failed to create review:', response.status);
    }
};

// Thunk to Update a Review
export const editReview = (reviewId, reviewData) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
    });

    if (response.ok) {
        const updatedReview = await response.json();
        dispatch(updateReview(reviewData.product_id, updatedReview));
    } else {
        console.error('Failed to update review:', response.status);
    }
};

// Thunk to Delete a Review
export const removeReview = (reviewId, productId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        dispatch(deleteReview(productId, reviewId));
    } else {
        console.error('Failed to delete review:', response.status);
    }
};

const initialState = {
    reviewsByProduct: {},
    userReviews: {},
};

// Reviews Reducer
const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_REVIEWS: {
            const { productId, reviews, totalPages, currentPage } = action;
            const newReviews = {};

            reviews.forEach((review) => {
                newReviews[review.id] = review;
            });

            return {
                ...state,
                reviewsByProduct: {
                    ...state.reviewsByProduct,
                    [productId]: {
                        reviews: newReviews,
                        totalPages,
                        currentPage,
                    },
                },
            };
        }

        case GET_REVIEW: {
            const { review } = action;
            return {
                ...state,
                singleReview: review,
            };
        }

        case ADD_REVIEW: {
            const { productId, review } = action;

            if (!state.reviewsByProduct[productId]) {
                state.reviewsByProduct[productId] = {
                    reviews: {},
                    totalPages: 1,
                    currentPage: 1,
                };
            }

            return {
                ...state,
                reviewsByProduct: {
                    ...state.reviewsByProduct,
                    [productId]: {
                        ...state.reviewsByProduct[productId],
                        reviews: { ...state.reviewsByProduct[productId].reviews, [review.id]: review },
                    },
                },
            };
        }

        case UPDATE_REVIEW: {
            const { productId, review } = action;

            if (!state.reviewsByProduct[productId]) {
                state.reviewsByProduct[productId] = {
                    reviews: {},
                    totalPages: 1,
                    currentPage: 1,
                };
            }

            return {
                ...state,
                reviewsByProduct: {
                    ...state.reviewsByProduct,
                    [productId]: {
                        ...state.reviewsByProduct[productId],
                        reviews: { ...state.reviewsByProduct[productId].reviews, [review.id]: review },
                    },
                },
            };
        }

        case DELETE_REVIEW: {
            const { productId, reviewId } = action;

            if (!state.reviewsByProduct[productId]) return state;

            const newReviews = { ...state.reviewsByProduct[productId].reviews };
            delete newReviews[reviewId];

            return {
                ...state,
                reviewsByProduct: {
                    ...state.reviewsByProduct,
                    [productId]: {
                        ...state.reviewsByProduct[productId],
                        reviews: newReviews,
                    },
                },
            };
        }

        case LOAD_USER_REVIEWS: {
            const { userId, reviews } = action;
            const newReviews = {};

            reviews.forEach((review) => {
                newReviews[review.id] = review;
            });

            return {
                ...state,
                userReviews: {
                    ...state.userReviews,
                    [userId]: newReviews,
                },
            };
        }

        default:
            return state;
    }
};

export default reviewsReducer;
