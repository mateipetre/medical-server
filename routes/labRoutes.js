import express from 'express';
import LabController from '../controllers/LabController.js';

const router = express.Router();

// Route to search labs
router.get('/search', LabController.search);

// Route to create a new lab
router.post('/', LabController.create);

// Route to find labs by patient ID
router.get('/patient/:patientId', LabController.findAllByPatientId);

// Route to get a lab by ID
router.get('/:id', LabController.findById);

// Route to update a lab by ID
router.put('/:id', LabController.update);

// Route to delete a lab by ID
router.delete('/:id', LabController.delete);

export default router;