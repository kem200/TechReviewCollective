import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Navigation.css';

function Navigation() {
  const sessionUser = useSelector(state => state.session.user);
  const navigate = useNavigate()

  const handleClick = (e) => {
    e.preventDefault();
    console.log('Login button clicked');
    navigate('/login')
  }

  return (
    <nav>
      <ul className="nav-left">
        <li>
          TechReviewCollective
        </li>
      </ul>
      <div className='Nav-Right'>
        <button onClick={(e) => handleClick(e)}>Login</button>
      </div>
    </nav>
  );
}

export default Navigation;
