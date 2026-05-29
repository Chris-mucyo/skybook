import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';

const BookingDetails = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState<any>(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/reservations/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setBooking(response.data.reservation);
            } catch (error) {
                console.error('Failed to load booking');
            }
        };
        fetchBooking();
    }, [id]);

    if (!booking) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white text-center">
                    <h1 className="text-2xl font-bold">Electronic Ticket</h1>
                    <p className="text-sm opacity-90">Booking Reference: {booking.bookingReference}</p>
                </div>

                <div className="p-6">
                    <div className="flex justify-center mb-6">
                        <QRCodeSVG value={booking.bookingReference} size={150} />
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Passenger Name</p>
                                <p className="font-semibold">{booking.passengerName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Flight Number</p>
                                <p className="font-semibold">{booking.flight.flightNumber}</p>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500">From</p>
                                    <p className="text-xl font-bold">{booking.flight.from}</p>
                                    <p className="text-sm">{new Date(booking.flight.departureDate).toLocaleDateString()}</p>
                                    <p className="text-lg">{booking.flight.departureTime}</p>
                                </div>
                                <div className="text-2xl">→</div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">To</p>
                                    <p className="text-xl font-bold">{booking.flight.to}</p>
                                    <p className="text-sm">{new Date(booking.flight.arrivalDate).toLocaleDateString()}</p>
                                    <p className="text-lg">{booking.flight.arrivalTime}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Seat Number</span>
                                <span className="font-bold text-lg">{booking.seatNumber}</span>
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-gray-600">Total Amount</span>
                                <span className="font-bold text-green-600">${booking.totalAmount}</span>
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-gray-600">Status</span>
                                <span className={`font-semibold ${
                                    booking.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'
                                }`}>
                  {booking.status.toUpperCase()}
                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => window.print()}
                        className="btn-primary w-full mt-6"
                    >
                        Download / Print Ticket
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;