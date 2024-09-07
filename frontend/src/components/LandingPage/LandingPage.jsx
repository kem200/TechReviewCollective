import Products from '../Products/Products';
import './LandingPage.css'; 

const LandingPage = () => {
  return (
    <div className="landing-page">
      <h2>Real Reviews By The Tech Community</h2>
      <Products />
    </div>
  );
}

export default LandingPage;
