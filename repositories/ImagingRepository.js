import { relationalDb } from '../dbconfig.js';
import generateCode from '../util/generateCode.js';
import Repository from './Repository.js';

/**
 * @typedef {Object} SearchContainer
 * @property {string} text - The search text.
 * @property {'requested' | 'completed' | 'canceled' | 'all'} status - The status filter.
 * @property {SortRequest} defaultSortRequest - The default sort request.
 */

class ImagingRepository extends Repository {
  /**
   * Creates an instance of ImagingRepository.
   */
  constructor() {
    super('imaging', relationalDb);
  }

  /**
   * Searches for imaging records based on the provided container.
   * 
   * @param {SearchContainer} container - The search container.
   * @returns {Promise<Imaging[]>} - The search results.
   */
  async search(container) {
    const searchValue = new RegExp(container.text, 'i');
    const query = {
      $and: [
        {
          $or: [
            { 'type': searchValue },
            { 'code': searchValue },
          ],
        },
        ...(container.status !== 'all' ? [{ 'status': container.status }] : []),
      ],
    };

    const sort = container.defaultSortRequest.sorts.reduce((acc, sort) => {
      acc[`data.${sort.field}`] = sort.direction === 'asc' ? 1 : -1;
      return acc;
    }, {});

    return super.search({
      query,
      sort,
    });
  }

  /**
   * Saves an imaging record, assigning a generated code.
   * 
   * @param {Imaging} entity - The imaging record to save.
   * @returns {Promise<Imaging>} - The saved imaging record.
   */
  async save(entity) {
    const imagingCode = generateCode('I');
    entity.code = imagingCode;
    return super.save(entity);
  }
}

const imagingRepositoryInstance = new ImagingRepository();

export default imagingRepositoryInstance;