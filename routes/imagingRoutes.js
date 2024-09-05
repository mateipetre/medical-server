import express from 'express';
import ImagingController from '../controllers/ImagingController.js';

const router = express.Router();

// Route to search imaging records
router.get('/search', ImagingController.search);

// Route to save (create) an imaging record
router.post('/save', ImagingController.save);

// Route to get an imaging record by ID
router.get('/:id', ImagingController.getById);

// Route to update an existing imaging record by ID
router.put('/:id', ImagingController.update);

// Route to delete an imaging record by ID
router.delete('/:id', ImagingController.delete);

export default router;