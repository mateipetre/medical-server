import express from 'express';
import IncidentController from '../controllers/IncidentController.js';

const router = express.Router();

// Route to search incidents
router.get('/search', IncidentController.search);

// Route to fetch an incident by ID
router.get('/:id', IncidentController.find);

// Route to create a new incident
router.post('/', IncidentController.create);

// Route to update an existing incident by ID
router.put('/:id', IncidentController.update);

// Route to delete an incident by ID
router.delete('/:id', IncidentController.delete);

// Route to export incidents as CSV
router.get('/export/csv', IncidentController.exportAsCSV);

export default router;