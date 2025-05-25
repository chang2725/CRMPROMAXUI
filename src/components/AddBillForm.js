// components/forms/AddBillForm.js
import React, { useState } from 'react';
import axios from 'axios';

const AddBillForm = ({ customerId }) => {
  const [formData, setFormData] = useState({
    dueAmount: '',
    loyaltyPoints: '',
    discountAmount: '',
    discountType: '',
    discountName: '',
    totalBillAmount: '',
    billFile: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'billFile') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();  
  const formDataToSend = new FormData();
formDataToSend.append('DueAmount', formData.dueAmount || 0);
formDataToSend.append('LoyaltyPoints', formData.loyaltyPoints || 0);
formDataToSend.append('DiscountAmount', formData.discountAmount || 0);
formDataToSend.append('DiscountType', formData.discountType?.trim() || '');
formDataToSend.append('DiscountName', formData.discountName?.trim() || '');
formDataToSend.append('TotalBillAmount', formData.totalBillAmount || 0);

if (formData.billFile) {
  formDataToSend.append('BillFile', formData.billFile);
}

try {
  const response = await axios.post(
    `${process.env.REACT_APP_API_BASE_URL}/Customer/addTransaction/${customerId}`,
    formDataToSend,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  alert('Transaction submitted successfully!');
  console.log(response.data);
  window.location.reload();
} catch (error) {
  console.error('❌ Error submitting transaction:', error);
  alert('Failed to submit transaction.');
}

};


  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 mx-auto bg-white rounded shadow">
      <div>
        <label>Total Bill Amount</label>
        <input type="number" name="totalBillAmount" value={formData.totalBillAmount} onChange={handleChange} className="w-full border px-2 py-1" />
      </div>
      <div>
        <label>Due Amount</label>
        <input type="number" name="dueAmount" value={formData.dueAmount} onChange={handleChange} required className="w-full border px-2 py-1" />
      </div>
      <div>
        <label>Loyalty Points</label>
        <input type="number" name="loyaltyPoints" value={formData.loyaltyPoints} onChange={handleChange} required className="w-full border px-2 py-1" />
      </div>
      <div>
        <label>Discount Amount</label>
        <input type="number" name="discountAmount" value={formData.discountAmount} onChange={handleChange} className="w-full border px-2 py-1" />
      </div>
      <div>
        <label>Discount Type</label>
        <input type="text" name="discountType" value={formData.discountType} onChange={handleChange} className="w-full border px-2 py-1" />
      </div>
      <div>
        <label>Discount Name</label>
        <input type="text" name="discountName" value={formData.discountName} onChange={handleChange} className="w-full border px-2 py-1" />
      </div>
      <div>
        <label>Upload Bill File</label>
        <input type="file" name="billFile" accept="image/*,.pdf" onChange={handleChange} className="w-full" />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
    </form>
  );
};

export default AddBillForm;
