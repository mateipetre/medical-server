import appointmentRepositoryInstance from '../repositories/AppointmentRepository.js';

class AppointmentController {
  constructor() {
    this.appointmentRepository = appointmentRepositoryInstance;
  }

  // Method to handle searching patient appointments (already exists)
  async searchPatientAppointments(req, res) {
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
      const results = await this.appointmentRepository.search(container);
      return res.status(200).json(results);
    } catch (error) {
      console.error('Error searching appointments:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to handle creating a new appointment
  async createAppointment(req, res) {
    const appointmentData = req.body;

    if (!appointmentData) {
      return res.status(400).json({ message: 'Appointment data is required' });
    }

    try {
      const createdAppointment = await this.appointmentRepository.save(appointmentData);
      return res.status(201).json(createdAppointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to handle getting an appointment by ID
  async getAppointmentById(req, res) {
    const { id } = req.params;

    try {
      const appointment = await this.appointmentRepository.find(id);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      return res.status(200).json(appointment);
    } catch (error) {
      console.error('Error getting appointment by ID:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to handle updating an existing appointment
  async updateAppointment(req, res) {
    const { id } = req.params;
    const updatedData = req.body;

    try {
      const updatedAppointment = await this.appointmentRepository.saveOrUpdate({
        ...updatedData,
        id,
      });
      return res.status(200).json(updatedAppointment);
    } catch (error) {
      console.error('Error updating appointment:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method to handle deleting an appointment
  async deleteAppointment(req, res) {
    const { id } = req.params;

    try {
      const deletedAppointment = await this.appointmentRepository.delete({ id });
      return res.status(200).json(deletedAppointment);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new AppointmentController();