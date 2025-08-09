import React  from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Customer from './pages/customer';
import PhoneRecharge from './pages/phonerecharge';
import Vendor from './pages/vendor';
import CashflowDashboard from './pages/Cashflow';
import Dashboard from './pages/dashboard';

function App() {
  
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Customer" element={<Customer />} />
        <Route path="/phonerecharge" element={<PhoneRecharge />} />
        <Route path="/vendor" element={<Vendor />} />
        <Route path="/cashflowdashboard" element={<CashflowDashboard />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;