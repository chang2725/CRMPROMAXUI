import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BillForm = ({ customerId }) => {
  const [billData, setBillData] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);
  const [repayAmount, setRepayAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchCustomerBills = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Customer/Customerbill/${customerId}`);
      const data = response.data;

      if (data.status === 200) {
        setBillData(data.data);
      } else {
        setBillData(["No bills found for this customer."]);
        console.error("Failed to fetch bills:", data.message);
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  }, [customerId]);

  useEffect(() => {
    fetchCustomerBills();
  }, [fetchCustomerBills]);

  const handleRepayment = async () => {
    if (!repayAmount || isNaN(repayAmount) || Number(repayAmount) <= 0) {
      setMessage({ type: 'error', text: 'Enter a valid amount.' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/Customer/repay/${customerId}`,
        Number(repayAmount),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const result = response.data;
      if (result.status === 200) {
        setMessage({ type: 'success', text: `Successfully repaid ₹${result.data.PaidAmount}. Unused: ₹${result.data.UnusedAmount}` });
        setRepayAmount('');
        fetchCustomerBills();
      } else {
        setMessage({ type: 'error', text: result.message || 'Repayment failed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'API error: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!billData) {
    return <div className="text-center p-6 text-gray-500">Loading billing info...</div>;
  }
  if (billData[0] === "No bills found for this customer.") {
    return <div className="text-center p-6 text-gray-500">No bills found for this customer.</div>;
  }

  const customer = billData.customer[0];
  const bills = billData.bills;

  return (
    <div className="w-full overflow-y-auto mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">Customer Billing Summary</h2>

      {/* Customer Summary */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-lg text-gray-800">
        <div><span className="font-semibold">Total Purchase:</span> ₹{customer.total_purchase}</div>
        <div><span className="font-semibold">Gift Coins:</span> {customer.gift_coin}</div>
        <div><span className="font-semibold">Pending Amount:</span> ₹{customer.pending_amount}</div>
      </div>

      {/* Repayment Form */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Repay Due Amount</h3>
        <div className="flex gap-4 items-center flex-wrap">
          <input
            type="number"
            value={repayAmount}
            onChange={(e) => setRepayAmount(e.target.value)}
            placeholder="Enter amount"
            className="border p-2 rounded w-full sm:w-48"
          />
          <button
            onClick={handleRepayment}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            {loading ? 'Processing...' : 'Repay Now'}
          </button>
        </div>
        {message && (
          <div className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </div>
        )}
      </div>

      {/* Bills List */}
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Bills</h3>
      {bills.length > 0 ? (
        <div className="">
          {bills.map((bill) => (
            <div
              key={bill.bill_id}
              className="border rounded-xl p-4 shadow-sm hover:shadow-md transition grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {/* Text Section */}
              <div className="text-base text-gray-800 space-y-1">
                <div><span className="font-medium">Bill ID:</span> {bill.bill_id}</div>
                <div><span className="font-medium">Date:</span> {new Date(bill.bill_date).toLocaleString()}</div>
                <div><span className="font-medium">Total Amount:</span> ₹{bill.total_bill_amount}</div>
                <div><span className="font-medium">Balance:</span> ₹{bill.balance_amount}</div>
                {bill.discount_amount > 0 && (
                  <div><span className="font-medium">Discount:</span> ₹{bill.discount_amount}</div>
                )}

                {/* View Button */}
                <div className="mt-3">
                  <a
                    href={`${process.env.REACT_APP_IMG_URL}${bill.bill_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    View Bill Image
                  </a>
                </div>
              </div>

              {/* Image Section */}
              <div className="flex justify-center sm:justify-end">
                <img
                  src={`${process.env.REACT_APP_IMG_URL}${bill.bill_url}`}
                  alt="Bill"
                  className="w-full max-w-xs sm:max-w-full h-64 object-cover rounded cursor-pointer hover:scale-105 transition"
                  onClick={() => setZoomImage(`${process.env.REACT_APP_IMG_URL}${bill.bill_url}`)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No bills found for this customer.</div>
      )}

      {/* Zoom Modal */}
      {zoomImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative">
            <img src={zoomImage} alt="Zoomed" className="w-full max-h-[90vh] rounded-xl" />
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 p-1 px-3 rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillForm;
