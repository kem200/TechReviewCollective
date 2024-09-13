import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../store/products';
import { fetchCategories } from '../../store/categories';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import './NewProductForm.css';

function NewProductForm() {
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [category, setCategory] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [images, setImages] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories); // Get categories from state
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCategories()); // Fetch categories when component mounts
  }, [dispatch]);

  useEffect(() => {
    if (category) {
      // Filter categories based on user input
      setFilteredCategories(
        categories.filter((cat) =>
          cat.name.toLowerCase().includes(category.toLowerCase())
        )
      );
    } else {
      setFilteredCategories(categories);
    }
  }, [category, categories]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);

    const selectedCategory = categories.find((cat) => cat.name === value);
    if (selectedCategory) {
      setCategoryId(selectedCategory.id);
    } else {
      setCategoryId(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!categoryId) {
      alert('Please select a valid category from the dropdown.');
      return;
    }

    setShowConfirmation(true);
  };

  const confirmSubmission = async () => {
    setShowConfirmation(false);
    setIsLoading(true);

    const newProduct = {
      brand,
      name,
      model_number: modelNumber,
      category: categoryId,
      images: [images],
    };

    try {
      const response = await dispatch(createProduct(newProduct));
      if (response) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate(`/products/${response.id}`);
        }, 3000);
      }
    } catch (error) {
      setShowFailure(true);
      setTimeout(() => setShowFailure(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='ProductForm-Main'>
      <h2>New Product Form</h2>

      <p className="form-intro" style={{ color: "#333" }}>
        Can&apos;t find the product you&apos;re looking for?
        Before adding a new product, please use the search function to ensure it isn&apos;t already in our database.
        If it&apos;s not, help the community by adding it!
        By sharing accurate information about new tech products, you make it easier for others to find and review them.
        Please make sure all details are correct to maintain the quality and reliability of our platform.
      </p>

      <form className='new-product-form' onSubmit={handleSubmit}>
        <label>
          Brand:
          <input
            type="text"
            name="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Enter the brand of the product (e.g., Apple, Samsung)"
            required
          />
        </label>

        <label>
          Model Name:
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter the model name (e.g., iPhone 14 Pro, Galaxy S23 Ultra)"
            required
          />
        </label>

        <label>
          Model Number:
          <input
            type="text"
            name="model_number"
            value={modelNumber}
            onChange={(e) => setModelNumber(e.target.value)}
            placeholder="Enter the model number (e.g., MQ9R3LL/A)"
            required
          />
          <span>
            Note: The model number is usually found on the product box or the device itself.
            If you can&apos;t find the model number, use the product name instead.
          </span>
        </label>

        <label>
          Category:
          <input
            type="text"
            name="category"
            value={category}
            onChange={handleCategoryChange}
            list="category-options"
            placeholder="Select or type a category"
            required
          />
          <datalist id="category-options">
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.name} />
            ))}
          </datalist>
        </label>

        <label>
          Image URL:
          <input
            type="text"
            name="images"
            value={images}
            onChange={(e) => setImages(e.target.value)}
            placeholder="Enter a valid image URL preferably directly from the manufacturer"
          />
        </label>

        <button type="submit">Add Product</button>
      </form>

      {showConfirmation && (
        <div className="popup">
          <div className="popup-content">
            <h2>Confirm Submission</h2>
            <p>Brand: {brand}</p>
            <p>Model Name: {name}</p>
            <p>Model Number: {modelNumber}</p>
            <p>Category: {category}</p>
            <p>Image URL: {images}</p>
            <button className="primary-button" onClick={confirmSubmission}>Confirm</button>
            <button className="secondary-button" onClick={() => setShowConfirmation(false)}>Cancel</button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="popup">
          <div className="popup-content">
            <ClipLoader size={50} color={"#4CAF50"} />
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="popup">
          <div className="popup-content">
            <h2>Product added successfully!</h2>
          </div>
        </div>
      )}

      {showFailure && (
        <div className="popup">
          <div className="popup-content">
            <h2>Failed to add product. Please try again.</h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewProductForm;
