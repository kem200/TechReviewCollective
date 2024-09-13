import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../store/products';
import { fetchCategories } from '../../store/categories';
import './NewProductForm.css';

function NewProductForm() {
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [category, setCategory] = useState(''); // Category name input field
  const [categoryId, setCategoryId] = useState(null); // Category ID to send to backend
  const [images, setImages] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories); // Get categories from state

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

    // Find the matching category in the filtered list
    const selectedCategory = categories.find((cat) => cat.name === value);
    if (selectedCategory) {
      setCategoryId(selectedCategory.id); // Set the category ID
    } else {
      setCategoryId(null); // Reset if no matching category is found
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if a valid category ID is selected
    if (!categoryId) {
      alert('Please select a valid category from the dropdown.');
      return;
    }

    const newProduct = {
      brand,
      name,
      model_number: modelNumber,
      category: categoryId, // Send category ID
      images: [images], // Assuming images is a single URL string
    };

    const response = await dispatch(createProduct(newProduct));
    if (response) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
    }
  };

  return (
<div className='ProductForm-Main'>
  <h2>New Product Form</h2>

  <p className="form-intro" style={{color: "#333"}}>
    Can&apos;t find the product you&apos;re looking for? Help the community by adding it to our database!
    By sharing accurate information about new tech products, you make it easier for others to find
    and review them. Please make sure all details are correct to maintain the quality and reliability
    of our platform.
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
    </label>

    <label>
      Category:
      <input
        type="text"
        name="category"
        value={category}
        onChange={handleCategoryChange} // Use new handler
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

  {showSuccess && <div className="success-popup">Product added successfully!</div>}
</div>
  );
}

export default NewProductForm;
