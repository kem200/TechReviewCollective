import { csrfFetch } from "./csrf";

const LOAD_PRODUCTS = 'products/LOAD_PRODUCTS';
const GET_PRODUCT = 'products/GET_PRODUCT';
const ADD_PRODUCT = 'products/ADD_PRODUCT';
const UPDATE_PRODUCT = 'products/UPDATE_PRODUCT';
const DELETE_PRODUCT = 'products/DELETE_PRODUCT';
const SEARCH_PRODUCTS = 'products/SEARCH_PRODUCTS';
const SET_PRODUCT_ERRORS = 'products/SET_PRODUCT_ERRORS';

// Action Creators
const loadProducts = (category, products, totalPages, currentPage) => ({
    type: LOAD_PRODUCTS,
    category,
    products,
    totalPages,
    currentPage,
});

const getProduct = (product) => ({
    type: GET_PRODUCT,
    product,
});

const addProduct = (category, product) => ({
    type: ADD_PRODUCT,
    category,
    product,
});

const updateProduct = (category, product) => ({
    type: UPDATE_PRODUCT,
    category,
    product,
});

const deleteProduct = (category, productId) => ({
    type: DELETE_PRODUCT,
    category,
    productId,
});

const searchProducts = (products) => ({
    type: SEARCH_PRODUCTS,
    products,
});

const setProductErrors = (errors) => ({
    type: SET_PRODUCT_ERRORS,
    payload: errors,
});

// Thunk to Fetch All Products with Pagination
export const fetchProducts = (category = '', page = 1, limit = 20) => async (dispatch) => {
    const queryString = new URLSearchParams({
        category,
        page,
        limit,
    }).toString();

    const response = await csrfFetch(`/api/products?${queryString}`);

    if (response.ok) {
        const data = await response.json();

        if (Array.isArray(data.products) && data.products.length > 0) {
            dispatch(loadProducts(category, data.products, data.totalPages, data.currentPage));
            return data.products;
        } else {
            console.warn(`No more products found for category: ${category}`);
            return [];
        }
    } else {
        console.error('Failed to fetch products:', response.status);
        return null;
    }
};

// Thunk to Search for Products
export const searchForProducts = (query) => async (dispatch) => {
    const response = await csrfFetch(`/api/products?search=${query}`);

    if (response.ok) {
        const data = await response.json();
        dispatch(searchProducts(data.products));
        return data.products;
    } else {
        console.error('Failed to search products:', response.status);
        return null;
    }
};

// Thunk to Fetch a Single Product
export const fetchProduct = (productId) => async (dispatch) => {
    const response = await csrfFetch(`/api/products/${productId}`);

    if (response.ok) {
        const product = await response.json();
        dispatch(getProduct(product));
    }
};

// Thunk to Add a New Product
export const createProduct = (productData) => async (dispatch) => {
    try {
        const response = await csrfFetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });

        if (response.ok) {
            const newProduct = await response.json();
            dispatch(addProduct(productData.category, newProduct));
            dispatch(setProductErrors(null));
            return newProduct;
        }
    } catch (error) {
        console.error('Error creating product:', error);
        const { data } = error;
        const errorData = data.errors || [data.error];
        dispatch(setProductErrors(errorData));
        throw error; 
    }
};

// Thunk to Update a Product
export const editProduct = (productId, productData) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });

        if (response.ok) {
            const updatedProduct = await response.json();
            dispatch(updateProduct(productData.category, updatedProduct));
            dispatch(setProductErrors(null)); // Clear errors on success
            return updatedProduct;
        }
    } catch (error) {
        console.error('Error updating product:', error);
        const { data } = error;
        const errorData = data.errors || [data.error];
        dispatch(setProductErrors(errorData));
        throw error;
    }
};

// Thunk to Delete a Product
export const removeProduct = (productId, category) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/products/${productId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            dispatch(deleteProduct(category, productId));
            dispatch(setProductErrors(null)); // Clear errors on success
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        const { data } = error;
        const errorData = data.errors || [data.error];
        dispatch(setProductErrors(errorData));
        throw error;
    }
};

const initialState = {
    productsByCategory: {},
    singleProduct: {},
    searchResults: [],
    errors: null, // New state for errors
};

// Products Reducer
const productsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_PRODUCTS: {
            const { category, products, totalPages, currentPage } = action;
            const newProducts = {};

            if (!Array.isArray(products)) {
                console.error('Products data is not an array:', products);
                return state;
            }

            products.forEach((product) => {
                newProducts[product.id] = product;
            });

            return {
                ...state,
                productsByCategory: {
                    ...state.productsByCategory,
                    [category]: {
                        products: newProducts,
                        totalPages,
                        currentPage,
                    },
                },
            };
        }

        case GET_PRODUCT: {
            return {
                ...state,
                singleProduct: action.product,
            };
        }

        case ADD_PRODUCT: {
            const { category, product } = action;
            if (!state.productsByCategory[category]) {
                state.productsByCategory[category] = {
                    products: {},
                    totalPages: 1,
                    currentPage: 1,
                };
            }

            return {
                ...state,
                productsByCategory: {
                    ...state.productsByCategory,
                    [category]: {
                        ...state.productsByCategory[category],
                        products: { ...state.productsByCategory[category].products, [product.id]: product },
                    },
                },
            };
        }

        case UPDATE_PRODUCT: {
            const { category, product } = action;

            return {
                ...state,
                productsByCategory: {
                    ...state.productsByCategory,
                    [category]: {
                        ...state.productsByCategory[category],
                        products: { ...state.productsByCategory[category].products, [product.id]: product },
                    },
                },
            };
        }

        case DELETE_PRODUCT: {
            const { category, productId } = action;

            if (!state.productsByCategory[category]) return state;

            const newProducts = { ...state.productsByCategory[category].products };
            delete newProducts[productId];

            return {
                ...state,
                productsByCategory: {
                    ...state.productsByCategory,
                    [category]: {
                        ...state.productsByCategory[category],
                        products: newProducts,
                    },
                },
            };
        }

        case SEARCH_PRODUCTS: {
            return {
                ...state,
                searchResults: action.products,
            };
        }

        case SET_PRODUCT_ERRORS: {
            return {
                ...state,
                errors: action.payload,
            };
        }

        default:
            return state;
    }
};

export default productsReducer;
export { setProductErrors };
