import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

const AdminFlightManager = () => {
    const [flights, setFlights] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFlight, setEditingFlight] = useState<any>(null);
    const [formData, setFormData] = useState({
        flightNumber: '',
        airline: '',
        from: '',
        to: '',
        departureDate: '',
        arrivalDate: '',
        departureTime: '',
        arrivalTime: '',
        duration: '',
        price: 0,
        availableSeats: 0,
        totalSeats: 0
    });

    useEffect(() => {
        fetchFlights();
    }, []);

    const fetchFlights = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/flights/search');
            setFlights(response.data.flights);
        } catch (error) {
            toast.error('Failed to fetch flights');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            if (editingFlight) {
                await axios.put(`http://localhost:5000/api/flights/${editingFlight._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Flight updated successfully');
            } else {
                await axios.post('http://localhost:5000/api/flights', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Flight created successfully');
            }
            setIsModalOpen(false);
            setEditingFlight(null);
            setFormData({
                flightNumber: '', airline: '', from: '', to: '', departureDate: '',
                arrivalDate: '', departureTime: '', arrivalTime: '', duration: '',
                price: 0, availableSeats: 0, totalSeats: 0
            });
            fetchFlights();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure?')) {
            const token = localStorage.getItem('token');
            try {
                await axios.delete(`http://localhost:5000/api/flights/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Flight deleted');
                fetchFlights();
            } catch (error) {
                toast.error('Delete failed');
            }
        }
    };

    const handleEdit = (flight: any) => {
        setEditingFlight(flight);
        setFormData({
            flightNumber: flight.flightNumber,
            airline: flight.airline,
            from: flight.from,
            to: flight.to,
            departureDate: flight.departureDate.split('T')[0],
            arrivalDate: flight.arrivalDate.split('T')[0],
            departureTime: flight.departureTime,
            arrivalTime: flight.arrivalTime,
            duration: flight.duration,
            price: flight.price,
            availableSeats: flight.availableSeats,
            totalSeats: flight.totalSeats
        });
        setIsModalOpen(true);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Flight Management</h2>
                <button
                    onClick={() => {
                        setEditingFlight(null);
                        setFormData({
                            flightNumber: '', airline: '', from: '', to: '', departureDate: '',
                            arrivalDate: '', departureTime: '', arrivalTime: '', duration: '',
                            price: 0, availableSeats: 0, totalSeats: 0
                        });
                        setIsModalOpen(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Flight
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Flight</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seats</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {flights.map(flight => (
                        <tr key={flight._id}>
                            <td className="px-4 py-3">
                                <div className="font-semibold">{flight.airline}</div>
                                <div className="text-sm text-gray-500">{flight.flightNumber}</div>
                            </td>
                            <td className="px-4 py-3">{flight.from} → {flight.to}</td>
                            <td className="px-4 py-3">{new Date(flight.departureDate).toLocaleDateString()}</td>
                            <td className="px-4 py-3">${flight.price}</td>
                            <td className="px-4 py-3">{flight.availableSeats}/{flight.totalSeats}</td>
                            <td className="px-4 py-3">
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(flight)} className="text-blue-600 hover:text-blue-800">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(flight._id)} className="text-red-600 hover:text-red-800">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <h3 className="text-2xl font-bold mb-4">{editingFlight ? 'Edit Flight' : 'Add New Flight'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Flight Number" className="input-field" value={formData.flightNumber}
                                       onChange={e => setFormData({...formData, flightNumber: e.target.value})} required />
                                <input type="text" placeholder="Airline" className="input-field" value={formData.airline}
                                       onChange={e => setFormData({...formData, airline: e.target.value})} required />
                                <input type="text" placeholder="From" className="input-field" value={formData.from}
                                       onChange={e => setFormData({...formData, from: e.target.value})} required />
                                <input type="text" placeholder="To" className="input-field" value={formData.to}
                                       onChange={e => setFormData({...formData, to: e.target.value})} required />
                                <input type="date" className="input-field" value={formData.departureDate}
                                       onChange={e => setFormData({...formData, departureDate: e.target.value})} required />
                                <input type="date" className="input-field" value={formData.arrivalDate}
                                       onChange={e => setFormData({...formData, arrivalDate: e.target.value})} required />
                                <input type="time" placeholder="Departure Time" className="input-field" value={formData.departureTime}
                                       onChange={e => setFormData({...formData, departureTime: e.target.value})} required />
                                <input type="time" placeholder="Arrival Time" className="input-field" value={formData.arrivalTime}
                                       onChange={e => setFormData({...formData, arrivalTime: e.target.value})} required />
                                <input type="text" placeholder="Duration (e.g., 5h 30m)" className="input-field" value={formData.duration}
                                       onChange={e => setFormData({...formData, duration: e.target.value})} required />
                                <input type="number" placeholder="Price" className="input-field" value={formData.price}
                                       onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} required />
                                <input type="number" placeholder="Available Seats" className="input-field" value={formData.availableSeats}
                                       onChange={e => setFormData({...formData, availableSeats: parseInt(e.target.value)})} required />
                                <input type="number" placeholder="Total Seats" className="input-field" value={formData.totalSeats}
                                       onChange={e => setFormData({...formData, totalSeats: parseInt(e.target.value)})} required />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="btn-primary flex-1">Save</button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border rounded-lg">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFlightManager;