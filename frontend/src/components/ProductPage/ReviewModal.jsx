import './ReviewModal.css';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReview, editReview, removeReview, fetchUserReviews, fetchReviews } from '../../store/reviews';

function ReviewModal({ isOpen, onClose, productId }) {
    const dispatch = useDispatch();
    const [content, setContent] = useState('');
    const [rating, setRating] = useState('');
    const [userReview, setUserReview] = useState(null);
    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        const fetchReviews = async () => {
            const reviews = await dispatch(fetchUserReviews(sessionUser.id, productId));
            const reviewForProduct = reviews?.[0]; // Since we are fetching reviews for a specific product, we expect only one review
            setUserReview(reviewForProduct);
            if (reviewForProduct) {
                setContent(reviewForProduct.content);
                setRating(reviewForProduct.rating);
            } else {
                setContent('');
                setRating('');
            }
        };

        if (isOpen) {
            fetchReviews();
        }
    }, [dispatch, sessionUser.id, productId, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (userReview) {
                await dispatch(editReview(userReview.id, { product_id: productId, content, rating }));
            } else {
                await dispatch(createReview({ product_id: productId, content, rating }));
            }
            onClose();
            dispatch(fetchReviews(productId)); // Ensure reviews are re-fetched to get the latest data
        } catch (error) {
            console.error('Failed to submit review:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(removeReview(userReview.id, productId));
            onClose();
            dispatch(fetchReviews(productId)); // Ensure reviews are re-fetched to get the latest data
        } catch (error) {
            console.error('Failed to delete review:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{userReview ? 'Update Your Review' : 'Submit Your Review'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Review:
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Rating: <span style={{ fontStyle: 'italic' }}>Optional</span>
                        <input
                            type="number"
                            name="rating"
                            min="1"
                            max="10"
                            placeholder='1-10'
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                        />
                    </label>
                    <div className="modal-buttons">
                        <button type="submit">{userReview ? 'Update' : 'Submit'}</button>
                        {userReview && <button type="button" onClick={handleDelete}>Delete</button>}
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ReviewModal;