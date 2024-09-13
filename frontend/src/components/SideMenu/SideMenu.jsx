import { NavLink } from 'react-router-dom';
import './SideMenu.css'; // Import CSS for the component

const SideMenu = ({ categories }) => {
    console.log('Categories:', categories);
  return (
    <div className="side-menu">
      <h3 className="side-menu-title">Categories</h3>
      <ul className="category-list">
        {categories?.map((category) => (
          <li key={category.id} className="category-item">
            <NavLink
              to={`/category/${encodeURIComponent(category.name)}`} // Encode URI to handle special characters
              className={({ isActive }) => `category-link ${isActive ? 'active' : ''}`}
            >
              {category.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideMenu;
