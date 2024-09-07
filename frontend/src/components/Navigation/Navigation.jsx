import './Navigation.css';
import { logout } from '../../store/session';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Navigation() {
  const sessionUser = useSelector(state => state.session.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate('/login');
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
  }

  return (
    <nav>
      <img id='logo' src="/logo1.png" alt="TechReviewCollective" onClick={handleHomeClick}/>
      <div className='Nav-Right'>
        {sessionUser ? (
          <>
            <div className="dropdown">
              <button onClick={handlePostProductClick} id='post-product-button'>Post Product</button>
              <button className="dropbtn">{sessionUser.username}</button>
              <div className="dropdown-content">
                <a href="#" onClick={handleLogoutClick}>Logout</a>
              </div>
            </div>
          </>
        ) : (
          <button onClick={handleLoginClick} id='login-button'>Login</button>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
