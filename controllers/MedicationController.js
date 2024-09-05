import medicationRepository from '../repositories/MedicationRepository.js';

class MedicationController {
  constructor() {
    this.medicationRepository = medicationRepository;
  }

  // Method to handle searching medications
  async search(req, res) {
    const { text, status, defaultSortRequest } = req.query;

    if (!text || !status || !defaultSortRequest) {
      return res.status(400).json({ message: 'Text, status, and defaultSortRequest are required' });
    }

    const container = {
      text,
      status,
      defaultSortRequest: JSON.parse(defaultSortRequest),
    };

    try {
      const results = await this.medicationRepository.search(container);
      return res.status(200).json(results);
    } catch (error) {
      console.error('Error searching medications:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to handle saving a medication
  async save(req, res) {
    const medication = req.body;

    if (!medication) {
      return res.status(400).json({ message: 'Medication data is required' });
    }

    try {
      const savedMedication = await this.medicationRepository.save(medication);
      return res.status(201).json(savedMedication);
    } catch (error) {
      console.error('Error saving medication:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to handle finding a medication by ID
  async findById(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Medication ID is required' });
    }

    try {
      const medication = await this.medicationRepository.find(id);
      if (!medication) {
        return res.status(404).json({ message: 'Medication not found' });
      }
      return res.status(200).json(medication);
    } catch (error) {
      console.error('Error finding medication by ID:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to handle finding medications by patient ID
  async findAllByPatientId(req, res) {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    try {
      const medications = await this.medicationRepository.findAllByPatientId(patientId);
      return res.status(200).json(medications);
    } catch (error) {
      console.error('Error finding medications by patient ID:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to handle updating a medication
  async update(req, res) {
    const { id } = req.params;
    const medicationData = req.body;

    if (!id || !medicationData) {
      return res.status(400).json({ message: 'Medication ID and data are required' });
    }

    try {
      const updatedMedication = await this.medicationRepository.saveOrUpdate({ ...medicationData, id });
      return res.status(200).json(updatedMedication);
    } catch (error) {
      console.error('Error updating medication:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to handle deleting a medication
  async delete(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Medication ID is required' });
    }

    try {
      await this.medicationRepository.delete({ id });
      return res.status(200).json({ message: 'Medication deleted successfully' });
    } catch (error) {
      console.error('Error deleting medication:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new MedicationController();