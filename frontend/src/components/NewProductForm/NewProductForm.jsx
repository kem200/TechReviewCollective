import './NewProductForm.css';
import { createProduct } from '../../store/products';

function NewProductForm() {
    return (
        <div>
            <h2>New Product Form</h2>
            <form className='product-form'>
                <label>
                    Brand:
                    <input type="text" name="brand" />
                </label>
                <label>
                    Model Name:
                    <input type="text" name="name" />
                </label>
                <label>
                    Model Number:
                    <input type="text" name="model_number" />
                </label>
                <label>
                    Description:
                    <input type="text" name="description" />
                </label>
                <label>
                    Category:
                    <input type="text" name="category" />
                </label>
                <label>
                    Image URL:
                    <input type="text" name="images" />
                </label>
                <button type="submit">Add Product</button>
            </form>
        </div>
    )
}

export default NewProductForm;
