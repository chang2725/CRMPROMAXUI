import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BillForm = ({ customerId }) => {
  const [billData, setBillData] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);

  useEffect(() => {
    const fetchCustomerBills = async () => {
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
    };

    fetchCustomerBills();
  }, [customerId]);

  if (!billData) {
    return <div className="text-center p-6 text-gray-500">Loading billing info...</div>;
  }
  if (billData[0] === "No bills found for this customer.") {  
    return <div className="text-center p-6 text-gray-500">No bills found for this customer.</div>;
  }

  const customer = billData.customer[0];
  const bills = billData.bills;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-3xl shadow-xl mt-8">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">Customer Billing Summary</h2>

      {/* Customer Summary */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-lg text-gray-800">
        <div><span className="font-semibold">Total Purchase:</span> ₹{customer.total_purchase}</div>
        <div><span className="font-semibold">Gift Coins:</span> {customer.gift_coin}</div>
        <div><span className="font-semibold">Pending Amount:</span> ₹{customer.pending_amount}</div>
      </div>

      {/* Bills List */}
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Bills</h3>
      {bills.length > 0 ? (
        <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
          {bills.map((bill) => (
            <div key={bill.bill_id} className="flex items-start border rounded-xl p-4 shadow-sm hover:shadow-md transition gap-6">
              <div className="text-l mr-auto">
                <div><span className="font-medium">Bill ID:</span> {bill.bill_id}</div>
                <div><span className="font-medium">Date:</span> {new Date(bill.bill_date).toLocaleString()}</div>
                <div><span className="font-medium">Total Amount:</span> ₹{bill.total_bill_amount}</div>
                <div><span className="font-medium">Balance:</span> ₹{bill.balance_amount}</div>
                {bill.discount_amount > 0 && (
                  <div><span className="font-medium">Discount:</span> ₹{bill.discount_amount}</div>
                )}
              </div>
              <div className="flex-shrink-0">
                <img
                  src={`${process.env.REACT_APP_IMG_URL}${bill.bill_url}`}
                  alt="Bill"
                  className="w-full h-64 object-cover rounded cursor-pointer hover:scale-105 transition"
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
