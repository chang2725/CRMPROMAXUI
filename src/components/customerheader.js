import React, { useState } from 'react';
import { User, UserPlus, Users, LineChart } from 'lucide-react';
const stats = [
    {
        title: 'Total Customers',
        value: 358,
        change: '+12%',
        icon: <Users className="w-5 h-5 text-blue-500" />,
    },
    {
        title: 'Active Customers',
        value: 285,
        change: '+8%',
        icon: <User className="w-5 h-5 text-blue-500" />,
    },
    {
        title: 'New This Month',
        value: 24,
        change: '+15%',
        icon: <UserPlus className="w-5 h-5 text-blue-500" />,
    },
    {
        title: 'Retention Rate',
        value: '96%',
        change: '+3%',
        icon: <LineChart className="w-5 h-5 text-blue-500" />,
    },
];

export default function CustomerHub() {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone_number: "",
        email: "",
        date_of_birth: "",
        gender: "",
    });
     const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            phone_number: formData.phone_number,
            email: formData.email.trim() === "" ? null : formData.email,
            date_of_birth: formData.date_of_birth === "" ? null : formData.date_of_birth,
            gender: formData.gender.trim() === "" ? null : formData.gender,
        };

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/Customer/AddCustomer`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (response.ok) {
                alert("Customer added successfully!");
                setIsOpen(false);
                setFormData({
                    name: "",
                    phone_number: "",
                    email: "",
                    date_of_birth: "",
                    gender: "",
                });
            } else {
                alert("Failed to add customer");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error adding customer");
        }
    };

    return (
        <div className="p-6 bg-white rounded-2xl shadow-md border border-blue-200 mx-auto mt-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Customer Hub</h2>
                    <p className="text-sm text-gray-500">Manage your customer relationships</p>
                </div>

                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
                    onClick={() => setIsOpen(true)}
                >
                    + Add New Customer
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="flex flex-col gap-2 bg-gray-50 rounded-xl p-4 border hover:shadow-sm transition"
                    >
                        <div className="flex items-center justify-between">
                            {stat.icon}
                            <span className="text-green-500 text-sm font-medium">{stat.change}</span>
                        </div>
                        <p className="text-gray-500 text-sm">{stat.title}</p>
                        <p className="text-xl font-semibold text-gray-800">{stat.value}</p>
                    </div>
                ))}
            </div> 

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Add New Customer</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                className="w-full border rounded px-3 py-2"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="tel"
                                name="phone_number"
                                placeholder="Phone Number"
                                className="w-full border rounded px-3 py-2"
                                value={formData.phone_number}
                                onChange={handleChange}
                                required
                                pattern="^[6-9]\d{9}$"
                                title="Enter a valid 10-digit phone number starting with 6, 7, 8, or 9"
                                maxLength={10}
                                onKeyPress={(e) => {
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="w-full border rounded px-3 py-2"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <input
                                type="date"
                                name="date_of_birth"
                                className="w-full border rounded px-3 py-2"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                            />
                            <select
                                name="gender"
                                className="w-full border rounded px-3 py-2"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select Gender</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                            </select>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
