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
        setAllCustomers(prev => [...prev, customer]);
        setCustomers([customer]);
      } else {
        alert("No customer found with this phone number");
        setCustomers([allCustomers]);
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
          setCustomers([allCustomers]);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-300 to-indigo-100">
      <div className="text-3xl sm:text-4xl font-bold text-gray-900 pt-6 pl-6">
        Customer Search
      </div>        <Navbar />



      {/* Main content with enhanced styling */}
      <main className="pt-6 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Customer Hub with enhanced spacing */}
        <div className="mb-8">
          <CustomerHub />
        </div>


        {/* Search Section with improved design */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 text-lg">
              Find customers using loyalty card or phone number
            </p>
          </div>

          <div className="flex flex-col lg:flex-row justify-center gap-6 mx-auto">
            {/* Barcode Form with enhanced styling */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex-1 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h2M4 4h5.01M4 20h4.01"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Loyalty Card ID</h3>
                  <p className="text-sm text-gray-500">Scan or enter card ID</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Card ID Number
                </label>
                <div className="relative">
                  <BarcodeScannerInput
                    value={barcodeValue}
                    onChange={(value) => {
                      setBarcodeValue(value);
                    }}
                    placeholder="Scan or enter loyalty card ID"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-lg"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone Number Form with enhanced styling */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex-1 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Phone Number</h3>
                  <p className="text-sm text-gray-500">Enter 10-digit mobile number</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <div className="relative">
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
                    placeholder="Enter 10-digit phone number"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 text-lg"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-sm text-gray-400">
                      {customerId.length}/10
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section with enhanced styling */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {allCustomers.length <= 1 ? (
            allCustomers[0] === "" ? (
              <div className="flex flex-col items-center justify-center py-16 px-8">
                <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Customers Found</h3>
                <p className="text-gray-600 text-center max-w-md">
                  Oops! No customers found. Kindly reach out to support for assistance. It might be a glitch in the matrix.
                </p>
                <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Contact Support
                </button>
              </div>
            ) : (
              <div className="p-8">
                <div className="flex items-center justify-center mb-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                  <span className="ml-4 text-lg font-medium text-gray-700">Loading customers...</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="animate-pulse bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-md p-8 space-y-6">
                      <div className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="bg-gray-200 h-14 rounded-xl"></div>
                        ))}
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl space-y-4">
                        <div className="h-5 bg-gray-200 rounded-lg w-1/2"></div>
                        <div className="h-5 bg-gray-200 rounded-lg w-3/4"></div>
                        <div className="h-5 bg-gray-200 rounded-lg w-1/3"></div>
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="bg-gray-200 h-12 rounded-xl"></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="p-1 sm:p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
                  <p className="text-gray-600 mt-1">
                    Found {customers.length} customer{customers.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 font-medium">Active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {customers.map((cust) => (
                  <div key={cust.customer_id}>
                    <CustomerCard customer={cust} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Customer;