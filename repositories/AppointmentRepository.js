import escapeStringRegexp from 'escape-string-regexp';
import { relationalDb } from '../dbconfig.js';
import Repository from './Repository.js';

class AppointmentRepository extends Repository {
  constructor() {
    super('appointment', relationalDb);
  }

  async searchPatientAppointments(patientId, text) {
    const escapedString = escapeStringRegexp(text);
    const collection = this.db.collection(this.pluralType);

    const regex = new RegExp(escapedString, 'i');
    const entities = await collection.find({
      $and: [
        { 'data.patient': patientId },
        {
          $or: [
            { 'data.location': { $regex: regex } },
            { 'data.reason': { $regex: regex } },
            { 'data.type': { $regex: regex } }
          ]
        }
      ]
    }).toArray();

    return entities;
  }
}

export default AppointmentRepository;
