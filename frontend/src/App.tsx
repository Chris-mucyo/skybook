import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import FlightSearch from './pages/FlightSearch';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookingDetails from './pages/BookingDetails';
import PrivateRoute from './components/PrivateRoutes';

function App() {
  return (
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3')" }}>
            <div className="min-h-screen bg-black/50">
              <Navbar />
              <Toaster position="top-right" />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<FlightSearch />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
                <Route path="/booking/:id" element={<PrivateRoute><BookingDetails /></PrivateRoute>} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </Router>
      </AuthProvider>
  );
}

export default App;