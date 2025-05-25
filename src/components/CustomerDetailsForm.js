import {React,useState,  useEffect} from 'react';
import { User, Phone, Mail, Calendar, DollarSign, Gift, Clock, BadgeCheck } from "lucide-react";
import axios from 'axios';


const CustomerDetailsForm = ({ customerId }) => {
  const [customer, setCustomers] = useState([]);
useEffect(() => {
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Customer/GetbyId/${customerId}`);
      const data = response.data;

      if (data.status === 200) {
        setCustomers(data.data);
      } else {
        console.error("Failed to fetch customers:", data.message);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  fetchCustomers();
}, [customerId]);

return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800 text-lg">

        <div className="flex items-start gap-3 min-w-[550px]] ">
          <User className="text-purple-500" />
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-semibold">{customer.name}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-[550px]] ">
          <Phone className="text-purple-500" />
          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-semibold">{customer.phone_number}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-[550px]] ">
          <Mail className="text-purple-500" />
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-semibold">{customer.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-[550px]] ">
          <Calendar className="text-purple-500" />
          <div>
            <p className="text-gray-500">Date of Birth</p>
            <p className="font-semibold">
              {new Date(customer.date_of_birth).toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-[550px]] ">
          <BadgeCheck className="text-purple-500" />
          <div>
            <p className="text-gray-500">Customer ID</p>
            <p className="font-semibold">{customer.customer_id}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-[550px]] ">
          <Clock className="text-purple-500" />
          <div>
            <p className="text-gray-500">Last Purchase</p>
            <p className="font-semibold">
              {new Date(customer.last_purchase_date).toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-[550px]] ">
          <DollarSign className="text-purple-500" />
          <div>
            <p className="text-gray-500">Total Purchase</p>
            <p className="font-semibold text-green-700">₹{customer.total_purchase}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-[550px]] ">
          <Gift className="text-purple-500" />
          <div>
            <p className="text-gray-500">Gift Coins</p>
            <p className="font-semibold">{customer.gift_coin}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-[550px]] ">
          <DollarSign className="text-purple-500" />
          <div>
            <p className="text-gray-500">Pending Amount</p>
            <p className="font-semibold text-red-600">₹{customer.pending_amount}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-[550px]] ">
          <BadgeCheck className="text-purple-500" />
          <div>
            <p className="text-gray-500">Status</p>
           {customer.status ? (
  <p className={`font-semibold ${customer.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
  </p>
) : (
  <p className="font-semibold text-gray-400">Status: N/A</p>
)}

          </div>
        </div>
        
      </div>
    </div>
    </>
  );
}

export default CustomerDetailsForm;
