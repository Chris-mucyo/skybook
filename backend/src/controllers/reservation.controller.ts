import { Request, Response } from 'express';
import { Reservation } from '../models/Reservation.model';
import { Flight } from '../models/Flight.model';

const generateBookingReference = () => {
    return 'SKY' + Math.random().toString(36).substring(2, 10).toUpperCase();
};

export const createReservation = async (req: any, res: Response) => {
    try {
        const { flightId, seatNumber, passengerName, passengerEmail, passengerPhone } = req.body;

        const flight = await Flight.findById(flightId);
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }

        if (flight.availableSeats <= 0) {
            return res.status(400).json({ message: 'No seats available' });
        }

        const bookingReference = generateBookingReference();

        const reservation = await Reservation.create({
            user: req.user.id,
            flight: flightId,
            seatNumber,
            passengerName,
            passengerEmail,
            passengerPhone,
            totalAmount: flight.price,
            bookingReference,
            status: 'pending',
            paymentStatus: 'pending'
        });

        // Decrease available seats
        flight.availableSeats -= 1;
        await flight.save();

        res.status(201).json({ success: true, reservation });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getUserReservations = async (req: any, res: Response) => {
    try {
        const reservations = await Reservation.find({ user: req.user.id })
            .populate('flight')
            .sort({ bookingDate: -1 });
        res.json({ success: true, reservations });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const cancelReservation = async (req: Request, res: Response) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        reservation.status = 'cancelled';
        await reservation.save();

        // Increase available seats back
        const flight = await Flight.findById(reservation.flight);
        if (flight) {
            flight.availableSeats += 1;
            await flight.save();
        }

        res.json({ success: true, message: 'Reservation cancelled' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const processPayment = async (req: Request, res: Response) => {
    try {
        const { reservationId, paymentMethod } = req.body;

        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Mock payment processing
        reservation.paymentStatus = 'paid';
        reservation.status = 'confirmed';
        await reservation.save();

        res.json({
            success: true,
            message: 'Payment successful',
            bookingReference: reservation.bookingReference
        });
    } catch (error) {
        res.status(500).json({ message: 'Payment failed', error });
    }
};