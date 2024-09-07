import './ProductPage.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProduct } from '../../store/products';
import { ClipLoader } from 'react-spinners';
import RatingModal from './RatingModal';
import { submitRating, resetRatingState } from '../../store/rating';

function ProductPage() {
    const { productId } = useParams();
    const product = useSelector((state) => state.products.singleProduct);
    const isLoading = useSelector((state) => state.products.isLoading);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchProduct(productId));
        dispatch(resetRatingState());
    }, [dispatch, productId]);

    const handleRateButtonClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        dispatch(fetchProduct(productId));
    };

    const handleSubmitRating = async (rating) => {
        try {
            const resultAction = await dispatch(submitRating({ productId, rating }));
            if (submitRating.fulfilled.match(resultAction)) {
                console.log(`Submitted rating: ${rating}`);
                setIsModalOpen(false);
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

    if (isLoading) {
        return <ClipLoader color="#ffffff" loading={isLoading} size={150} />;
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
                <p>15 Reviews</p>
                <button id='rate-button' onClick={handleRateButtonClick}>Rate</button>
                <button>Post Review</button>
            </div>
            <RatingModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitRating}
                productId={productId}
            />
        </div>
    );
}

export default ProductPage;
