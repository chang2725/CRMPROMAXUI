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
    fetch(`${process.env.REACT_APP_API_BASE_URL}/Customer/getCustomerList`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setCustomers(data.data);
          setAllCustomers(data.data); // save original
        }
      });
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
    }    }
  }, [barcodeValue, allCustomers]);
  return (
    <>
      <Navbar></Navbar>
      {/* Main content with proper padding for fixed header */}
      <main className="pt-28 px-6 mx-auto">
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

        <CustomerHub />

        <div className="min-h-screen p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customers.map((cust) => (
              <CustomerCard key={cust.customer_id} customer={cust} />
            ))}
          </div>
        </div>
      </main >
    </>
  );
}

export default Customer;