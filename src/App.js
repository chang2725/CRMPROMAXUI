import React  from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Customer from './pages/customer';
function App() {
  
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Customer />} />
        <Route path="/about" element={<Customer />} />
        <Route path="*" element={<Customer />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;