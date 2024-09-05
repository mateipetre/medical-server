import labRepositoryInstance from '../repositories/LabRepository.js';

class LabController {
  constructor() {
    this.labRepository = labRepositoryInstance;
  }

  // Method to search labs
  async search(req, res) {
    const { text, status } = req.query;

    try {
      const labs = await this.labRepository.search({ text, status });
      return res.status(200).json(labs);
    } catch (error) {
      console.error('Error searching labs:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to create a new lab
  async create(req, res) {
    const labData = req.body;

    if (!labData) {
      return res.status(400).json({ message: 'Lab data is required' });
    }

    try {
      const newLab = await this.labRepository.save(labData);
      return res.status(201).json(newLab);
    } catch (error) {
      console.error('Error creating lab:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to find labs by patient ID
  async findAllByPatientId(req, res) {
    const { patientId } = req.params;

    try {
      const labs = await this.labRepository.getLabs(patientId);
      return res.status(200).json(labs);
    } catch (error) {
      console.error('Error fetching labs for patient:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to find a lab by ID
  async findById(req, res) {
    const { id } = req.params;

    try {
      const lab = await this.labRepository.find(id);
      if (!lab) {
        return res.status(404).json({ message: 'Lab not found' });
      }
      return res.status(200).json(lab);
    } catch (error) {
      console.error('Error fetching lab by ID:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to update a lab by ID
  async update(req, res) {
    const { id } = req.params;
    const labData = req.body;

    try {
      const updatedLab = await this.labRepository.saveOrUpdate({ ...labData, id });
      return res.status(200).json(updatedLab);
    } catch (error) {
      console.error('Error updating lab:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to delete a lab by ID
  async delete(req, res) {
    const { id } = req.params;

    try {
      const deletedLab = await this.labRepository.delete({ id });
      return res.status(200).json(deletedLab);
    } catch (error) {
      console.error('Error deleting lab:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new LabController();