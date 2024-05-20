import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export function AddProduct() {
  const [formData, setFormData] = React.useState({
    name: '',
    price: '',
    description: '',
    image: ''
  });

  const handleInputChange = (event: any) => {
    const { id, value } = event.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  //TODO 
  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <div>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          id="name"
          onChange={handleInputChange}
          value={formData.name}
          required
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          id="description"
          onChange={handleInputChange}
          value={formData.description}
          required
        />
        <TextField
          label="Price"
          variant="outlined"
          fullWidth
          margin="normal"
          id="price"
          onChange={handleInputChange}
          value={formData.price}
          required
        />
        <TextField
          label="Image URL"
          variant="outlined"
          fullWidth
          margin="normal"
          id="image"
          onChange={handleInputChange}
          value={formData.image}
          required
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
