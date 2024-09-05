import incidentRepositoryInstance from '../repositories/IncidentRepository.js';
import { Parser } from 'json2csv';
import format from 'date-fns/format';

class IncidentController {
  constructor() {
    this.incidentRepository = incidentRepositoryInstance;
  }

  // Method to search incidents (already implemented)
  async search(req, res) {
    const { status } = req.query;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    try {
      const results = await this.incidentRepository.search({ status });
      return res.status(200).json(results);
    } catch (error) {
      console.error('Error searching incidents:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to fetch an incident by ID (already implemented)
  async find(req, res) {
    const { id } = req.params;

    try {
      const incident = await this.incidentRepository.find(id);
      if (!incident) {
        return res.status(404).json({ message: 'Incident not found' });
      }
      return res.status(200).json(incident);
    } catch (error) {
      console.error('Error fetching incident:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to create a new incident
  async create(req, res) {
    const incidentData = req.body;

    if (!incidentData) {
      return res.status(400).json({ message: 'Incident data is required' });
    }

    try {
      const newIncident = await this.incidentRepository.save(incidentData);
      return res.status(201).json(newIncident);
    } catch (error) {
      console.error('Error creating incident:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to update an existing incident by ID
  async update(req, res) {
    const { id } = req.params;
    const incidentData = req.body;

    try {
      const updatedIncident = await this.incidentRepository.saveOrUpdate({
        ...incidentData,
        id,
      });
      return res.status(200).json(updatedIncident);
    } catch (error) {
      console.error('Error updating incident:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to delete an incident by ID
  async delete(req, res) {
    const { id } = req.params;

    try {
      const deletedIncident = await this.incidentRepository.delete({ id });
      return res.status(200).json(deletedIncident);
    } catch (error) {
      console.error('Error deleting incident:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to export incidents as CSV
  async exportAsCSV(req, res) {
    const { status } = req.query;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    try {
      const incidents = await this.incidentRepository.search({ status });

      if (incidents.length === 0) {
        return res.status(404).json({ message: 'No incidents found' });
      }

      const fields = ['code', 'date', 'reportedBy', 'reportedOn', 'status'];
      const opts = { fields };

      const parser = new Parser(opts);
      const csv = parser.parse(incidents);

      const filename = `incidents-${format(new Date(), 'yyyy-MM-dd--hh-mma')}.csv`;

      res.header('Content-Type', 'text/csv');
      res.attachment(filename);
      return res.send(csv);
    } catch (error) {
      console.error('Error exporting incidents as CSV:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new IncidentController();