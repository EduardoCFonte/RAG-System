import React from 'react';
import {  Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; 
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Header from './components/Layout/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from "./pages/RegisterPage";
import MainPage from './pages/MainPage';

const App = () => {
  return (

      <AuthProvider>
        <div className="flex flex-col h-screen bg-gray-100">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<ProtectedRoute/>}>
                  <Route path="/main" element={<MainPage/>}/>
              </Route>
            </Routes>
          </main>
        </div>
      </AuthProvider>
  );
};

export default App;