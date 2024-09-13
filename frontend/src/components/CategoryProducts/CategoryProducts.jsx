import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProducts } from '../../store/products';
import ClipLoader from 'react-spinners/ClipLoader';

function CategoryProducts() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categoryName } = useParams();
    const [page, setPage] = useState(1); // Start at page 1
    const limit = 20;
    const [isLoading, setIsLoading] = useState(true);

    // Use the selector to get products for the given category
    const productsByCategory = useSelector((state) => state.products.productsByCategory[categoryName]?.products || {});

    useEffect(() => {
        if (categoryName) {
            setIsLoading(true);
            dispatch(fetchProducts(categoryName, page, limit)).then(() => setIsLoading(false)); // Set loading to false after fetching
        }
    }, [dispatch, categoryName, page]);

    const handleTileClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    const getRatingColor = (rating) => {
        const green = Math.min(200, Math.max(0, (rating / 10) * 255));
        const red = Math.min(255, Math.max(0, ((10 - rating) / 10) * 255));
        return `rgb(${red}, ${green}, 0)`;
    };

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1); // Increment the page to load more products
    };

    // Render the spinner while loading
    if (isLoading && page === 1) { // Show spinner only if loading the first page
        return (
            <div className="spinner-container">
                <ClipLoader color="black" size={50} />
            </div>
        );
    }

    return (
        <div className="products-container">
            <h2 className="category-title">
                {categoryName
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ')}
            </h2>

            <div className="product-row">
                {Object.values(productsByCategory)
                    .sort((a, b) => b.averageRating - a.averageRating)
                    .map((product) => (
                        <div
                            key={product.id}
                            className="product-tile"
                            onClick={() => handleTileClick(product.id)}
                        >
                            <div className="product-image-placeholder">
                                <img
                                    className='product-img'
                                    src={product.images[0]?.url || 'placeholder.jpg'}
                                    alt={product.name}
                                />
                            </div>
                            <div className='wrapper'>
                                <div className="product-info">
                                    <div className="product-name">{product.name}</div>
                                </div>
                                <div className="rating-placeholder" style={{ color: getRatingColor(product.averageRating) }}>
                                    {product?.averageRating?.toFixed(1)}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Load More Button */}
            <div className="load-more-container">
                <button className="load-more-button" onClick={handleLoadMore} disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Load More'}
                </button>
            </div>
        </div>
    );
}

export default CategoryProducts;
