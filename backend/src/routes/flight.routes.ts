import express from 'express';
import { searchFlights, getFlightById, createFlight, updateFlight, deleteFlight } from '../controllers/flight.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/search', searchFlights);
router.get('/:id', getFlightById);
router.post('/', protect, adminOnly, createFlight);
router.put('/:id', protect, adminOnly, updateFlight);
router.delete('/:id', protect, adminOnly, deleteFlight);

export default router;