import mongoose from 'mongoose';

export interface IReservation extends mongoose.Document {
    user: mongoose.Types.ObjectId;
    flight: mongoose.Types.ObjectId;
    seatNumber: string;
    passengerName: string;
    passengerEmail: string;
    passengerPhone: string;
    bookingDate: Date;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    totalAmount: number;
    bookingReference: string;
}

const reservationSchema = new mongoose.Schema<IReservation>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
    seatNumber: { type: String, required: true },
    passengerName: { type: String, required: true },
    passengerEmail: { type: String, required: true },
    passengerPhone: { type: String, required: true },
    bookingDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    totalAmount: { type: Number, required: true },
    bookingReference: { type: String, required: true, unique: true }
});

export const Reservation = mongoose.model<IReservation>('Reservation', reservationSchema);