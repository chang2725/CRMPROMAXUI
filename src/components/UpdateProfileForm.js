import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateProfileForm = ({ customerId }) => {
  const [formData, setFormData] = useState({
    customer_id: customerId,
    name: '',
    phone_number: '',
    email: '',
    date_of_birth: '',
    gender: '',
    status: ''
  });
  
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Optional: Fetch existing details
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Customer/GetbyId/${customerId}`);
        setFormData(prev => ({
        ...prev,
        ...res.data.data,
        date_of_birth: res.data.data.date_of_birth?.split('T')[0]

      }));      
      } catch (err) {
        setMessage("Failed to load customer data.");
      }
    };
    fetchCustomer();
  }, [customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/Customer/updateCustomer/${customerId}`, formData);
      setMessage(res.data?.message || "Updated successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Update Customer Profile</h2>
      {message && <p className="mb-2 text-sm text-blue-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">Select Gender</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="Other">Other</option>
        </select>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfileForm;
