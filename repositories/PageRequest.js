/**
 * PageRequest class to encapsulate pagination request details.
 */
class PageRequest {
    /**
     * Creates an instance of PageRequest.
     * 
     * @param {number | undefined} number - The page number.
     * @param {number | undefined} size - The size of the page.
     * @param {{ [key: string]: string | null } | undefined} nextPageInfo - Information for the next page.
     * @param {{ [key: string]: string | null } | undefined} previousPageInfo - Information for the previous page.
     * @param {'previous' | 'next'} [direction] - The direction of pagination.
     */
    constructor(number, size, nextPageInfo, previousPageInfo, direction) {
      this.number = number;
      this.size = size;
      this.nextPageInfo = nextPageInfo;
      this.previousPageInfo = previousPageInfo;
      this.direction = direction || undefined;
    }
  }
  
  /**
   * UnpagedRequest constant to represent an unpaged request.
   * 
   * @type {PageRequest}
   */
  const UnpagedRequest = new PageRequest(undefined, undefined, undefined, undefined);
  
  module.exports = { PageRequest, UnpagedRequest };
  