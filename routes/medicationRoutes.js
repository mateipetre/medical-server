import express from 'express';
import MedicationController from '../controllers/MedicationController.js';

const router = express.Router();

// Route to search medications
router.get('/search', MedicationController.search);

// Route to create a new medication
router.post('/', MedicationController.save);

// Route to find a medication by ID
router.get('/:id', MedicationController.findById);

// Route to find medications by patient ID
router.get('/patient/:patientId', MedicationController.findAllByPatientId);

// Route to update a medication by ID
router.put('/:id', MedicationController.update);

// Route to delete a medication by ID
router.delete('/:id', MedicationController.delete);

export default router;