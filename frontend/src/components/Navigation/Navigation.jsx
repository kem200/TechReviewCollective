import './Navigation.css';
import { logout } from '../../store/session';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

function Navigation() {
  const sessionUser = useSelector(state => state.session.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate('/');
  };

  const handlePostProductClick = (e) => {
    e.preventDefault();
    navigate('/new-product');
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    navigate('/profile');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav>
      <img id='logo' src="/logo1.png" alt="TechReviewCollective" onClick={handleHomeClick}/>
      <form className="search-form" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      <div className='Nav-Right'>
        {sessionUser ? (
          <>
            <button onClick={handlePostProductClick} id='post-product-button'>Post Product</button>
            <div className="dropdown">
              <FaUserCircle className="user-icon" onClick={toggleDropdown} />
              {dropdownOpen && (
                <div className="dropdown-content">
                  <a href="#" onClick={handleProfileClick}>Profile</a>
                  <a href="#" onClick={handleLogoutClick}>Logout</a>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="dropdown">
            <FaUserCircle className="user-icon" onClick={toggleDropdown} />
            {dropdownOpen && (
              <div className="dropdown-content">
                <a href="#" onClick={handleLoginClick}>Login</a>
                <a href="#" onClick={handleSignupClick}>Signup</a>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
