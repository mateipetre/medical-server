import imagingRepositoryInstance from '../repositories/ImagingRepository.js';

class ImagingController {
  constructor() {
    this.imagingRepository = imagingRepositoryInstance;
  }

  // Method to handle searching imaging records (already exists)
  async search(req, res) {
    const { text, status, sorts } = req.query;

    if (!text || !status || !sorts) {
      return res.status(400).json({ message: 'Text, status, and sorts are required' });
    }

    const container = {
      text,
      status,
      defaultSortRequest: { sorts: JSON.parse(sorts) },
    };

    try {
      const results = await this.imagingRepository.search(container);
      return res.status(200).json(results);
    } catch (error) {
      console.error('Error searching imaging records:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to handle saving an imaging record (already exists)
  async save(req, res) {
    const entity = req.body;

    if (!entity) {
      return res.status(400).json({ message: 'Entity is required' });
    }

    try {
      const savedEntity = await this.imagingRepository.save(entity);
      return res.status(200).json(savedEntity);
    } catch (error) {
      console.error('Error saving imaging record:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to get an imaging record by ID
  async getById(req, res) {
    const { id } = req.params;

    try {
      const imagingRecord = await this.imagingRepository.find(id);
      if (!imagingRecord) {
        return res.status(404).json({ message: 'Imaging record not found' });
      }
      return res.status(200).json(imagingRecord);
    } catch (error) {
      console.error('Error fetching imaging record by ID:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to update an existing imaging record by ID
  async update(req, res) {
    const { id } = req.params;
    const updatedData = req.body;

    try {
      const updatedRecord = await this.imagingRepository.saveOrUpdate({
        ...updatedData,
        id,
      });
      return res.status(200).json(updatedRecord);
    } catch (error) {
      console.error('Error updating imaging record:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to delete an imaging record by ID
  async delete(req, res) {
    const { id } = req.params;

    try {
      const deletedRecord = await this.imagingRepository.delete({ id });
      return res.status(200).json(deletedRecord);
    } catch (error) {
      console.error('Error deleting imaging record:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new ImagingController();