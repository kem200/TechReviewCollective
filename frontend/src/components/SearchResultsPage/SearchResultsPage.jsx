import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchForProducts } from '../../store/products';
import ClipLoader from 'react-spinners/ClipLoader';
import './SearchResultsPage.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResultsPage = () => {
  const query = useQuery();
  const searchQuery = query.get('query');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const results = useSelector(state => state.products.searchResults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchQuery) {
      dispatch(searchForProducts(searchQuery)).finally(() => {
        setLoading(false);
      });
    }
  }, [searchQuery, dispatch]);

  const handleTileClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="search-results-page">
      <div className="search-results">
        <h2>Search Results for &apos;{searchQuery}&apos;</h2>
        {loading ? (
          <div className="spinner-container">
            <ClipLoader size={50} color={"#123abc"} loading={loading} />
          </div>
        ) : results.length === 0 ? (
          <div className="no-results">
            <p>No results found</p>
          </div>
        ) : (
          <div className="results-grid">
            {results.map(product => (
              <div
                key={product.id}
                className="search-product-tile"
                onClick={() => handleTileClick(product.id)}
              >
                <img className="search-product-img" src={product.images[0]?.url} alt={product.name} />
                <div className="search-product-info">
                  <h3 className="search-product-name">{product.name}</h3>
                  <p className="search-product-description">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  };

  export default SearchResultsPage;
