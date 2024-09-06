import './ProductPage.css';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProduct } from '../../store/products';
import { ClipLoader } from 'react-spinners';

function ProductPage() {
    const { productId } = useParams();
    const product = useSelector((state) => state.products.singleProduct);
    const isLoading = useSelector((state) => state.products.isLoading);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProduct(productId));
    }, [dispatch, productId]);

    const spinnerStyle = {
        display: 'block',
        margin: '0 auto',
        borderColor: 'red'
    };

    if (isLoading) {
        return <ClipLoader color="#ffffff" loading={isLoading} cssOverride={spinnerStyle} size={150} />;
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
                <h2>Community Rating: 7.2</h2>
                <p>15 Reviews</p>
                <button>Post Review</button>
            </div>
        </div>
    );
}

export default ProductPage;
