import React, { useState } from 'react';
import BarcodeScannerInput from '../components/BarcodeScannerInput';
import axios from 'axios';
import Navbar from '../Template/navbar';    
import CustomerHub from '../components/customerheader';

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
      <main className="pt-32 px-6 mx-auto">
       <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md max-w-[600px] ml-auto p-2">
  <div className="mb-4">
    <label className="block text-gray-700 mb-2">Loyalty Card ID</label>
    
    <div className="flex gap-2">
      <BarcodeScannerInput 
        value={barcodeValue}
        onChange={setBarcodeValue}
        placeholder="Scan product barcode"
        className="flex-1" // optional, for responsiveness
      />
      <button 
        type="submit"
        className="bg-green-600 text-white px-4 rounded hover:bg-green-700 h-[40px]"
      >
        Submit
      </button>
    </div>
  </div>
</form>

        <CustomerHub/>
      </main>
    </>
  );
}

export default Customer;