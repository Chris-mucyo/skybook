import express from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { User } from '../models/User.model';
import { Reservation } from '../models/Reservation.model';
import { Flight } from '../models/Flight.model';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalFlights = await Flight.countDocuments();
        const totalReservations = await Reservation.countDocuments();
        const totalRevenue = await Reservation.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalFlights,
                totalReservations,
                totalRevenue: totalRevenue[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/reservations', async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate('user', 'name email')
            .populate('flight');
        res.json({ success: true, reservations });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;