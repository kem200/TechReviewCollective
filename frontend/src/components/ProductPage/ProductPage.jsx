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
                <h1>{product.name}</h1>
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
            <h3>Reviews + Ratings</h3>
            {Object.values(reviews).map(review => (
                <div key={review?.id} className='ReviewTile'>
                    <div className='ReviewTile-header'>
                        <img src="" alt="Profile" id='ProductPage-profile-img'/>
                        <h4>{review.User?.display_name}</h4>
                    </div>
                    <div className='ReviewTile-content'>
                        <p>{review.content}</p>
                    </div>
                    <div className='review-rating'>{review.rating}</div>
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
