import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import Navbar from './components/ui/Navbar';
import ProtectedRoute from './components/ui/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ComparePage from './pages/ComparePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CompareProvider>
          <div className="min-h-screen flex flex-col">
            <Routes>
              {/* Auth route — no navbar */}
              <Route path="/auth" element={<AuthPage />} />

              {/* Protected routes — with navbar */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/compare" element={<ComparePage />} />
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </main>
                    </>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </CompareProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
