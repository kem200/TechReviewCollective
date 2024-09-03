import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav>
      <ul className="nav-left">
        <li>
          TechReviewCollective
        </li>
      </ul>
      <div className='Nav-Right'>
        Login
      </div>
    </nav>
  );
}

export default Navigation;
