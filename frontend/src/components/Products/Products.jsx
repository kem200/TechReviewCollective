import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../store/products'; // Adjust import path as necessary
import './Products.css'; // Add CSS for styling

const categories = ['Smartphone', 'Laptop', 'Smartwatch', 'Tablet']; // Define categories

function Products() {
  const dispatch = useDispatch();
  const [page, setPage] = useState({}); // Pagination state for each category
  const limit = 10; // Number of products to fetch per category
  const navigate = useNavigate();

  const productsByCategory = useSelector((state) => state.products.productsByCategory);

  // Initialize page state for each category
  useEffect(() => {
    const initialPageState = {};
    categories.forEach((category) => {
      initialPageState[category] = 1;
    });
    setPage(initialPageState);
  }, []);

  // Fetch products for all categories
  useEffect(() => {
    categories.forEach((category) => {
      if (page[category] === 1) { // Only fetch on initial load
        dispatch(fetchProducts(category, page[category], limit)); // Fetch products for each category
      }
    });
  }, [dispatch, page, limit]);

  // Infinite scroll handler
  const handleScroll = (e, category) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    if (scrollLeft + clientWidth >= scrollWidth - 10) {
      const nextPage = page[category] + 1; // Calculate the next page

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

  return (
    <div className="products-container">
      {categories.map((category) => (
        <div key={category} className="category-row">
          <h2 className="category-title">{category}</h2>
          <div
            className="product-row"
            onScroll={(e) => handleScroll(e, category)}
          >
            {productsByCategory[category] &&
              Object.values(productsByCategory[category].products).map((product) => (
                <div key={product.id} className="product-tile" onClick={() => handleTileClick(product.id)}>
                  <div className="product-image-placeholder">
                    <img className='product-img' src={product.images[0]?.url || 'placeholder.jpg'} alt={product.name} />
                  </div>
                  {/* Product information */}
                  <div className='wrapper'>
                    <div className="product-info">
                      {/* <div className="product-brand">{product.brand}</div> */}
                      <div className="product-name">{product.name}</div>
                    </div>
                    <div className="rating-placeholder">{product?.averageRating || "0.0"}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Products;
