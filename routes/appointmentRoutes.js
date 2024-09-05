import express from 'express';
import AppointmentController from '../controllers/AppointmentController.js';

const router = express.Router();

// Route to search patient appointments (existing route)
router.get('/search', AppointmentController.searchPatientAppointments);

// Route to create a new appointment
router.post('/', AppointmentController.createAppointment);

// Route to get a specific appointment by ID
router.get('/:id', AppointmentController.getAppointmentById);

// Route to update an existing appointment by ID
router.put('/:id', AppointmentController.updateAppointment);

// Route to delete an appointment by ID
router.delete('/:id', AppointmentController.deleteAppointment);

export default router;