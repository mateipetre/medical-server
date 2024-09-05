import express from 'express';
import PatientController from '../controllers/PatientController.js';

const router = express.Router();

// Route to search patients
router.get('/search', PatientController.search);

// Route to create a new patient
router.post('/', PatientController.save);

// Route to find a patient by ID
router.get('/:patientId', PatientController.findById);

// Route to update a patient
router.put('/:patientId', PatientController.update);

// Route to delete a patient
router.delete('/:patientId', PatientController.delete);

// Route to get appointments of a patient
router.get('/:patientId/appointments', PatientController.getAppointments);

// Route to get labs of a patient
router.get('/:patientId/labs', PatientController.getLabs);

// Route to get medications of a patient
router.get('/:patientId/medications', PatientController.getMedications);

// Route to get notes of a patient
router.get('/:patientId/notes', PatientController.getNotes);

// Route to get a specific note for a patient
router.get('/:patientId/notes/:noteId', PatientController.getNote);

// Route to get related persons of a patient
router.get('/:patientId/related-persons', PatientController.getRelatedPersons);

// Route to get visits of a patient
router.get('/:patientId/visits', PatientController.getVisits);

// Route to remove a related person
router.delete('/:patientId/related-persons/:relatedPersonId', PatientController.removeRelatedPerson);

// Route to add a visit
router.post('/:patientId/visits', PatientController.addVisit);

router.get('/count', PatientController.getCount);

export default router;