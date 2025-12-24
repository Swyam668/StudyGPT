import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  const isAuthenticated = false
  const loading = false

  if(loading){
    return (
      <div className='flex items-center justify-center h-screen'>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/"
        // replace is used for replacing 'the page we went from' with 'the page we went to' in browser histoy, without stacking them up
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}></Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        

        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App;