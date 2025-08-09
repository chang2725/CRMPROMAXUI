import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, DollarSign, TrendingDown, Calendar, Upload, X,
  AlertCircle, CheckCircle, ShoppingBag,
  Search, ChevronDown, Trash2
} from 'lucide-react';
import Navbar from '../Template/navbar';

// Reusable components
const InputField = ({ label, type = "text", value, onChange, required = false, error, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
      {...props}
    />
    {error && (
      <p className="mt-1 text-sm text-red-600">{error}</p>
    )}
  </div>
);

const SelectField = ({ label, options, value, onChange, required = false, error }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
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
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      rows={3}
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
      {...props}
    />
    {error && (
      <p className="mt-1 text-sm text-red-600">{error}</p>
    )}
  </div>
);

const FileField = ({ label, onChange, selectedFile, error, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
    <div className="flex items-center justify-center w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border-gray-300 dark:border-gray-600">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-900" />
          {selectedFile ? (
            <p className="mb-2 text-sm text-green-600 dark:text-green-400 font-medium truncate max-w-xs">{selectedFile.name}</p>
          ) : (
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-900">Click to upload bill</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-900">PNG, JPG, PDF (MAX. 10MB)</p>
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
    <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-md max-h-screen sm:max-h-[90vh] overflow-y-auto sm:my-auto sm:mx-auto sm:mt-0 mt-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
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
        ? 'bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200'
        : 'bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200'
        }`}>
        {notification.type === 'success' ? (
          <CheckCircle className="w-5 h-5 mr-2" />
        ) : (
          <AlertCircle className="w-5 h-5 mr-2" />
        )}
        <span className="text-sm font-medium">{notification.message}</span>
        <button
          onClick={() => setNotification({ show: false, type: '', message: '' })}
          className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Chart component for analytics
// const AnalyticsChart = () => {
//   return (
//     <div className="bg-white rounded-xl shadow p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Overview</h3>
//         <div className="flex gap-2">
//           <button className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Week</button>
//           <button className="text-xs px-2 py-1 bg-blue-500 text-white rounded">Month</button>
//           <button className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Year</button>
//         </div>
//       </div>
//       <div className="h-64 flex items-end justify-between pt-4">
//         {/* Chart bars */}
//         {[60, 80, 45, 70, 90, 50, 75].map((height, index) => (
//           <div key={index} className="flex flex-col items-center flex-1 px-1">
//             <div 
//               className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
//               style={{ height: `${height}%` }}
//             ></div>
//             <div className="text-xs mt-1 text-gray-500 dark:text-gray-900">
//               {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="mt-6 grid grid-cols-4 gap-4">
//         <div className="text-center">
//           <div className="text-2xl font-bold text-blue-500">₹42.8k</div>
//           <div className="text-sm text-gray-500 dark:text-gray-900">Sales</div>
//         </div>
//         <div className="text-center">
//           <div className="text-2xl font-bold text-green-500">₹18.2k</div>
//           <div className="text-sm text-gray-500 dark:text-gray-400">Income</div>
//         </div>
//         <div className="text-center">
//           <div className="text-2xl font-bold text-orange-500">₹8.4k</div>
//           <div className="text-sm text-gray-500 dark:text-gray-400">Expenses</div>
//         </div>
//         <div className="text-center">
//           <div className="text-2xl font-bold text-purple-500">₹2.3k</div>
//           <div className="text-sm text-gray-500 dark:text-gray-400">Profit</div>
//         </div>
//       </div>
//     </div>
//   );
// };

const DataTable = ({ title, columns, data, onAdd, addLabel, onDelete, onComplete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Reset page on search/sort
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortConfig]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Sort, filter, and paginate data
  const { paginatedData, filteredDataCount } = React.useMemo(() => {
    let sortableItems = [...data];

    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    const filteredItems = sortableItems.filter(item =>
      Object.values(item).some(
        val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return {
      paginatedData: filteredItems.slice(startIndex, endIndex),
      filteredDataCount: filteredItems.length,
    };
  }, [data, sortConfig, searchTerm, currentPage]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Plus size={16} /> {addLabel}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.title}
                    {sortConfig.key === column.key && (
                      <ChevronDown
                        size={16}
                        className={`ml-1 transition-transform ${sortConfig.direction === 'descending' ? 'rotate-180' : ''}`}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                  {columns.map((column) => {
                    const cellValue = row[column.key];
                    const isTypeColumn = column.key === 'type';

                    if ((cellValue === null || cellValue === undefined) && column.key !== 'actions') {
                      return (
                        <td
                          key={column.key}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                        >
                          N/A
                        </td>
                      );
                    } else if (column.key === 'actions') {
                      return (
                        <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            {typeof onComplete === 'function' && (
                              <button
                                onClick={() => onComplete(row)}
                                className="flex  items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm"
                              >
                                <CheckCircle size={16} className="text-white" />
                                Mark as Done
                              </button>

                            )}
                            {typeof onDelete === 'function' && (
                              <button
                                onClick={() => onDelete(row.id)}
                                className="flex  items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm"
                              >
                                <Trash2 size={16} className="text-white" />
                                Delete
                              </button>

                            )}
                          </div>
                        </td>
                      );
                    } else {
                      return (
                        <td
                          key={column.key}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                        >
                          {isTypeColumn ? (
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide
              ${cellValue === 'Borrowed'
                                  ? 'bg-red-500 text-white dark:bg-red-600 w-[100px] text-center'
                                  : cellValue === 'Lended'
                                    ? 'bg-green-500 text-white dark:bg-green-600 w-[100px]'
                                    : 'bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-white text-center'
                                }`}
                            >
                              {cellValue === 'Borrowed' ? '📉 Borrowed' : '📈 Lended'}
                            </span>
                          ) : (
                            <span className="text-sm font-medium">{cellValue}</span>
                          )}
                        </td>
                      );
                    }
                  })}


                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-300"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing{' '}
          <span className="font-medium">{filteredDataCount === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}</span> to{' '}
          <span className="font-medium">{Math.min(currentPage * rowsPerPage, filteredDataCount)}</span> of{' '}
          <span className="font-medium">{filteredDataCount}</span> results
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => (prev * rowsPerPage < filteredDataCount ? prev + 1 : prev))
            }
            disabled={currentPage * rowsPerPage >= filteredDataCount}
            className="px-3 py-1 rounded bg-blue-500 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

const CashflowDashboard = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [vendorList, setVendorList] = useState([]);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expenseData, setExpenseData] = useState([]);
  const [dayendData, setDayendData] = useState([]);
  const [borrowedData, setBorrowedData] = useState([]);
  const [produceData, setProduceData] = useState([]);

  // Form states
  const [dayendForm, setDayendForm] = useState({
    DATE: new Date().toISOString().split('T')[0],
    Total_Sales_Amount: '',
    Payed_By_Cash: '',
    Pay_By_Online: '',
    Amount_Spent_On_Offers: '',
    Day_Expense: '',
    Cash_In_Drawer: '',
    Cash_Mismatch: ''
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
    Type: '',
    DATE: new Date().toISOString().split('T')[0],
    Amount: '',
    contact_number: '',
    return_date: new Date().toISOString().split('T')[0],
    StatusCode: '',
  });

  const [produceForm, setProduceForm] = useState({
    Produce_Name: '',
    Quantity_Needed: '',
    Unit: '',
    Priority_Level: 'Medium',
    Required_By_Date: new Date().toISOString().split('T')[0],
    Status: 'Pending',
    Store_id: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';
  const fetchVendors = useCallback(async () => {
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
  }, [API_BASE_URL]);
  const fetchExpenseData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Cashflow/expense`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.data) {
        setExpenseData(data.data);
      } else {
        console.error('Vendor data not found in response:', data);
        showNotification('error', 'Failed to expense list');
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
      showNotification('error', 'Error expense list. Please try again.');
    }
  }, [API_BASE_URL]);
  const fetchDayendData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Cashflow/dayend_entry`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.data) {
        setDayendData(data.data);
      } else {
        console.error('Vendor data not found in response:', data);
        showNotification('error', 'Failed to dayend_entry list');
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
      showNotification('error', 'Error loading dayend_entry. Please try again.');
    }
  }, [API_BASE_URL]);
  const fetchBorrowedData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Cashflow/borrowed_lend_amount`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.data) {
        setBorrowedData(data.data);
      } else {
        console.error('Vendor data not found in response:', data);
        showNotification('error', 'Failed to borrowed_lend_amount list');
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
      showNotification('error', 'Error loading borrowed_lend_amount list. Please try again.');
    }
  }, [API_BASE_URL]);
  const fetchProduceData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Cashflow/GetProduce_To_Buy`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.data) {
        setProduceData(data.data);
      } else {
        console.error('Vendor data not found in response:', data);
        showNotification('error', 'Failed to ProduceData list');
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
      showNotification('error', 'Error loading ProduceData list. Please try again.');
    }
  }, [API_BASE_URL]);
  const fetchDayendDataentry = useCallback(async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Dashboard/dayenddata`);
    const data = await response.json(); // 👈 you missed this

    const apiData = data.data[0]; // Corrected this to data.data[0]

    setDayendForm({
      DATE: new Date().toISOString().split('T')[0],
      Total_Sales_Amount: apiData.total_bill_amount || 0,
      Payed_By_Cash: '',
      Pay_By_Online: '',
      Amount_Spent_On_Offers: apiData.Amount_Spent_On_offers || 0,
      Day_Expense: apiData.Expense_Amount || 0,
      Cash_In_Drawer: '',
      Cash_Mismatch: ''
    });
  } catch (error) {
    console.error('Failed to fetch dayend data:', error);
    showNotification('error', 'Failed to load Day End Data');
  }
}, [API_BASE_URL]); // ✅ Add any external deps here
useEffect(() => {
  if (activeModal === 'dayend') {
    fetchDayendDataentry();
  }
}, [activeModal, fetchDayendDataentry]);



  useEffect(() => {
    fetchVendors();
    fetchExpenseData();
    fetchDayendData();
    fetchBorrowedData();
    fetchProduceData();
  }, [fetchVendors, fetchExpenseData, fetchDayendData, fetchBorrowedData, fetchProduceData]);

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
      contact_number: '',
      return_date: new Date().toISOString().split('T')[0]
    });
    setProduceForm({
      Produce_Name: '',
      Quantity_Needed: '',
      Unit: '',
      Priority_Level: 'Medium',
      Required_By_Date: new Date().toISOString().split('T')[0],
      Status: 'Pending',
      Store_id: ''
    });
  };

  const handleSubmit = async (endpoint, data, isFormData = false) => {
    setIsLoading(true);
    try {

      if(endpoint === 'dayend') {
      const submitData = {
  summary_date: dayendForm.DATE,
  total_sales: parseFloat(dayendForm.Total_Sales_Amount) || 0,
  paid_online: parseFloat(dayendForm.Pay_By_Online) || 0,
  paid_cash: parseFloat(dayendForm.Payed_By_Cash) || 0,
  expenses: parseFloat(dayendForm.Day_Expense) || 0,
  discount_amount: parseFloat(dayendForm.Amount_Spent_On_Offers) || 0,
  cash_in_drawer: parseFloat(dayendForm.Cash_In_Drawer) || 0,
  cash_mismatch: parseFloat(dayendForm.Cash_Mismatch) || 0
};
        data = submitData;
      }
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
    const requiredFields = ['Amount', 'contact_number'];
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

  const handleProduceSubmit = async () => {
    const requiredFields = ['Produce_Name', 'Quantity_Needed', 'Required_By_Date'];
    if (!validateForm(produceForm, requiredFields)) {
      showNotification('error', 'Please fill in all required fields correctly');
      return;
    }

    const submitData = {
      ...produceForm,
      Quantity_Needed: parseFloat(produceForm.Quantity_Needed)
    };

    await handleSubmit('AddProduce_To_Buy', submitData);
  };
  const handleCompleteBorrowed = async (row) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Cashflow/borrowed/${row.id}`, {
        method: 'PUT'
      });
      const result = await response.json();
      if (response.ok) {
        alert('Marked as completed ✅');
        fetchBorrowedData();
      }
      else alert(result.message || 'Failed to complete');
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };
  const handleDeleteProduce = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Cashflow/DeleteProduce_To_Buy/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (response.ok) {
        alert('Deleted successfully 🗑️');
        fetchProduceData();
      }
      else alert(result.message || 'Failed to delete');
    } catch (err) {
      console.error(err);
      alert('Error deleting item');
    }
  };

  const handleCompleteProduce = async (row) => {
    try {
      const updated = { ...row, STATUS: 'Received', required_by_date: new Date().toISOString().split('T')[0] };
      const response = await fetch(`${API_BASE_URL}/Cashflow/UpdateProduce_To_Buy/${row.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const result = await response.json();
      if (response.ok) {
        alert('Marked as completed ✅');
        fetchProduceData();
      }
      else alert(result.message || 'Failed to complete');
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-300 to-indigo-100 p-4">
      <Navbar />
      <Notification notification={notification} setNotification={setNotification} />

      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cashflow Management</h1>
            <p className="text-gray-600 dark:text-gray-900">Manage your daily transactions, expenses, and financial records</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 min-w-max sm:min-w-full">
            {[
              { key: 'dashboard', label: 'Dashboard' },
              { key: 'expenses', label: 'Expenses' },
              { key: 'dayend', label: 'Day End Entries' },
              { key: 'borrowed', label: 'Borrowed/Lent' },
              { key: 'produce', label: 'Produce To Buy' },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`py-2 px-4 font-medium text-sm whitespace-nowrap ${activeTab === key
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500 dark:text-gray-900 hover:text-gray-700 dark:hover:text-gray-600'
                  }`}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>


        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Day End Entry Card */}
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Calendar className="w-6 h-6 text-green-600 dark:text-green-900" />
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
                <p className="text-gray-600 dark:text-gray-900 text-sm">Record daily sales and cash flow summary</p>
              </div>

              {/* Expense Card */}
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-900" />
                  </div>
                  <button
                    onClick={() => setActiveModal('expense')}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    aria-label="Add expense"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900  mb-2">Add Expense</h3>
                <p className="text-gray-600 dark:text-gray-900 text-sm">Record business expenses and vendor bills</p>
              </div>

              {/* Borrowed Amount Card */}
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-900" />
                  </div>
                  <button
                    onClick={() => setActiveModal('borrowed')}
                    className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                    aria-label="Add borrowed amount"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900  mb-2">Borrowed Amount</h3>
                <p className="text-gray-600 dark:text-gray-900 text-sm">Record money borrowed from others</p>
              </div>

              {/* Produce Card */}
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <ShoppingBag className="w-6 h-6 text-orange-600 dark:text-orange-900" />
                  </div>
                  <button
                    onClick={() => setActiveModal('produce')}
                    className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                    aria-label="Add produce"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900  mb-2">Produce To Buy</h3>
                <p className="text-gray-600 dark:text-gray-900 text-sm">Manage inventory and purchase requests</p>
              </div>
            </div>
          </>
        )}

        {/* Expenses Table */}
        {activeTab === 'expenses' && (
          <DataTable
            title="Expenses"
            columns={[
              { key: 'Expense_Date', title: 'Date' },
              { key: 'type_of_Expense', title: 'Type' },
              { key: 'Expense_Amount', title: 'Amount' },
              { key: 'DESCRIPTION', title: 'Description' },
              { key: 'Store_id', title: 'Vendor' }
            ]}
            data={expenseData}
            onAdd={() => setActiveModal('expense')}
            addLabel="Add Expense"
          />
        )}

        {/* Day End Entries Table */}
        {activeTab === 'dayend' && (
          <DataTable
            title="Day End Entries"
            columns={[
              { key: 'Date', title: 'Date' },
              { key: 'Total_Sales_Amount', title: 'Total Sales' },
              { key: 'Payed_By_Cash', title: 'Cash Payment' },
              { key: 'Pay_By_Online', title: 'Online Payment' },
              { key: 'Amount_Spent_On_Offers', title: 'Offer Amount' },
              { key: 'Day_Expense', title: 'Day Expense' }
            ]}
            data={dayendData}
            onAdd={() => setActiveModal('dayend')}
            addLabel="Add Entry"
          />
        )}

        {/* Borrowed/Lent Table */}
        {activeTab === 'borrowed' && (
          <DataTable
            title="Borrowed/Lent Amounts"
            columns={[
              { key: 'id', title: 'id' },
              { key: 'type', title: 'Type' },
              { key: 'contact_number', title: 'Contact Number' },
              { key: 'Amount', title: 'Amount' },
              { key: 'return_date', title: 'Return Date' },
              { key: 'actions', title: 'Actions' }
            ]}
            data={borrowedData}
            onAdd={() => setActiveModal('borrowed')}
            addLabel="Add Record"
            onComplete={(row) => handleCompleteBorrowed(row)}
          />
        )}

        {/* Produce To Buy Table */}
        {activeTab === 'produce' && (
          <DataTable
            title="Produce To Buy"
            columns={[
              { key: 'id', title: 'Product Id' },
              { key: 'produce_name', title: 'Produce Name' },
              { key: 'quantity_needed', title: 'Quantity' },
              { key: 'unit', title: 'Unit' },
              { key: 'priority_level', title: 'Priority' },
              { key: 'required_by_date', title: 'Required Date' },
              { key: 'STATUS', title: 'Status' },
              { key: 'supplier_id', title: 'Supplier' },
              { key: 'actions', title: 'Actions' }
            ]}
            data={produceData}
            onAdd={() => setActiveModal('produce')}
            addLabel="Add Produce"
            onDelete={(id) => handleDeleteProduce(id)}
            onComplete={(row) => handleCompleteProduce(row)}
          />
        )}
      </div>

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

      {/* Total Sales - Read Only */}
      <InputField
        label="Total Sales Amount"
        type="number"
        step="1"
        value={dayendForm.Total_Sales_Amount}
        readOnly
      />

      {/* Paid by Online - User Inputs */}
      <InputField
        label="Paid by Online"
        type="number"
        step="1"
        value={dayendForm.Pay_By_Online}
        onChange={(e) => {
          const online = parseFloat(e.target.value) || 0;
          const cash = parseFloat(dayendForm.Payed_By_Cash) || 0;
          const mismatch = (online + cash) - (parseFloat(dayendForm.Total_Sales_Amount) || 0)  ;
          setDayendForm({
            ...dayendForm,
            Pay_By_Online: e.target.value,
            Cash_Mismatch: mismatch
          });
        }}
        error={formErrors.Pay_By_Online}
      />

      {/* Paid by Cash - User Inputs */}
      <InputField
        label="Paid by Cash"
        type="number"
        step="1"
        value={dayendForm.Payed_By_Cash}
        onChange={(e) => {
          const cash = parseFloat(e.target.value) || 0;
          const online = parseFloat(dayendForm.Pay_By_Online) || 0;
          const mismatch = (online + cash) - (parseFloat(dayendForm.Total_Sales_Amount) || 0) ;
          setDayendForm({
            ...dayendForm,
            Payed_By_Cash: e.target.value,
            Cash_Mismatch: mismatch
          });
        }}
        error={formErrors.Payed_By_Cash}
      />

      {/* Amount Spent on Offers - Read Only */}
      <InputField
        label="Amount Spent on Offers"
        type="number"
        step="1"
        value={dayendForm.Amount_Spent_On_Offers}
        readOnly
      />

      {/* Day Expense - Read Only */}
      <InputField
        label="Day Expense"
        type="number"
        step="1"
        value={dayendForm.Day_Expense}
        readOnly
      />

      {/* Cash Mismatch - Auto Calculated */}
      <InputField
        label="Cash Mismatch (Auto)"
        type="number"
        step="1"
        value={dayendForm.Cash_Mismatch}
        readOnly
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type of Expense <span className="text-red-500">*</span>
              </label>
              <select
                value={expenseForm.type_of_Expense}
                onChange={(e) => setExpenseForm({ ...expenseForm, type_of_Expense: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.type_of_Expense ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
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
              step="1"
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
              step="1"
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={borrowedForm.Type}
                onChange={(e) => setBorrowedForm({ ...borrowedForm, Type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="">-- Select Type --</option>
                <option value="Borrowed">Borrowed</option>
                <option value="Lended">Lended</option>
              </select>
            </div>


            <InputField
              label="Amount"
              type="number"
              step="1"
              value={borrowedForm.Amount}
              onChange={(e) => setBorrowedForm({ ...borrowedForm, Amount: e.target.value })}
              required
              error={formErrors.Amount}
            />
            <InputField
              label="Contact Number"
              value={borrowedForm.contact_number}
              onChange={(e) => setBorrowedForm({ ...borrowedForm, contact_number: e.target.value })}
              required
              error={formErrors.contact_number}
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

      {/* Produce Modal */}
      {activeModal === 'produce' && (
        <Modal title="Add Produce To Buy" onClose={closeModal}>
          <div>
            <InputField
              label="Produce Name"
              type="text"
              value={produceForm.Produce_Name}
              onChange={(e) => setProduceForm({ ...produceForm, Produce_Name: e.target.value })}
              required
              error={formErrors.Produce_Name}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Quantity Needed"
                type="number"
                step="1"
                value={produceForm.Quantity_Needed}
                onChange={(e) => setProduceForm({ ...produceForm, Quantity_Needed: e.target.value })}
                required
                error={formErrors.Quantity_Needed}
              />

              <InputField
                label="Unit"
                type="text"
                value={produceForm.Unit}
                onChange={(e) => setProduceForm({ ...produceForm, Unit: e.target.value })}
                required
                error={formErrors.Unit}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority Level <span className="text-red-500">*</span>
              </label>
              <select
                value={produceForm.Priority_Level}
                onChange={(e) => setProduceForm({ ...produceForm, Priority_Level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <InputField
              label="Required By Date"
              type="date"
              value={produceForm.Required_By_Date}
              onChange={(e) => setProduceForm({ ...produceForm, Required_By_Date: e.target.value })}
              required
              error={formErrors.Required_By_Date}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={produceForm.Status}
                onChange={(e) => setProduceForm({ ...produceForm, Status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="Pending">Pending</option>
                <option value="Ordered">Ordered</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <SelectField
              label="Vendor"
              options={vendorList}
              value={expenseForm.Store_id}
              onChange={(e) => setExpenseForm({ ...expenseForm, Store_id: e.target.value })}
              error={formErrors.Store_id}
            />

            <button
              onClick={handleProduceSubmit}
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Add Produce'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CashflowDashboard;