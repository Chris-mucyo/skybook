import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, XCircle, Download, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

interface Booking {
    _id: string;
    bookingReference: string;
    flight: {
        _id: string;
        airline: string;
        flightNumber: string;
        from: string;
        to: string;
        departureDate: string;
        departureTime: string;
        arrivalTime: string;
        duration: string;
        price: number;
    };
    passengerName: string;
    passengerEmail: string;
    passengerPhone: string;
    seatNumber: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    totalAmount: number;
    bookingDate: string;
}

const Dashboard = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/reservations/my-bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(response.data.reservations);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
            toast.error('Failed to load your bookings');
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id: string) => {
        if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/reservations/${id}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Booking cancelled successfully');
            fetchBookings(); // Refresh the list
        } catch (error) {
            toast.error('Failed to cancel booking');
        }
    };

    const processPayment = async (reservationId: string) => {
        try {
            await axios.post('http://localhost:5000/api/reservations/payment', {
                reservationId,
                paymentMethod: 'credit_card'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Payment processed successfully!');
            fetchBookings();
        } catch (error) {
            toast.error('Payment failed. Please try again.');
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-700';
            case 'cancelled':
                return 'bg-red-100 text-red-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'completed':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
            <div className="text-white text-xl">Loading your bookings...</div>
        </div>
    );
    }

    return (
        <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">My Bookings</h1>
    <p className="text-gray-200">Manage your flight reservations</p>
    </div>

    {bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-2xl p-12 text-center">
        <div className="mb-6">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
        <Calendar className="w-12 h-12 text-blue-600" />
            </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Yet</h3>
    <p className="text-gray-600 mb-6">You haven't made any flight reservations yet.</p>
    <Link to="/search" className="btn-primary inline-block">
        Search for Flights →
        </Link>
        </div>
    ) : (
        <div className="space-y-6">
            {bookings.map((booking) => (
                    <div key={booking._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
                <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <span className="text-sm text-gray-500">Booking Reference</span>
            <p className="font-mono text-lg font-bold text-blue-600">{booking.bookingReference}</p>
        </div>
        <div className="flex gap-2">
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(booking.status)}`}>
        {booking.status.toUpperCase()}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
        booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
    }`}>
        {booking.paymentStatus.toUpperCase()}
        </span>
        </div>
        </div>
        </div>

        {/* Flight Info */}
        <div className="p-6">
        <div className="flex justify-between items-start flex-wrap gap-6">
        <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
        <span className="text-blue-600 font-bold text-lg">✈</span>
    </div>
    <div>
    <p className="text-sm text-gray-500">Airline & Flight</p>
        <p className="font-bold text-lg text-gray-800">{booking.flight.airline}</p>
        <p className="text-gray-600">{booking.flight.flightNumber}</p>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
    <div className="flex items-start gap-3">
    <MapPin className="w-5 h-5 text-blue-600 mt-1" />
    <div>
        <p className="text-sm text-gray-500">Departure</p>
        <p className="font-semibold text-gray-800">{booking.flight.from}</p>
        <p className="text-sm text-gray-600">
        {new Date(booking.flight.departureDate).toLocaleDateString()} at {booking.flight.departureTime}
        </p>
        </div>
        </div>

        <div className="flex items-start gap-3">
    <MapPin className="w-5 h-5 text-red-600 mt-1" />
    <div>
        <p className="text-sm text-gray-500">Arrival</p>
        <p className="font-semibold text-gray-800">{booking.flight.to}</p>
        <p className="text-sm text-gray-600">
        {new Date(booking.flight.departureDate).toLocaleDateString()} at {booking.flight.arrivalTime}
        </p>
        </div>
        </div>

        <div className="flex items-start gap-3">
    <Clock className="w-5 h-5 text-gray-600 mt-1" />
    <div>
        <p className="text-sm text-gray-500">Duration</p>
        <p className="font-semibold text-gray-800">{booking.flight.duration}</p>
        <p className="text-sm text-gray-600">Seat: {booking.seatNumber}</p>
    </div>
    </div>
    </div>
    </div>

    <div className="text-right">
    <p className="text-sm text-gray-500">Total Amount</p>
    <p className="text-3xl font-bold text-green-600">${booking.totalAmount}</p>
    <p className="text-sm text-gray-500 mt-2">Booked on {new Date(booking.bookingDate).toLocaleDateString()}</p>
    </div>
    </div>

        {/* Actions */}
        <div className="border-t mt-6 pt-6 flex flex-wrap gap-3 justify-end">
            {booking.paymentStatus === 'pending' && booking.status !== 'cancelled' && (
                    <button
                        onClick={() => processPayment(booking._id)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
        <CreditCard className="w-4 h-4" />
            Complete Payment
    </button>
    )}

        {booking.status === 'confirmed' && (
            <Link
                to={`/booking/${booking._id}`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
            <Download className="w-4 h-4" />
                View / Print Ticket
        </Link>
        )}

        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <button
                onClick={() => cancelBooking(booking._id)}
            className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
            >
            <XCircle className="w-4 h-4" />
                Cancel Booking
        </button>
        )}
        </div>
        </div>
        </div>
    ))}
        </div>
    )}
    </div>
);
};

export default Dashboard;