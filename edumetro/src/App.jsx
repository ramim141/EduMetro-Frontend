// src/App.js (Updated)

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AppRoutes from './routes/Routes';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="container">
          <Navbar />
          <main>
            <AppRoutes />
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;