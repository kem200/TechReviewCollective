import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './SideMenu.css'; // Import CSS for the component

const SideMenu = ({ categories }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="side-menu">
      <h3 className="side-menu-title">Categories</h3>
      <input
        type="text"
        className="search-input"
        placeholder="Search categories..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ul className="category-list">
        {filteredCategories?.map((category) => (
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
