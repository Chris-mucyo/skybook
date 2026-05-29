import { Link } from 'react-router-dom';
import { Search, CreditCard, Ticket, Shield } from 'lucide-react';

const HomePage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center text-white px-4">
                <h1 className="text-6xl font-bold mb-4 animate-fade-in">
                    Fly with SkyBook
                </h1>
                <p className="text-xl mb-8">Book your next adventure in seconds</p>

                <Link to="/search" className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition inline-block mb-16">
                    Search Flights →
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
                        <Search className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                        <h3 className="text-xl font-semibold mb-2">Search Flights</h3>
                        <p className="text-gray-200">Find the best flights to your destination</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
                        <CreditCard className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                        <h3 className="text-xl font-semibold mb-2">Pay Securely</h3>
                        <p className="text-gray-200">Multiple payment options available</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
                        <Ticket className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                        <h3 className="text-xl font-semibold mb-2">Get e-Ticket</h3>
                        <p className="text-gray-200">Instant confirmation and tickets</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
                        <Shield className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                        <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                        <p className="text-gray-200">We're here to help you anytime</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;