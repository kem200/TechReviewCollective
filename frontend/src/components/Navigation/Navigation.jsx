import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './Navigation.css';
import { logout } from '../../store/session'; // Import the logout action

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

  return (
    <nav>
      <ul className="nav-left">
        <li>
          TechReviewCollective
        </li>
      </ul>
      <div className='Nav-Right'>
        {sessionUser ? (
          <>
            <div className="dropdown">
              <button className="dropbtn">{sessionUser.username}</button>
              <div className="dropdown-content">
                <a href="#" onClick={handleLogoutClick}>Logout</a>
              </div>
            </div>
            <button onClick={handlePostProductClick}>Post Product</button>
          </>
        ) : (
          <button onClick={handleLoginClick}>Login</button>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
