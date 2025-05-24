import React from "react";
import { FileText, Receipt, Pencil, FilePlus2  } from "lucide-react"; // Icons
import Modal from "../components/Modal";
import CustomerDetailsForm from "../components/CustomerDetailsForm";
import BillForm from "../components/BillForm";
import AddBillForm from "../components/AddBillForm";
import UpdateProfileForm from "../components/UpdateProfileForm";
import { useState } from "react";

const CustomerCard = ({ customer }) => {
  const [modalType, setModalType] = useState(null); // "details", "bill", "addBill", "update"
  
  const closeModal = () => setModalType(null);

  const renderModalContent = () => {
    switch (modalType) {
      case "details":
        return <CustomerDetailsForm customerId={customer.customer_id} />;
      case "bill":
        return <BillForm customerId={customer.customer_id} />;
      case "addBill":
        return <AddBillForm customerId={customer.customer_id} />;
      case "update":
        return <UpdateProfileForm customerId={customer.customer_id} />;
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case "details": return "Customer Details";
      case "bill": return "Billing Info";
      case "addBill": return "Add New Bill";
      case "update": return "Update Customer Profile";
      default: return "";
    }
  };
  
  
  return (
    <div className="bg-white rounded-[2rem] shadow-xl p-6 w-full max-w-4xl mx-auto my-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center text-sm font-medium text-gray-600">
        <div className="bg-white rounded-xl shadow-md p-4">
          <p>Total Purchase</p>
          <p className="text-black text-lg font-semibold">{customer.total_purchase}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p>Gift Coin</p>
          <p className="text-black text-lg font-semibold">{customer.gift_coin}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p>Last Purchase</p>
          <p className="text-black text-lg font-semibold">
            {new Date(customer.last_purchase_date).toLocaleDateString("en-GB")}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p>Pending Amount</p>
          <p className="text-black text-lg font-semibold">{customer.pending_amount}</p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-purple-50 p-4 rounded-xl shadow text-sm text-gray-800 mb-6">
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Phone Number:</strong> {customer.phone_number}</p>
        <p><strong>User ID:</strong> {customer.customer_id}</p>
      </div>

      {/* Bottom Action Buttons */}
      <div className="grid grid-cols-4 gap-4">
        <button onClick={() => setModalType("details")} className="flex flex-col items-center justify-center bg-white shadow-md rounded-xl p-4 hover:bg-purple-100">
          <FileText size={32} className="mb-1" />
          <span className="text-sm font-medium">Details</span>
        </button>
        <button onClick={() => setModalType("bill")} className="flex flex-col items-center justify-center bg-white shadow-md rounded-xl p-4 hover:bg-purple-100">
          <Receipt size={32} className="mb-1" />
          <span className="text-sm font-medium">Bill</span>
        </button>
        <button onClick={() => setModalType("addBill")} className="flex flex-col items-center justify-center bg-white shadow-md rounded-xl p-4 hover:bg-purple-100">
          <FilePlus2 size={32} className="mb-1" />
          <span className="text-sm font-medium">Add Bill</span>
        </button>
        <button onClick={() => setModalType("update")} className="flex flex-col items-center justify-center bg-white shadow-md rounded-xl p-4 hover:bg-purple-100">
          <Pencil size={32} className="mb-1" />
          <span className="text-sm font-medium">Update Profile</span>
        </button>
      </div>

      <Modal isOpen={modalType !== null} onClose={closeModal} title={getModalTitle()}>
        {renderModalContent()}
      </Modal>

    </div>
  );
};

export default CustomerCard;
