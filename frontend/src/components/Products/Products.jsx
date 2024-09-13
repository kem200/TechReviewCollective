import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../store/products';
import './Products.css';

const categories = ['Smartphones', 'Laptops', 'Smartwatches', 'Tablets'];

function Products() {
  const dispatch = useDispatch();
  const [page, setPage] = useState({});
  const limit = 10;
  const navigate = useNavigate();

  const productsByCategory = useSelector((state) => state.products.productsByCategory);

  useEffect(() => {
    const initialPageState = {};
    categories.forEach((category) => {
      initialPageState[category] = 1;
    });
    setPage(initialPageState);
  }, []);

  useEffect(() => {
    categories.forEach((category) => {
      if (page[category] === 1) {
        dispatch(fetchProducts(category, page[category], limit));
      }
    });
  }, [dispatch, page, limit]);

  // Infinite scroll handler
  const handleScroll = (e, category) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    if (scrollLeft + clientWidth >= scrollWidth - 10) {
      const nextPage = page[category] + 1;

      // Fetch more products when reaching the end of the scroll
      dispatch(fetchProducts(category, nextPage, limit)).then((fetchedProducts) => {
        // If new products are returned, update the page number
        if (fetchedProducts && fetchedProducts.length > 0) {
          setPage((prevPages) => ({
            ...prevPages,
            [category]: nextPage,
          }));
        }
      });
    }
  };

  const handleTileClick = (productId) => {
    navigate(`/products/${productId}`);
  }

  const getRatingColor = (rating) => {
    const green = Math.min(200, Math.max(0, (rating / 10) * 255));
    const red = Math.min(255, Math.max(0, ((10 - rating) / 10) * 255));
    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <div className="products-container">
      <div className='products'>
        {categories.map((category) => (
          <div key={category} className="category-row">
            <h2 className="category-title">{category}</h2>
            <div
              className="product-row"
              onScroll={(e) => handleScroll(e, category)}
            >
              {productsByCategory[category] &&
                Object.values(productsByCategory[category].products)
                  .sort((a, b) => b.averageRating - a.averageRating)
                  .map((product) => (
                    <div key={product.id} className="product-tile" onClick={() => handleTileClick(product.id)}>
                      <div className="product-image-placeholder">
                        <img className='product-img' src={product.images[0]?.url || 'placeholder.jpg'} alt={product.name} />
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
