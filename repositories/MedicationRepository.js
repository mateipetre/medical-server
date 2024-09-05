import { relationalDb } from '../dbconfig.js';
import Repository from './Repository.js';

/**
 * Repository class for handling Medication documents.
 */
class MedicationRepository extends Repository {
  /**
   * Creates an instance of MedicationRepository.
   */
  constructor() {
    super('medication', relationalDb); // Ensure MongoClient.db is the MongoDB database instance
  }

  /**
   * Searches for medications based on the given container.
   * 
   * @param {Object} container - The search container.
   * @param {string} container.text - The text to search for.
   * @param {'requested' | 'completed' | 'canceled' | 'all'} container.status - The status filter.
   * @param {SortRequest} container.defaultSortRequest - The sorting request.
   * @returns {Promise<Medication[]>} - The list of medications matching the search criteria.
   */
  async search(container) {
    const searchValue = new RegExp(container.text, 'i');
    const selector = {
      $and: [
        {
          $or: [
            { 'data.medication': searchValue },
          ],
        },
        ...(container.status !== 'all' ? [{ 'data.status': container.status }] : []),
      ],
    };

    const sort = container.defaultSortRequest.sorts.length > 0
      ? container.defaultSortRequest.sorts.reduce((acc, s) => {
        acc[`data.${s.field}`] = s.direction;
        return acc;
      }, {})
      : {};

    return this.db.collection(this.type).find(selector).sort(sort).toArray();
  }

  /**
   * Saves a new medication entity.
   * 
   * @param {Medication} entity - The medication entity to save.
   * @returns {Promise<Medication>} - The saved medication entity.
   */
  async save(entity) {
    const result = await this.db.collection(this.type).insertOne(entity);
    return result.ops[0]; // Assuming `result.ops[0]` contains the inserted document
  }

  /**
   * Finds all medications associated with a specific patient ID.
   * 
   * @param {string} patientId - The patient ID to filter by.
   * @returns {Promise<Medication[]>} - The list of medications associated with the patient.
   */
  async findAllByPatientId(patientId) {
    const selector = {
      'data.patientId': patientId,
    };
    return this.db.collection(this.type).find(selector).toArray();
  }
}

const medicationRepository = new MedicationRepository();

export default medicationRepository;