import mongoose from 'mongoose';

export interface IFlight extends mongoose.Document {
    flightNumber: string;
    airline: string;
    from: string;
    to: string;
    departureDate: Date;
    arrivalDate: Date;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: number;
    availableSeats: number;
    totalSeats: number;
    status: 'scheduled' | 'delayed' | 'cancelled' | 'completed';
}

const flightSchema = new mongoose.Schema<IFlight>({
    flightNumber: { type: String, required: true, unique: true },
    airline: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    departureDate: { type: Date, required: true },
    arrivalDate: { type: Date, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    totalSeats: { type: Number, required: true },
    status: {
        type: String,
        enum: ['scheduled', 'delayed', 'cancelled', 'completed'],
        default: 'scheduled'
    }
});

export const Flight = mongoose.model<IFlight>('Flight', flightSchema);