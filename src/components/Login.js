import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const history = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    categories: []
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from the backend API
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/questions/question');
        console.log("res",response)
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleCategoryChange = (e) => {
    const { categories } = formData;
    const { value, checked } = e.target;

    if (checked) {
      setFormData((prevState) => ({
        ...prevState,
        categories: [...categories, value]
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        categories: categories.filter((category) => category !== value)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users', formData);
      console.log("response", response);
      const { _id } = response.data;
      history(`/quiz?userId=${_id}`); // Navigate to the Quiz page
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        {categories.map((category) => (
          <div key={category.id}>
            <input
              type="checkbox"
              id={category.id}
              name="categories"
              value={category.name}
              checked={formData.categories.includes(category.name)}
              onChange={handleCategoryChange}
              required
            />
            <label htmlFor={category.id}>{category.name}</label>
          </div>
        ))}

        <button type="submit">Start Quiz</button>
      </form>
    </div>
  );
}

export default Login;
