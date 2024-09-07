import './RatingModal.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserRating, submitRating, updateRating, deleteRating } from '../../store/rating';
import { FaTrash } from 'react-icons/fa';

function RatingModal({ isOpen, onClose, productId }) {
    const dispatch = useDispatch();
    const userRating = useSelector((state) => state.ratings.userRating);
    const [rating, setRating] = useState('');

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchUserRating(productId));
        }
    }, [dispatch, isOpen, productId]);

    useEffect(() => {
        if (userRating) {
            setRating(userRating.rating);
        } else {
            setRating(''); // Reset rating if no user rating
        }
    }, [userRating]);

    if (!isOpen) return null;

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (userRating) {
                await dispatch(updateRating({ ratingId: userRating.id, rating }));
            } else {
                await dispatch(submitRating({ productId, rating }));
            }
            onClose(); // Close the modal after successful submission
        } catch (error) {
            console.error('Failed to submit rating:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteRating(userRating.id));
            onClose(); // Close the modal after successful deletion
        } catch (error) {
            console.error('Failed to delete rating:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{userRating ? 'Update Your Rating' : 'Submit Your Rating'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Rating:
                        <input
                            type="number"
                            name="rating"
                            min="1"
                            max="10"
                            placeholder='1-10'
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            required
                        />
                    </label>
                    <div className="modal-buttons">
                        <button type="submit">{userRating ? 'Update' : 'Submit'}</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                        {userRating && (
                            <button type="button" onClick={handleDelete} id='RatingModal-delete-btn'>
                                <FaTrash id='RatingModal-Delete-icon'/>
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RatingModal;
