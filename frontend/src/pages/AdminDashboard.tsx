import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Users, Plane, Ticket, DollarSign } from 'lucide-react';
import AdminFlightManager from '../components/AdminFlightManager';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalFlights: 0,
        totalReservations: 0,
        totalRevenue: 0
    });
    const [flights, setFlights] = useState([]);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        fetchStats();
        fetchFlights();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data.stats);
        } catch (error) {
            toast.error('Failed to load stats');
        }
    };

    const fetchFlights = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/flights/search');
            setFlights(response.data.flights);
        } catch (error) {
            console.error('Failed to load flights');
        }
    };

    const StatCard = ({ title, value, icon: Icon, color }: any) => (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">{title}</p>
                    <p className="text-3xl font-bold text-gray-800">{value}</p>
                </div>
                <div className={`p-3 rounded-full bg-${color}-100`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="blue" />
                    <StatCard title="Total Flights" value={stats.totalFlights} icon={Plane} color="green" />
                    <StatCard title="Bookings" value={stats.totalReservations} icon={Ticket} color="purple" />
                    <StatCard title="Revenue" value={`$${stats.totalRevenue}`} icon={DollarSign} color="yellow" />
                </div>

                <div className="mt-8">
                    <AdminFlightManager />
                </div>

                {/* Recent Flights */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Flights</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Flight</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departure</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seats</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {flights.slice(0, 5).map((flight: any) => (
                                <tr key={flight._id}>
                                    <td className="px-6 py-4">{flight.airline} {flight.flightNumber}</td>
                                    <td className="px-6 py-4">{flight.from} → {flight.to}</td>
                                    <td className="px-6 py-4">{new Date(flight.departureDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{flight.availableSeats}/{flight.totalSeats}</td>
                                    <td className="px-6 py-4">${flight.price}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;