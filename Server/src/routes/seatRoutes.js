import {Router} from 'express';
import { createSeat , getSeatsByEvent , getEventSeats} from '../controllers/seatController.js';


const seatRoute= Router();
seatRoute.post('/events/:eventId/seats', createSeat);
seatRoute.get('/events/:eventId/seats', getSeatsByEvent);
seatRoute.get('/events/:eventId/seats', getEventSeats);
export default  seatRoute;