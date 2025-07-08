import React, { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Edit3, Trash2, Phone, CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Navbar from '../Template/navbar';

const PhoneRecharge = () => {
  const [siM_name, setSimName] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState(false);
  const [balance, setBalance] = useState('');
  const [remark, setRemark] = useState('');
  const [recharges, setRecharges] = useState([]);
  const [filteredRecharges, setFilteredRecharges] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL + "/Recharge" || 'http://localhost:5000/api/recharge';

  const simProviders = [
    { name: 'Jio', color: 'bg-blue-500', icon: '📱' },
    { name: 'Airtel', color: 'bg-red-500', icon: '📶' },
    { name: 'Vi', color: 'bg-purple-500', icon: '🌐' },
    { name: 'Airtel TV', color: 'bg-orange-500', icon: '📺' },
    { name: 'Sun TV', color: 'bg-yellow-500', icon: '🔆' },
    { name: 'TATA Sky', color: 'bg-indigo-500', icon: '🛰️' }
  ];
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/getlist`);
      if (!response.ok) {
        throw new Error('Failed to fetch recharges');
      }
      const data = await response.json();
      setRecharges(data.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [API_BASE_URL]);
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filterRecharges = useCallback(() => {
    if (!searchTerm) {
      setFilteredRecharges(recharges);
      return;
    }

    const filtered = recharges.filter(recharge =>
      recharge.siM_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recharge.phone_number.includes(searchTerm) ||
      recharge.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecharges(filtered);
  }, [searchTerm, recharges]);

  useEffect(() => {
    filterRecharges();
  }, [searchTerm, recharges, filterRecharges]);

  const handleAddOrUpdate = async () => {
    if (!siM_name || !phone_number || !amount) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    const payload = {
      siM_name: siM_name,
      phone_number: phone_number,
      amount: Number(amount),
      status: status ? 'Success' : 'Pending',
      balance: Number(balance),
      remark: remark,
      Date: new Date().toISOString().split('T')[0]
    };

    try {
      let response;
      if (editingId) {
        // For update, we'll only send the fields that can be updated
        const updatePayload = {
          status: payload.status,
          balance: payload.balance,
          remark: payload.remark
        };
        response = await fetch(`${API_BASE_URL}/update/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatePayload),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error(editingId ? 'Failed to update recharge' : 'Failed to add recharge');
      }

      // Refresh the list after successful operation
      await fetchAll();
      clearForm();
      setShowForm(false);
      setError('');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const clearForm = () => {
    setSimName('');
    setPhoneNumber('');
    setAmount('');
    setStatus(false);
    setBalance('');
    setRemark('');
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setSimName(item.siM_name);
    setPhoneNumber(item.phone_number);
    setAmount(item.amount.toString());
    setStatus(item.status === 'Success');
    setBalance(item.balance.toString());
    setRemark(item.remark);
    setEditingId(item.recharge_id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recharge record?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete recharge');
        }

        // Refresh the list after successful deletion
        await fetchAll();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getBalanceColor = (balance) => {
    if (balance > 1000) return 'text-green-600';
    if (balance > 500) return 'text-yellow-600';
    return 'text-red-600';
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-300 to-indigo-100 p-4">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Phone Recharge Management</h1>
          <p className="text-gray-600">Manage your phone and TV recharges efficiently</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">×</button>
          </div>
        )}

        {/* Provider Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {simProviders.map((provider) => {
            const providerBalance = recharges
              .filter(r => r.siM_name === provider.name)
              .reduce((sum, r) => sum + r.balance, 0);

            return (
              <div key={provider.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${provider.color} rounded-lg flex items-center justify-center text-white text-xl mb-3`}>
                  {provider.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{provider.name}</h3>
                <p className="text-sm text-gray-500">balance</p>
                <p className={`font-bold ${getBalanceColor(providerBalance)}`}>
                  ₹{providerBalance.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>

        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by SIM name, phone number, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Recharge
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Update Recharge' : 'Add New Recharge'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SIM Provider *</label>
                <select
                  value={siM_name}
                  onChange={(e) => setSimName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select SIM Provider</option>
                  {simProviders.map(provider => (
                    <option key={provider.name} value={provider.name}>{provider.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={phone_number}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">amount</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    disabled={editingId !== null}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">balance *</label>
                <input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  placeholder="Enter balance"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">remark</label>
                <input
                  type="text"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Add a remark"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={status}
                    onChange={(e) => setStatus(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Mark as Success</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddOrUpdate}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : (editingId ? 'Update' : 'Add Recharge')}
              </button>
              <button
                onClick={() => {
                  clearForm();
                  setShowForm(false);
                }}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Recharge Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recharge History</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading...</p>
            </div>
          ) : filteredRecharges.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No recharge records found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">remark</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecharges.map((item) => (
                    <tr key={item.recharge_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="font-medium text-gray-900">{item.siM_name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{item.phone_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">₹{item.amount?.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <span className={`text-sm font-medium ${item.status === 'Success' ? 'text-green-600' :
                              item.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                            {item.status}
                          </span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap font-medium`}>
                        {item.date?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{item.remark}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.recharge_id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneRecharge;