import { Request, Response } from 'express';
import { Flight } from '../models/Flight.model';

export const searchFlights = async (req: Request, res: Response) => {
    try {
        const { from, to, date } = req.query;

        let query: any = {};
        if (from) query.from = { $regex: new RegExp(from as string, 'i') };
        if (to) query.to = { $regex: new RegExp(to as string, 'i') };
        if (date) {
            const startDate = new Date(date as string);
            const endDate = new Date(date as string);
            endDate.setDate(endDate.getDate() + 1);
            query.departureDate = { $gte: startDate, $lt: endDate };
        }

        const flights = await Flight.find(query);
        res.json({ success: true, count: flights.length, flights });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getFlightById = async (req: Request, res: Response) => {
    try {
        const flight = await Flight.findById(req.params.id);
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        res.json({ success: true, flight });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createFlight = async (req: Request, res: Response) => {
    try {
        const flight = await Flight.create(req.body);
        res.status(201).json({ success: true, flight });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateFlight = async (req: Request, res: Response) => {
    try {
        const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        res.json({ success: true, flight });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteFlight = async (req: Request, res: Response) => {
    try {
        const flight = await Flight.findByIdAndDelete(req.params.id);
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        res.json({ success: true, message: 'Flight deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};