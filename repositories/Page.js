import AbstractDBModel from '../models/AbstractDBModel.js';

/**
 * Page class to encapsulate paginated content.
 * W
 * @template T
 */
class Page {
  /**
   * Creates an instance of Page.W
   * 
   * @param {T[]} content - The list of content items.
   * @param {boolean} hasNext - Flag indicating if there is a next page.
   * @param {boolean} hasPrevious - Flag indicating if there is a previous page.
   * @param {PageRequest | undefined} [pageRequest] - The page request details.
   */
  constructor(content, hasNext, hasPrevious, pageRequest) {
    if (!Array.isArray(content) || !content.every(item => item instanceof AbstractDBModel)) {
      throw new Error('content must be an array of AbstractDBModel instances');
    }

    this.content = content;
    this.hasNext = hasNext;
    this.hasPrevious = hasPrevious;
    this.pageRequest = pageRequest || null;
  }
}

export default Page;