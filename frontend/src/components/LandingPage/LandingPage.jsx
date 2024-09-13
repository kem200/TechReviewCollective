import Products from '../Products/Products';
import SideMenu from '../SideMenu/SideMenu';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../store/categories.js';

import './LandingPage.css';

const LandingPage = () => {
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="landing-page">
      <div className='wrapper'>
      <SideMenu categories={categories}/>
      <Products />
      </div>
    </div>
  );
}

export default LandingPage;
