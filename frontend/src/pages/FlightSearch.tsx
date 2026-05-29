import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

interface Flight {
    _id: string;
    flightNumber: string;
    airline: string;
    from: string;
    to: string;
    departureDate: string;
    arrivalDate: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: number;
    availableSeats: number;
}

const FlightSearch = () => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [searchParams, setSearchParams] = useState({
        from: '',
        to: '',
        date: ''
    });
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
    const [passengerInfo, setPassengerInfo] = useState({
        name: '',
        email: '',
        phone: '',
        seatNumber: ''
    });
    const [showBooking, setShowBooking] = useState(false);

    const searchFlights = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:5000/api/flights/search', { params: searchParams });
            setFlights(response.data.flights);
            if (response.data.flights.length === 0) {
                toast('No flights found', { icon: '✈️' });
            }
        } catch (error) {
            toast.error('Failed to search flights');
        }
    };

    const handleBook = (flight: Flight) => {
        setSelectedFlight(flight);
        setShowBooking(true);
    };

    const confirmBooking = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login first');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/reservations', {
                flightId: selectedFlight?._id,
                seatNumber: passengerInfo.seatNumber || `A${Math.floor(Math.random() * 30) + 1}`,
                passengerName: passengerInfo.name,
                passengerEmail: passengerInfo.email,
                passengerPhone: passengerInfo.phone
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Process payment
            await axios.post('http://localhost:5000/api/reservations/payment', {
                reservationId: response.data.reservation._id,
                paymentMethod: 'credit_card'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Booking confirmed! Check your email.');
            setShowBooking(false);
            setPassengerInfo({ name: '', email: '', phone: '', seatNumber: '' });
            searchFlights({ preventDefault: () => {} } as React.FormEvent);
        } catch (error) {
            toast.error('Booking failed');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Search Form */}
            <div className="bg-white rounded-xl shadow-2xl p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Search Flights</h2>
                <form onSubmit={searchFlights} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-2">From</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="City or Airport"
                                className="input-field pl-10"
                                value={searchParams.from}
                                onChange={e => setSearchParams({ ...searchParams, from: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">To</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Destination"
                                className="input-field pl-10"
                                value={searchParams.to}
                                onChange={e => setSearchParams({ ...searchParams, to: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                type="date"
                                className="input-field pl-10"
                                value={searchParams.date}
                                onChange={e => setSearchParams({ ...searchParams, date: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex items-end">
                        <button type="submit" className="btn-primary w-full">Search Flights</button>
                    </div>
                </form>
            </div>

            {/* Flight Results */}
            {flights.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white mb-4">Available Flights ({flights.length})</h3>
                    {flights.map(flight => (
                        <div key={flight._id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                            <div className="flex justify-between items-center flex-wrap gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-4 mb-3">
                                        <span className="text-2xl font-bold text-blue-600">{flight.airline}</span>
                                        <span className="text-gray-500">{flight.flightNumber}</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Departure</p>
                                            <p className="font-semibold">{flight.departureTime}</p>
                                            <p className="text-gray-600">{flight.from}</p>
                                            <p className="text-sm">{new Date(flight.departureDate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Duration</p>
                                            <p className="font-semibold">{flight.duration}</p>
                                            <Clock className="w-4 h-4 text-gray-400 mt-1" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Arrival</p>
                                            <p className="font-semibold">{flight.arrivalTime}</p>
                                            <p className="text-gray-600">{flight.to}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-green-600">${flight.price}</p>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Users className="w-4 h-4" /> {flight.availableSeats} seats left
                                    </p>
                                    <button
                                        onClick={() => handleBook(flight)}
                                        className="btn-primary mt-3"
                                        disabled={flight.availableSeats === 0}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Booking Modal */}
            {showBooking && selectedFlight && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-2xl font-bold mb-4">Complete Booking</h3>
                        <div className="mb-4 p-3 bg-blue-50 rounded">
                            <p><strong>Flight:</strong> {selectedFlight.airline} {selectedFlight.flightNumber}</p>
                            <p><strong>Route:</strong> {selectedFlight.from} → {selectedFlight.to}</p>
                            <p><strong>Price:</strong> ${selectedFlight.price}</p>
                        </div>

                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="input-field"
                                value={passengerInfo.name}
                                onChange={e => setPassengerInfo({ ...passengerInfo, name: e.target.value })}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="input-field"
                                value={passengerInfo.email}
                                onChange={e => setPassengerInfo({ ...passengerInfo, email: e.target.value })}
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                className="input-field"
                                value={passengerInfo.phone}
                                onChange={e => setPassengerInfo({ ...passengerInfo, phone: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Preferred Seat (e.g., A12)"
                                className="input-field"
                                value={passengerInfo.seatNumber}
                                onChange={e => setPassengerInfo({ ...passengerInfo, seatNumber: e.target.value })}
                            />
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button onClick={confirmBooking} className="btn-primary flex-1">Confirm & Pay</button>
                            <button onClick={() => setShowBooking(false)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlightSearch;