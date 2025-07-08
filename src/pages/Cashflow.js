import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, TrendingDown, Calendar, Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import Navbar from '../Template/navbar';

// Reusable components
const InputField = ({ label, type = "text", value, onChange, required = false, error, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'
        }`}
      {...props}
    />
    {error && (
      <p className="mt-1 text-sm text-red-600">{error}</p>
    )}
  </div>
);

const SelectField = ({ label, options, value, onChange, required = false, error }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'}`}
    >
      <option value="">Select Vendor</option>
      {options.map(vendor => (
        <option key={vendor.Store_id} value={vendor.Store_id}>
          {vendor.Store_Name}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const TextAreaField = ({ label, value, onChange, error, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      rows={3}
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${error ? 'border-red-500' : 'border-gray-300'
        }`}
      {...props}
    />
    {error && (
      <p className="mt-1 text-sm text-red-600">{error}</p>
    )}
  </div>
);

const FileField = ({ label, onChange, selectedFile, error, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="flex items-center justify-center w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-4 text-gray-500" />
          {selectedFile ? (
            <p className="mb-2 text-sm text-green-600 font-medium truncate max-w-xs">{selectedFile.name}</p>
          ) : (
            <p className="mb-2 text-sm text-gray-500">Click to upload bill</p>
          )}
          <p className="text-xs text-gray-500">PNG, JPG, PDF (MAX. 10MB)</p>
        </div>
        <input
          type="file"
          className="hidden"
          onChange={e => onChange(e.target.files[0])}
          accept=".png,.jpg,.jpeg,.pdf"
          {...props}
        />
      </label>
    </div>
    {error && (
      <p className="mt-1 text-sm text-red-600">{error}</p>
    )}
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center sm:p-4 p-0">
    <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-md max-h-screen sm:max-h-[90vh] overflow-y-auto sm:my-auto sm:mx-auto sm:mt-0 mt-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  </div>
);

const Notification = ({ notification, setNotification }) => {
  if (!notification.show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`flex items-center p-4 rounded-lg shadow-lg ${notification.type === 'success'
        ? 'bg-green-100 border border-green-400 text-green-700'
        : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
        {notification.type === 'success' ? (
          <CheckCircle className="w-5 h-5 mr-2" />
        ) : (
          <AlertCircle className="w-5 h-5 mr-2" />
        )}
        <span className="text-sm font-medium">{notification.message}</span>
        <button
          onClick={() => setNotification({ show: false, type: '', message: '' })}
          className="ml-4 text-gray-400 hover:text-gray-600"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const CashflowDashboard = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [vendorList, setVendorList] = useState([]);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  
  // Form states
  const [dayendForm, setDayendForm] = useState({
    DATE: new Date().toISOString().split('T')[0],
    Total_Sales_Amount: '',
    Payed_By_Cash: '',
    Pay_By_Online: '',
    Amount_Spent_On_Offers: '',
    Day_Expense: ''
  });

  const [expenseForm, setExpenseForm] = useState({
    Expense_Date: new Date().toISOString().split('T')[0],
    type_of_Expense: '',
    Expense_Amount: '',
    DESCRIPTION: '',
    Store_id: '',
    Pending_payment: '',
    BillFile: null
  });

  const [borrowedForm, setBorrowedForm] = useState({
    DATE: new Date().toISOString().split('T')[0],
    Amount: '',
    Customer_id: '',
    return_date: new Date().toISOString().split('T')[0]
  });

  const [formErrors, setFormErrors] = useState({});

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

  // Fetch vendor list on component mount
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/vendor/vendornameList`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.data) {
          setVendorList(data.data);
        } else {
          console.error('Vendor data not found in response:', data);
          showNotification('error', 'Failed to load vendor list');
        }
      } catch (error) {
        console.error('Failed to fetch vendors:', error);
        showNotification('error', 'Error loading vendor list. Please try again.');
      }
    };
    
    fetchVendors();
  }, [API_BASE_URL]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification(prev => prev.show ? { show: false, type: '', message: '' } : prev);
    }, 5000);
  };

  const validateForm = (formData, requiredFields) => {
    const errors = {};
    let isValid = true;

    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        errors[field] = `${field.replace(/_/g, ' ')} is required`;
        isValid = false;
      }
    });

    // Additional validation for numbers
    if (formData.Total_Sales_Amount && isNaN(parseFloat(formData.Total_Sales_Amount))) {
      errors.Total_Sales_Amount = 'Must be a valid number';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const closeModal = () => {
    setActiveModal(null);
    setFormErrors({});
    setDayendForm({
      DATE: new Date().toISOString().split('T')[0],
      Total_Sales_Amount: '',
      Payed_By_Cash: '',
      Pay_By_Online: '',
      Amount_Spent_On_Offers: '',
      Day_Expense: ''
    });
    setExpenseForm({
      Expense_Date: new Date().toISOString().split('T')[0],
      type_of_Expense: '',
      Expense_Amount: '',
      DESCRIPTION: '',
      Store_id: '',
      Pending_payment: '',
      BillFile: null
    });
    setBorrowedForm({
      DATE: new Date().toISOString().split('T')[0],
      Amount: '',
      Customer_id: '',
      return_date: new Date().toISOString().split('T')[0]
    });
  };

  const handleSubmit = async (endpoint, data, isFormData = false) => {
    setIsLoading(true);
    try {
      const options = {
        method: endpoint === 'expanse' ? 'PATCH' : 'POST',
        headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        body: isFormData ? data : JSON.stringify(data)
      };

      const response = await fetch(`${API_BASE_URL}/Cashflow/${endpoint}`, options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = (errorData.message || `HTTP error! status: ${response.status}`);
        closeModal();
        showNotification('error', errorMessage);
        return null;
      }

      const result = await response.json();

      if (result.status >= 201 && result.status < 300) {
        showNotification('success', result.message || 'Operation completed successfully!');
        closeModal();
        return result;
      } else {
        let errorMessage = (result.Message || 'Operation failed');
        showNotification('error', errorMessage);
        closeModal();
        return null;
      }
    } catch (error) {
      console.error('API Error:', error);
      let errorMessage = 'An unexpected error occurred';

      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect to server';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = `Server error: ${error.message}`;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showNotification('error', errorMessage);
      closeModal();
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayendSubmit = async () => {
    const requiredFields = ['DATE', 'Total_Sales_Amount'];
    if (!validateForm(dayendForm, requiredFields)) {
      showNotification('error', 'Please fill in all required fields correctly');
      return;
    }

    const submitData = {
      ...dayendForm,
      Total_Sales_Amount: parseFloat(dayendForm.Total_Sales_Amount),
      Payed_By_Cash: dayendForm.Payed_By_Cash ? parseFloat(dayendForm.Payed_By_Cash) : 0,
      Pay_By_Online: dayendForm.Pay_By_Online ? parseFloat(dayendForm.Pay_By_Online) : 0,
      Amount_Spent_On_Offers: dayendForm.Amount_Spent_On_Offers ? parseFloat(dayendForm.Amount_Spent_On_Offers) : 0,
      Day_Expense: dayendForm.Day_Expense ? parseFloat(dayendForm.Day_Expense) : 0
    };

    await handleSubmit('dayend', submitData);
  };

  const handleExpenseSubmit = async () => {
    const requiredFields = ['type_of_Expense', 'Expense_Amount'];
    if (!validateForm(expenseForm, requiredFields)) {
      showNotification('error', 'Please fill in all required fields correctly');
      return;
    }

    const formData = new FormData();
    Object.entries(expenseForm).forEach(([key, value]) => {
      if (key === 'BillFile' && value) {
        formData.append(key, value, value.name);
      } else if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value);
      }
    });

    await handleSubmit('expanse', formData, true);
  };

  const handleBorrowedSubmit = async () => {
    const requiredFields = ['Amount', 'Customer_id'];
    if (!validateForm(borrowedForm, requiredFields)) {
      showNotification('error', 'Please fill in all required fields correctly');
      return;
    }

    const submitData = {
      ...borrowedForm,
      Amount: parseFloat(borrowedForm.Amount)
    };

    await handleSubmit('borrowed', submitData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <Navbar />
      <Notification notification={notification} setNotification={setNotification} />

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cashflow Management</h1>
          <p className="text-gray-600">Manage your daily transactions, expenses, and financial records</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Day End Entry Card */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <button
                onClick={() => setActiveModal('dayend')}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                aria-label="Add day end entry"
              >
                <Plus size={20} />
              </button>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Day End Entry</h3>
            <p className="text-gray-600 text-sm">Record daily sales and cash flow summary</p>
          </div>

          {/* Expense Card */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <button
                onClick={() => setActiveModal('expense')}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                aria-label="Add expense"
              >
                <Plus size={20} />
              </button>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Expense</h3>
            <p className="text-gray-600 text-sm">Record business expenses and vendor bills</p>
          </div>

          {/* Borrowed Amount Card */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <button
                onClick={() => setActiveModal('borrowed')}
                className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                aria-label="Add borrowed amount"
              >
                <Plus size={20} />
              </button>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Borrowed Amount</h3>
            <p className="text-gray-600 text-sm">Record money borrowed from others</p>
          </div>
        </div>
        
        {/* Day End Modal */}
        {activeModal === 'dayend' && (
          <Modal title="Day End Entry" onClose={closeModal}>
            <div>
              <InputField
                label="Date"
                type="date"
                value={dayendForm.DATE}
                onChange={(e) => setDayendForm({ ...dayendForm, DATE: e.target.value })}
                required
                error={formErrors.DATE}
              />
              <InputField
                label="Total Sales Amount"
                type="number"
                step="0.01"
                value={dayendForm.Total_Sales_Amount}
                onChange={(e) => setDayendForm({ ...dayendForm, Total_Sales_Amount: e.target.value })}
                required
                error={formErrors.Total_Sales_Amount}
              />
              <InputField
                label="Paid by Cash"
                type="number"
                step="0.01"
                value={dayendForm.Payed_By_Cash}
                onChange={(e) => setDayendForm({ ...dayendForm, Payed_By_Cash: e.target.value })}
                error={formErrors.Payed_By_Cash}
              />
              <InputField
                label="Paid by Online"
                type="number"
                step="0.01"
                value={dayendForm.Pay_By_Online}
                onChange={(e) => setDayendForm({ ...dayendForm, Pay_By_Online: e.target.value })}
                error={formErrors.Pay_By_Online}
              />
              <InputField
                label="Amount Spent on Offers"
                type="number"
                step="0.01"
                value={dayendForm.Amount_Spent_On_Offers}
                onChange={(e) => setDayendForm({ ...dayendForm, Amount_Spent_On_Offers: e.target.value })}
                error={formErrors.Amount_Spent_On_Offers}
              />
              <InputField
                label="Day Expense"
                type="number"
                step="0.01"
                value={dayendForm.Day_Expense}
                onChange={(e) => setDayendForm({ ...dayendForm, Day_Expense: e.target.value })}
                error={formErrors.Day_Expense}
              />
              <button
                onClick={handleDayendSubmit}
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Day End Entry'}
              </button>
            </div>
          </Modal>
        )}
        
        {/* Expense Modal */}
        {activeModal === 'expense' && (
          <Modal title="Add Expense" onClose={closeModal}>
            <div>
              <InputField
                label="Expense Date"
                type="date"
                value={expenseForm.Expense_Date}
                onChange={(e) => setExpenseForm({ ...expenseForm, Expense_Date: e.target.value })}
                error={formErrors.Expense_Date}
              />
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of Expense <span className="text-red-500">*</span>
                </label>
                <select
                  value={expenseForm.type_of_Expense}
                  onChange={(e) => setExpenseForm({ ...expenseForm, type_of_Expense: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.type_of_Expense ? 'border-red-500' : 'border-gray-300'}`}
                  required
                >
                  <option value="">-- Select Expense Type --</option>
                  <option value="Stock Purchase">Stock Purchase</option>
                  <option value="Operating Expenses">Operating Expenses</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Transport">Transport</option>
                  <option value="Inventory Damage">Inventory Damage</option>
                  <option value="Software Subscription">Software Subscription</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
                {formErrors.type_of_Expense && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.type_of_Expense}</p>
                )}
              </div>
              
              <InputField
                label="Expense Amount"
                type="number"
                step="0.01"
                value={expenseForm.Expense_Amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, Expense_Amount: e.target.value })}
                required
                error={formErrors.Expense_Amount}
              />
              
              <SelectField
                label="Vendor"
                options={vendorList}
                value={expenseForm.Store_id}
                onChange={(e) => setExpenseForm({ ...expenseForm, Store_id: e.target.value })}
                error={formErrors.Store_id}
              />
              
              <InputField
                label="Pending Payment"
                type="number"
                step="0.01"
                value={expenseForm.Pending_payment}
                onChange={(e) => setExpenseForm({ ...expenseForm, Pending_payment: e.target.value })}
                error={formErrors.Pending_payment}
              />
              
              <TextAreaField
                label="Description"
                value={expenseForm.DESCRIPTION}
                onChange={(e) => setExpenseForm({ ...expenseForm, DESCRIPTION: e.target.value })}
                error={formErrors.DESCRIPTION}
              />
              
              <FileField
                label="Bill File"
                onChange={(file) => setExpenseForm({ ...expenseForm, BillFile: file })}
                selectedFile={expenseForm.BillFile}
                error={formErrors.BillFile}
              />
              
              <button
                onClick={handleExpenseSubmit}
                disabled={isLoading}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Expense'}
              </button>
            </div>
          </Modal>
        )}
        
        {/* Borrowed Modal */}
        {activeModal === 'borrowed' && (
          <Modal title="Borrowed Amount" onClose={closeModal}>
            <div>
              <InputField
                label="Date"
                type="date"
                value={borrowedForm.DATE}
                onChange={(e) => setBorrowedForm({ ...borrowedForm, DATE: e.target.value })}
                error={formErrors.DATE}
              />
              <InputField
                label="Amount"
                type="number"
                step="0.01"
                value={borrowedForm.Amount}
                onChange={(e) => setBorrowedForm({ ...borrowedForm, Amount: e.target.value })}
                required
                error={formErrors.Amount}
              />
              <InputField
                label="Customer ID"
                value={borrowedForm.Customer_id}
                onChange={(e) => setBorrowedForm({ ...borrowedForm, Customer_id: e.target.value })}
                required
                error={formErrors.Customer_id}
              />
              <InputField
                label="Return Date"
                type="date"
                value={borrowedForm.return_date}
                onChange={(e) => setBorrowedForm({ ...borrowedForm, return_date: e.target.value })}
                error={formErrors.return_date}
              />
              <button
                onClick={handleBorrowedSubmit}
                disabled={isLoading}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Borrowed Amount'}
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default CashflowDashboard;