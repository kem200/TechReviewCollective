import './ProductPage.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProduct } from '../../store/products';
import { fetchReviews } from '../../store/reviews';
import { ClipLoader } from 'react-spinners';
import RatingModal from './RatingModal';
import ReviewModal from './ReviewModal';
import { submitRating, resetRatingState } from '../../store/rating';

function ProductPage() {
    const { productId } = useParams();
    const product = useSelector((state) => state.products.singleProduct);
    const reviews = useSelector(state => state.reviews.reviewsByProduct[productId]?.reviews || {});
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedReviews, setExpandedReviews] = useState({});
    const [sortOrder, setSortOrder] = useState('recent');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await dispatch(fetchProduct(productId));
            await dispatch(fetchReviews(productId));
            dispatch(resetRatingState());
            setIsLoading(false);
        };

        fetchData();
    }, [dispatch, productId]);

    const handleRateButtonClick = () => {
        setIsRatingModalOpen(true);
    };

    const handleReviewButtonClick = () => {
        setIsReviewModalOpen(true);
    };

    const handleCloseRatingModal = () => {
        setIsRatingModalOpen(false);
        dispatch(fetchProduct(productId));
    };

    const handleCloseReviewModal = () => {
        setIsReviewModalOpen(false);
        dispatch(fetchProduct(productId));
        dispatch(fetchReviews(productId)); // Ensure reviews are re-fetched to get the latest data
    };

    const handleSubmitRating = async (rating) => {
        try {
            const resultAction = await dispatch(submitRating({ productId, rating }));
            if (submitRating.fulfilled.match(resultAction)) {
                console.log(`Submitted rating: ${rating}`);
                setIsRatingModalOpen(false);
                dispatch(fetchProduct(productId));
            } else {
                console.error('Failed to submit rating:', resultAction.payload || resultAction.error);
            }
        } catch (error) {
            console.error('Failed to submit rating:', error);
        }
    };

    const getRatingColor = (rating) => {
        const green = Math.min(200, Math.max(0, (rating / 10) * 255));
        const red = Math.min(255, Math.max(0, ((10 - rating) / 10) * 255));
        return `rgb(${red}, ${green}, 0)`;
    };

    const userHasReviewed = Object.values(reviews).some(review => review.userId === sessionUser?.id);

    const handleExpandClick = (reviewId) => {
        setExpandedReviews(prevState => ({
            ...prevState,
            [reviewId]: !prevState[reviewId]
        }));
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const sortedReviews = Object.values(reviews).sort((a, b) => {
        switch (sortOrder) {
            case 'highest':
                return b.rating - a.rating;
            case 'lowest':
                return a.rating - b.rating;
            case 'recent':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'oldest':
                return new Date(a.createdAt) - new Date(b.createdAt);
            default:
                return 0;
        }
    });

    if (isLoading) {
        return (
            <div className="spinner-container">
                <ClipLoader color="#blue" loading={isLoading} size={50} />
            </div>
        );
    }

    return (
        <div className='ProductPage-Main'>
            <div className='product-header'>
                <h1>{product.brand} {product.name}</h1>
                <div className='ProductPage-img'>
                    {product.images && product.images.length > 0 ? (
                        <img src={product.images[0].url} alt={product.name} />
                    ) : (
                        <p>No image available</p>
                    )}
                </div>
            </div>
            <div className='ProductPage-rating-header'>
                <h2>Community Rating: <span id='ProductPage-rating' style={{ color: getRatingColor(product.averageRating) }}>{product.averageRating?.toFixed(1)}</span></h2>
                <p>{Object.keys(reviews).length} Reviews</p>
                <button id='rate-button' onClick={handleRateButtonClick}>Rate</button>
                <button onClick={handleReviewButtonClick} disabled={userHasReviewed}>Post Review</button>
            </div>
            <div className='review-sort-menu'>
                <h3>Reviews + Ratings</h3>
                <div className='sort-container'>
                    <label htmlFor='sort-reviews'>Sort by: </label>
                    <select id='sort-reviews' value={sortOrder} onChange={handleSortChange}>
                        <option value='recent'>Recent to Oldest</option>
                        <option value='oldest'>Oldest to Recent</option>
                        <option value='highest'>Highest to Lowest</option>
                        <option value='lowest'>Lowest to Highest</option>
                    </select>
                </div>
            </div>
            {sortedReviews.map(review => (
                <div key={review?.id} className={`ReviewTile ${expandedReviews[review.id] ? 'expanded' : ''}`}>
                    <div className='wrapper'>
                        <div className='ReviewTile-header'>
                            <img src={'/profile.jpg'} alt="Profile" id='ProductPage-profile-img' />
                            <h4>{review.User?.display_name}</h4>
                        </div>
                        <div className='ReviewTile-content'>
                            <p id='review-content'>{review.content}</p>
                            {review.content.length > 100 && (
                                <button className='expand-button' onClick={() => handleExpandClick(review.id)}>
                                    {expandedReviews[review.id] ? 'Show Less' : 'Show More'}
                                </button>
                            )}
                        </div>
                        <div className='review-rating' style={{ color: getRatingColor(review.rating) }}>
                            {review.rating?.toFixed(1)}
                        </div>
                    </div>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
            ))}
            <RatingModal
                isOpen={isRatingModalOpen}
                onClose={handleCloseRatingModal}
                onSubmit={handleSubmitRating}
                productId={productId}
            />
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={handleCloseReviewModal}
                productId={productId}
            />
        </div>
    );
}

export default ProductPage;
