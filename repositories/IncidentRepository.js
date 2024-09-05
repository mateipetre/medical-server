import IncidentFilter from '../util/IncidentFilter.js';
import { relationalDb } from '../dbconfig.js';
import Repository from './Repository.js';

/**
 * Repository class for handling Incident documents.
 */
class IncidentRepository extends Repository {
  /**
   * Creates an instance of IncidentRepository.
   */
  constructor() {
    super('incident', relationalDb);
  }

  /**
   * Searches for incidents based on the given options.
   * 
   * @param {Object} options - The search options.
   * @param {IncidentFilter} options.status - The status filter.
   * @returns {Promise<Incident[]>} - The list of incidents matching the search criteria.
   */
  async search(options) {
    return super.search(IncidentRepository.getSearchCriteria(options));
  }

  /**
   * Generates the search criteria based on the options provided.
   * 
   * @param {Object} options - The search options.
   * @param {IncidentFilter} options.status - The status filter.
   * @returns {Object} - The search criteria for MongoDB.
   */
  static getSearchCriteria(options) {
    const statusFilter =
      options.status !== IncidentFilter.ALL ? { 'data.status': options.status } : {};

    const selector = {
      $and: [statusFilter],
    };

    return {
      selector,
    };
  }
}

const incidentRepository = new IncidentRepository();

export default incidentRepository;