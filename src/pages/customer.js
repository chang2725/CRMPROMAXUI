import React, { useState, useEffect } from 'react';
import BarcodeScannerInput from '../components/BarcodeScannerInput';
import axios from 'axios';
import Navbar from '../Template/navbar';
import CustomerHub from '../components/customerheader';
import CustomerCard from '../Template/CustomerCard';

function Customer() {
  const [barcodeValue, setBarcodeValue] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customers, setCustomers] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);


  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Customer/getCustomerList`);
        const data = response.data;

        if (data.status === 200) {
          setCustomers(data.data);       
          setAllCustomers(data.data);     
        } else {
          console.error("Failed to fetch customers:", data.message);
          alert("Failed to fetch customers: " + data.message);
          setAllCustomers([""]);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        alert("Failed to fetch customers: " + error.message);
        setAllCustomers([""]);
      }
    };
    fetchCustomers();
  }, []);
  const handleSubmitphone = async (phone) => {
    try {
      const existing = allCustomers.find(c => c.phone === phone);

      if (existing) {
        setCustomers([existing]);
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Customer/GetbyNumber/${phone}`);
      const customer = response.data.data;

      if (customer) {
        alert(`Form submitted: ${response.data.message}`);
        setAllCustomers(prev => [...prev, customer]);
        setCustomers([customer]);
      } else {
        alert("No customer found with this phone number");
      }
    } catch (error) {
      console.error('API error:', error);
      alert('Failed to submit the form');
    }
  };

  useEffect(() => {
    if (barcodeValue.length === 7) {
      try {
        const customer_id = barcodeValue;
        const matchedCustomer = allCustomers.find(
          (customer) => customer.customer_id === customer_id
        );

        if (matchedCustomer) {
          setCustomers([matchedCustomer]);
        } else {
          alert("No customer found with this ID");
        }
      } catch (error) {
        console.error('Error in handleSubmit:', error);
        alert('Failed to submit the form');
      }
    }
  }, [barcodeValue, allCustomers]);
  if (customers.length === 2) {
  }
  return (
    <>
      <Navbar></Navbar>
      {/* Main content with proper padding for fixed header */}
      <main className="pt-28 px-6 mx-auto">

        { /* search */}
        <div className="flex justify-between flex-wrap gap-4">
          {/* Barcode Form */}
          <form
            className="bg-white rounded-lg shadow-md p-2 flex-1 min-w-[280px]"
          >
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Loyalty Card ID</label>
              <div className="flex gap-2">
                <BarcodeScannerInput
                  value={barcodeValue}
                  onChange={(value) => {
                    setBarcodeValue(value);
                  }}
                  placeholder="Scan product barcode"
                  className="flex-1"
                />
              </div>
            </div>
          </form>

          {/* Phone Number Form */}
          <form
            onSubmit={handleSubmitphone}
            className="bg-white rounded-lg shadow-md p-2 flex-1 min-w-[280px]"
          >
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Phone Number</label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={customerId}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only digits
                    if (/^\d*$/.test(value)) {
                      setCustomerId(value);
                      if (/^[6-9]\d{9}$/.test(value)) {
                        handleSubmitphone(value); // pass value directly
                      }
                    }
                  }}
                  maxLength={10}
                  placeholder="Enter phone number"
                  className="flex-1 border border-gray-300 rounded px-4 py-2"
                />

              </div>
            </div>
          </form>
        </div>

        {/* Customer Hub */}
        <CustomerHub />
       {
  allCustomers.length <= 1 ? (

    allCustomers[0] === ""? (
    <div className="flex items-center justify-center">
<p className="text-red-600 pt-5">
  Oops! No customers found. Kindly reach out to support for assistance. it  Might be a glitch in the matrix
</p>
      </div>
    ):(
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="animate-pulse bg-white rounded-3xl shadow-lg p-6 space-y-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-gray-300 h-12 rounded"></div>
            <div className="bg-gray-300 h-12 rounded"></div>
            <div className="bg-gray-300 h-12 rounded"></div>
            <div className="bg-gray-300 h-12 rounded"></div>
          </div>

          <div className="bg-purple-100 p-4 rounded-xl space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          </div>

          <div className="grid grid-cols-4 gap-4 pt-2">
            <div className="bg-gray-300 h-10 rounded-lg"></div>
            <div className="bg-gray-300 h-10 rounded-lg"></div>
            <div className="bg-gray-300 h-10 rounded-lg"></div>
            <div className="bg-gray-300 h-10 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>)
  ) : (
    <div className="min-h-screen p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allCustomers.map((cust) => (
          <CustomerCard key={cust.customer_id} customer={cust} />
        ))}
      </div>
    </div>
  )
}

      </main >
    </>
  );
}

export default Customer;