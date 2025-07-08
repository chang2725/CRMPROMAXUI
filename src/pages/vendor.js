import { useState, useEffect, useCallback } from 'react';
import { Plus, Store, FileText, CreditCard, Eye, X, Check, AlertCircle } from 'lucide-react';
import Navbar from '../Template/navbar';

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [storeBills, setStoreBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBillsModal, setShowBillsModal] = useState(false);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [selectedStoreName, setSelectedStoreName] = useState('');
  const [notification, setNotification] = useState(null);

  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

  // Form states
  const [vendorForm, setVendorForm] = useState({
    Store_Name: '',
    Phone_Number: '',
    Pending_payment: '',
    Total_Amount_Spent: '',
    Address: ''
  });
  const [paymentAmount, setPaymentAmount] = useState('');

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const apiCall = useCallback(async (endpoint, method = 'GET', data = null) => {
    setLoading(true);
    try {
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      };
      
      if (data) {
        config.body = JSON.stringify(data);
      }
      
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.Message || 'API Error');
      }
      
      return result;
    } catch (error) {
      showNotification(error.message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  const loadVendors = useCallback(async () => {
    try {
      const response = await apiCall('/vendor/vendor-bills');
      setVendors(response.data || []);
    } catch (error) {
      setVendors([]);
    }
  }, [apiCall]);

  const handleAddVendor = async () => {
    try {
      const vendorData = {
        ...vendorForm,
        Pending_payment: parseFloat(vendorForm.Pending_payment) || 0,
        Total_Amount_Spent: parseFloat(vendorForm.Total_Amount_Spent) || 0,
        Address: vendorForm.Address || null
      };
      
      await apiCall('/vendor/vendor', 'POST', vendorData);
      showNotification('Vendor added successfully!');
      setVendorForm({
        Store_Name: '',
        Phone_Number: '',
        Pending_payment: '',
        Total_Amount_Spent: '',
        Address: ''
      });
      setShowAddVendorModal(false);
      // Refresh the vendor list
      loadVendors();
    } catch (error) {
      console.error('Error adding vendor:', error);
    }
  };

  const handlePayment = async () => {
    try {
      await apiCall(`/vendor/reply/${selectedStoreId}`, 'POST', parseFloat(paymentAmount));
      showNotification('Payment processed successfully!');
      setShowPaymentModal(false);
      setPaymentAmount('');
      setSelectedStoreId(null);
      setSelectedStoreName('');
      // Refresh the vendor list
      loadVendors();
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const handleViewBills = async (storeId, storeName) => {
    try {
      const response = await apiCall(`/vendor/vendor-bills/${storeId}`);
      setStoreBills(response.data || []);
      setSelectedStoreId(storeId);
      setSelectedStoreName(storeName);
      setShowBillsModal(true);
    } catch (error) {
      setStoreBills([]);
      setSelectedStoreId(storeId);
      setSelectedStoreName(storeName);
      setShowBillsModal(true);
    }
  };

  const openPaymentModal = (storeId, storeName) => {
    setSelectedStoreId(storeId);
    setSelectedStoreName(storeName);
    setShowPaymentModal(true);
  };

  // Load vendors on component mount
  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-300 to-indigo-100">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Store className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
            </div>
          </div>
        </div>
      </div>
            <Navbar />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vendors List */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Vendor List</h2>
            <button
              onClick={() => setShowAddVendorModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </button>
          </div>
          
          {vendors.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Store className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">No vendors found</p>
              <p className="text-sm">Add a new vendor to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vendors.map((vendor) => (
                <div key={vendor.Store_id || vendor.store_id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Store className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {vendor.Store_Name || vendor.store_name}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Phone:</span> {vendor.Phone_Number || vendor.phone_number}
                        </div>
                        <div>
                          <span className="font-medium">Pending:</span> 
                          <span className={`ml-1 font-semibold ${
                            (vendor.Pending_payment || vendor.pending_payment) > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            ₹{((vendor.Pending_payment || vendor.pending_payment) || 0).toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Total Spent:</span> 
                          <span className="ml-1 text-gray-900">
                            ₹{((vendor.Total_Amount_Spent || vendor.total_amount_spent) || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      {(vendor.Address || vendor.address) && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Address:</span> {vendor.Address || vendor.address}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleViewBills(
                          vendor.Store_id || vendor.store_id, 
                          vendor.Store_Name || vendor.store_name
                        )}
                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Bills
                      </button>
                      <button
                        onClick={() => openPaymentModal(
                          vendor.Store_id || vendor.store_id,
                          vendor.Store_Name || vendor.store_name
                        )}
                        disabled={(vendor.Pending_payment || vendor.pending_payment) <= 0}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Repay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Vendor Modal */}
      {showAddVendorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Plus className="h-5 w-5 mr-2 text-blue-600" />
                Add New Vendor
              </h3>
              <button
                onClick={() => {
                  setShowAddVendorModal(false);
                  setVendorForm({
                    Store_Name: '',
                    Phone_Number: '',
                    Pending_payment: '',
                    Total_Amount_Spent: '',
                    Address: ''
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name *
                </label>
                <input
                  type="text"
                  required
                  value={vendorForm.Store_Name}
                  onChange={(e) => setVendorForm({...vendorForm, Store_Name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter store name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={vendorForm.Phone_Number}
                  onChange={(e) => setVendorForm({...vendorForm, Phone_Number: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pending Payment
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={vendorForm.Pending_payment}
                    onChange={(e) => setVendorForm({...vendorForm, Pending_payment: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Amount Spent
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={vendorForm.Total_Amount_Spent}
                    onChange={(e) => setVendorForm({...vendorForm, Total_Amount_Spent: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  rows="3"
                  value={vendorForm.Address}
                  onChange={(e) => setVendorForm({...vendorForm, Address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter address (optional)"
                />
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddVendorModal(false);
                    setVendorForm({
                      Store_Name: '',
                      Phone_Number: '',
                      Pending_payment: '',
                      Total_Amount_Spent: '',
                      Address: ''
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddVendor}
                  disabled={loading || !vendorForm.Store_Name || !vendorForm.Phone_Number}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Adding...' : 'Add Vendor'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Make Payment</h3>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentAmount('');
                  setSelectedStoreId(null);
                  setSelectedStoreName('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Store: {selectedStoreName}</p>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter payment amount"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentAmount('');
                    setSelectedStoreId(null);
                    setSelectedStoreName('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={loading || !paymentAmount || parseFloat(paymentAmount) <= 0}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Pay'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bills Modal */}
      {showBillsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Bills for {selectedStoreName}</h3>
              <button
                onClick={() => {
                  setShowBillsModal(false);
                  setStoreBills([]);
                  setSelectedStoreId(null);
                  setSelectedStoreName('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-96">
              {storeBills.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">No bills found</p>
                  <p className="text-sm">No bills found for this store</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {storeBills.map((bill, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Bill #{bill.id || index + 1}
                          </h4>
                          {bill.bill_date && (
                            <p className="text-sm text-gray-500">Date: {bill.bill_date}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            ₹{((bill.amount || bill.bill_amount) || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      {bill.bill_url && (
                        <div className="mt-2">
                          <a 
                            href={`${process.env.REACT_APP_IMG_URL || ''}${bill.bill_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View Bill Document
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Loading...</span>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {notification.type === 'success' ? (
              <Check className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorManagement;