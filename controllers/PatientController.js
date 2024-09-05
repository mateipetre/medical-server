import patientRepository from '../repositories/PatientRepository.js';

class PatientController {
  constructor() {
    this.patientRepository = patientRepository;
  }

  // Method to search patients
  async search(req, res) {
    const { text, defaultSortRequest } = req.query;

    if (!text || !defaultSortRequest) {
      return res.status(400).json({ message: 'Text and defaultSortRequest are required' });
    }

    const container = {
      text,
      defaultSortRequest: JSON.parse(defaultSortRequest),
    };

    try {
      const results = await this.patientRepository.search(container);
      return res.status(200).json(results);
    } catch (error) {
      console.error('Error searching patients:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to save a patient
  async save(req, res) {
    const patient = req.body;

    if (!patient) {
      return res.status(400).json({ message: 'Patient data is required' });
    }

    try {
      const savedPatient = await this.patientRepository.save(patient);
      return res.status(201).json(savedPatient);
    } catch (error) {
      console.error('Error saving patient:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to find a patient by ID
  async findById(req, res) {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    try {
      const patient = await this.patientRepository.find(patientId);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      return res.status(200).json(patient);
    } catch (error) {
      console.error('Error finding patient:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to update a patient
  async update(req, res) {
    const { patientId } = req.params;
    const patientData = req.body;

    if (!patientId || !patientData) {
      return res.status(400).json({ message: 'Patient ID and data are required' });
    }

    try {
      const updatedPatient = await this.patientRepository.saveOrUpdate({ ...patientData, id: patientId });
      return res.status(200).json(updatedPatient);
    } catch (error) {
      console.error('Error updating patient:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to delete a patient
  async delete(req, res) {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    try {
      await this.patientRepository.delete({ id: patientId });
      return res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (error) {
      console.error('Error deleting patient:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to get appointments of a patient
  async getAppointments(req, res) {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    try {
      const appointments = await this.patientRepository.getAppointments(patientId);
      return res.status(200).json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to get labs of a patient
  async getLabs(req, res) {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    try {
      const labs = await this.patientRepository.getLabs(patientId);
      return res.status(200).json(labs);
    } catch (error) {
      console.error('Error fetching labs:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to get medications of a patient
  async getMedications(req, res) {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    try {
      const medications = await this.patientRepository.getMedications(patientId);
      return res.status(200).json(medications);
    } catch (error) {
      console.error('Error fetching medications:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to get notes of a patient
  async getNotes(req, res) {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    try {
      const patient = await this.patientRepository.find(patientId);
      return res.status(200).json(patient.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to get a specific note for a patient
  async getNote(req, res) {
    const { patientId, noteId } = req.params;

    if (!patientId || !noteId) {
      return res.status(400).json({ message: 'Patient ID and Note ID are required' });
    }

    try {
      const note = await this.patientRepository.find(patientId).then(patient => patient.notes.find(n => n.id === noteId));
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
      return res.status(200).json(note);
    } catch (error) {
      console.error('Error fetching note:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to get related persons of a patient
  async getRelatedPersons(req, res) {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    try {
      const patient = await this.patientRepository.find(patientId);
      return res.status(200).json(patient.relatedPersons || []);
    } catch (error) {
      console.error('Error fetching related persons:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to get visits of a patient
  async getVisits(req, res) {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    try {
      const patient = await this.patientRepository.find(patientId);
      return res.status(200).json(patient.visits || []);
    } catch (error) {
      console.error('Error fetching visits:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to remove a related person
  async removeRelatedPerson(req, res) {
    const { patientId, relatedPersonId } = req.params;

    if (!patientId || !relatedPersonId) {
      return res.status(400).json({ message: 'Patient ID and Related Person ID are required' });
    }

    try {
      const patient = await this.patientRepository.find(patientId);
      const updatedRelatedPersons = patient.relatedPersons.filter(person => person.id !== relatedPersonId);
      await this.patientRepository.save({ ...patient, relatedPersons: updatedRelatedPersons });
      return res.status(200).json({ message: 'Related person removed successfully' });
    } catch (error) {
      console.error('Error removing related person:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to add a visit
  async addVisit(req, res) {
    const { patientId } = req.params;
    const visitData = req.body;

    if (!patientId || !visitData) {
      return res.status(400).json({ message: 'Patient ID and visit data are required' });
    }

    try {
      const patient = await this.patientRepository.find(patientId);
      const updatedVisits = [...patient.visits, visitData];
      await this.patientRepository.save({ ...patient, visits: updatedVisits });
      return res.status(201).json(visitData);
    } catch (error) {
      console.error('Error adding visit:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to get the total count of patients
  async getCount(req, res) {
    try {
      const count = await this.patientRepository.count();
      return res.status(200).json({ count });
    } catch (error) {
      console.error('Error fetching patient count:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new PatientController();