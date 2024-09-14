import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, setProductErrors } from '../../store/products';
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
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // State to manage success popup
  const [filteredCategories, setFilteredCategories] = useState([]);

  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories); // Get categories from state
  const errors = useSelector((state) => state.products.errors); // Get errors from Redux store
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCategories()); // Fetch categories when component mounts
  }, [dispatch]);

  useEffect(() => {
    if (category) {
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
    setCategoryId(selectedCategory ? selectedCategory.id : null);
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
      const createdProduct = await dispatch(createProduct(newProduct)); // Await for the created product
      setIsLoading(false);
      if (createdProduct && createdProduct.id) { // Check if createdProduct and its ID exist
        setShowSuccess(true); // Show success popup
        setTimeout(() => {
          setShowSuccess(false);
          navigate(`/products/${createdProduct.id}`); // Navigate to new product after showing success
        }, 3000); // 3 seconds delay
      } else {
        throw new Error('Failed to retrieve the new product ID.');
      }
    } catch (error) {
      console.error('Failed to add product:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className='ProductForm-Main'>
      <h2>New Product Form</h2>

      <p className="form-intro" style={{ color: "#333" }}>
        Can&apos;t find the product you&apos;re looking for? Before adding a new product, please use the search function to ensure it isn&apos;t already in our database. If it&apos;s not, help the community by adding it!
      </p>

      <form className='new-product-form' onSubmit={handleSubmit}>
        {errors && ( // Display errors from Redux store
          <div className="error-messages">
            {Object.values(errors).map((error, idx) => (
              <p key={idx} className="error-text">{error}</p>
            ))}
          </div>
        )}

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
            required
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

      {showSuccess && ( // Success Popup
        <div className="popup">
          <div className="popup-content">
            <h2>Product added successfully!</h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewProductForm;
