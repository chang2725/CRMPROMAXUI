import React, { useState } from 'react';
import BarcodeScannerInput from '../components/BarcodeScannerInput';
import axios from 'axios';
import Navbar from '../Template/navbar';    

function Customer() {
  const [barcodeValue, setBarcodeValue] = useState('');
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Customer/GetbyId/` + barcodeValue);

    alert(`Form submitted: ${response.data.message}`);
  } catch (error) {
    console.error('API error:', error);
    alert('Failed to submit the form');
  }
  };
  
  return (
    <>
    <Navbar></Navbar>
      {/* Main content with proper padding for fixed header */}
      <main className="pt-32 px-6 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Product Information</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Product Barcode</label>
            <BarcodeScannerInput 
              value={barcodeValue}
              onChange={setBarcodeValue}
              placeholder="Scan product barcode"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit
          </button>
        </form>
      </main>
    </>
  );
}

export default Customer;