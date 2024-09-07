import React from 'react';
import Products from '../Products/Products'; // Import the Product component
import './LandingPage.css'; // Add CSS for styling if needed

const LandingPage = () => {
  return (
    <div className="landing-page">
      <h2>Real Reviews By The Tech Community</h2>
      <Products />
    </div>
  );
}

export default LandingPage;
