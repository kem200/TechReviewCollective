import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Products from './components/Products';
import ProductPage from './components/ProductPage';
import NewProductForm from './components/NewProductForm';
import ProfilePage from './components/ProfilePage';
import SearchResultsPage from './components/SearchResultsPage';
import CategoryProducts from './components/CategoryProducts';
import * as sessionActions from './store/session';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
      console.log('User restored, isLoaded set to true');
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded ? <Outlet /> : <p>Loading...</p>}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/signup',
        element: <SignupPage />
      },
      {
        path: '/products',
        element: <Products />,
      },
      {
        path: '/products/:productId',
        element: <ProductPage />,
      },
      {
        path: '/new-product',
        element: <NewProductForm />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/search', // Add the route for the SearchResultsPage
        element: <SearchResultsPage />,
      },
      {
        path: '/category/:categoryName',
        element: <CategoryProducts />,
      },
      {
        path: '*',
        element: <h1>Not Found 404</h1>
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
