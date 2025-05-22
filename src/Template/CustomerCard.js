import React from "react";
import { FileText, Receipt, Pencil } from "lucide-react"; // Import required icons

const CustomerCard = ({ customer }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-4 md:flex md:gap-3 mx-auto my-3"> 
      <div className="flex-1">
        {/* Top Summary Section */}
<div className="flex flex-wrap justify-between gap-4 text-center text-sm font-medium text-gray-600 mb-4">
  <div>
    <p>Total Purchase</p>
    <p className="text-black text-lg">{customer.total_purchase}</p>
  </div>
  <div>
    <p>Gift Coin</p>
    <p className="text-black text-lg">{customer.gift_coin}</p>
  </div>
  <div>
    <p>Last Purchase</p>
    <p className="text-black text-lg">
      {new Date(customer.last_purchase_date).toLocaleDateString("en-GB")}
    </p>
  </div>
  <div>
    <p>Pending Amount</p>
    <p className="text-black text-lg">{customer.pending_amount}</p>
  </div>
</div>


        {/* Customer Info Card */}
        <div className="bg-purple-50 p-4 rounded-lg shadow-sm text-sm text-gray-700 mb-4">
          <p><strong>Name:</strong> {customer.name}</p>
          <p><strong>Phone Number:</strong> {customer.phone_number}</p>
          <p><strong>User ID:</strong> {customer.customer_id}</p>
        </div>

        {/* Tabs/Buttons */}
        <div className="flex justify-between bg-purple-100 rounded p-2 text-sm text-gray-700 font-medium">
            <button className="flex items-center gap-1 hover:text-purple-700">
                <FileText size={16} /> Details
            </button>
            <button className="flex items-center gap-1 hover:text-purple-700">
                <Receipt size={16} /> Bill
            </button>
            <button className="flex items-center gap-1 hover:text-purple-700">
                <Pencil size={16} /> Update Profile
            </button>
            </div>
      </div>
    </div>
  );
};

export default CustomerCard;
