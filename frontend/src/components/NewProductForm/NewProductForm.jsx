import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProduct } from '../../store/products';
import './NewProductForm.css';

function NewProductForm() {
    const [brand, setBrand] = useState('');
    const [name, setName] = useState('');
    const [modelNumber, setModelNumber] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [images, setImages] = useState('');

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newProduct = {
            brand,
            name,
            model_number: modelNumber,
            description,
            category,
            images: [images] // Assuming images is a single URL string
        };
        await dispatch(createProduct(newProduct));
    };

    return (
        <div>
            <h2>New Product Form</h2>
            <form className='product-form' onSubmit={handleSubmit}>
                <label>
                    Brand:
                    <input type="text" name="brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
                </label>
                <label>
                    Model Name:
                    <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                    Model Number:
                    <input type="text" name="model_number" value={modelNumber} onChange={(e) => setModelNumber(e.target.value)} />
                </label>
                <label>
                    Description:
                    <input type="text" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </label>
                <label>
                    Category:
                    <input type="text" name="category" value={category} onChange={(e) => setCategory(e.target.value)} />
                </label>
                <label>
                    Image URL:
                    <input type="text" name="images" value={images} onChange={(e) => setImages(e.target.value)} />
                </label>
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
}

export default NewProductForm;
