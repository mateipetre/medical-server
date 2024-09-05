import escapeStringRegexp from 'escape-string-regexp';
import { relationalDb } from '../dbconfig.js';
import Repository from './Repository.js';
import generateCode from '../util/generateCode.js';

/**
 * Repository class for handling Patient documents.
 */
class PatientRepository extends Repository {
  /**
   * Creates an instance of PatientRepository.
   */
  constructor() {
    super('patient', relationalDb);
  }

  onDbReady() {
    this.createIndex();
  }

  async createIndex() {
    if (this.db) {
      await this.db.collection(this.type).createIndex({ 'data.fullName': 1, 'data.code': 1 });
    }
  }

  /**
   * Searches for patients based on the provided text.
   * 
   * @param {string} text - The text to search for.
   * @returns {Promise<Patient[]>} - The list of patients matching the search criteria.
   */
  async search(text) {
    const escapedString = escapeStringRegexp(text);
    const searchValue = new RegExp(escapedString, 'i');

    const selector = {
      $or: [
        { 'data.fullName': searchValue },
        { 'data.code': text },
      ],
    };

    return this.db.collection(this.type).find(selector).toArray();
  }

  /**
   * Saves a new patient entity.
   * 
   * @param {Patient} entity - The patient entity to save.
   * @returns {Promise<Patient>} - The saved patient entity.
   */
  async save(entity) {
    if (!entity.code) {
      entity.code = generateCode('P');
    }
    const result = await this.db.collection(this.type).insertOne(entity);
    return result.ops[0]; // Assuming `result.ops[0]` contains the inserted document
  }

  /**
   * Finds all appointments associated with a specific patient ID.
   * 
   * @param {string} patientId - The patient ID to filter by.
   * @returns {Promise<Appointment[]>} - The list of appointments associated with the patient.
   */
  async getAppointments(patientId) {
    return this.db.collection('appointment').find({ 'data.patientId': patientId }).toArray();
  }

  /**
   * Finds all labs associated with a specific patient ID.
   * 
   * @param {string} patientId - The patient ID to filter by.
   * @returns {Promise<Lab[]>} - The list of labs associated with the patient.
   */
  async getLabs(patientId) {
    return this.db.collection('lab').find({ 'data.patientId': patientId }).toArray();
  }

  /**
   * Finds all medications associated with a specific patient ID.
   * 
   * @param {string} patientId - The patient ID to filter by.
   * @returns {Promise<Medication[]>} - The list of medications associated with the patient.
   */
  async getMedications(patientId) {
    return this.db.collection('medication').find({ 'data.patientId': patientId }).toArray();
  }

  async count() {
    return this.db.collection('patients').countDocuments();
  }
}

const patientRepository = new PatientRepository();

export default patientRepository;
