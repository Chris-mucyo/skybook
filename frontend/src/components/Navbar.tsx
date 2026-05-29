import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plane, LogOut, Calendar, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-6 py-3">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-blue-600">
                        <Plane className="w-7 h-7" />
                        <span>SkyBook</span>
                    </Link>

                    <div className="flex items-center space-x-6">
                        <Link to="/search" className="text-gray-700 hover:text-blue-600 transition">Flights</Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>My Bookings</span>
                                </Link>
                                {user?.role === 'admin' && (
                                    <Link to="/admin" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                                        <LayoutDashboard className="w-4 h-4" />
                                        <span>Admin</span>
                                    </Link>
                                )}
                                <div className="flex items-center space-x-3">
                                    <span className="text-gray-600">Hi, {user?.name}</span>
                                    <button onClick={handleLogout} className="flex items-center space-x-1 text-red-600 hover:text-red-700">
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;