import { relationalDb } from '../dbconfig.js';
import generateCode from '../util/generateCode.js';
import Repository from './Repository.js';

/**
 * Repository class for handling Lab documents.
 */
class LabRepository extends Repository {
  /**
   * Creates an instance of LabRepository.
   */
  constructor() {
    super('lab', relationalDb); // Ensure MongoClient.db is the MongoDB database instance
  }

  /**
   * Searches for labs based on the given container.
   * 
   * @param {Object} container - The search container.
   * @param {string} container.text - The text to search for.
   * @param {'requested' | 'completed' | 'canceled' | 'all'} container.status - The status filter.
   * @param {SortRequest} container.defaultSortRequest - The sorting request.
   * @returns {Promise<Lab[]>} - The list of labs matching the search criteria.
   */
  async search(container) {
    const searchValue = new RegExp(container.text, 'i');
    const selector = {
      $and: [
        {
          $or: [
            { 'data.type': searchValue },
            { 'data.code': searchValue },
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
   * Saves a new lab entity, generating a new code for it.
   * 
   * @param {Lab} entity - The lab entity to save.
   * @returns {Promise<Lab>} - The saved lab entity.
   */
  async save(entity) {
    entity.code = generateCode('L');
    const result = await this.db.collection(this.type).insertOne(entity);
    return result.ops[0]; // Assuming `result.ops[0]` contains the inserted document
  }

  /**
   * Finds all labs associated with a specific patient ID.
   * 
   * @param {string} patientId - The patient ID to filter by.
   * @returns {Promise<Lab[]>} - The list of labs associated with the patient.
   */
  async findAllByPatientId(patientId) {
    const selector = {
      'data.patientId': patientId,
    };
    return this.db.collection(this.type).find(selector).toArray();
  }
}

const labRepository = new LabRepository();

export default labRepository;
