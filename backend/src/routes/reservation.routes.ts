import express from 'express';
import { createReservation, getUserReservations, cancelReservation, processPayment, getReservationById } from '../controllers/reservation.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/:id', protect, getReservationById);
router.post('/', protect, createReservation);
router.get('/my-bookings', protect, getUserReservations);
router.put('/:id/cancel', protect, cancelReservation);
router.post('/payment', protect, processPayment);

export default router;