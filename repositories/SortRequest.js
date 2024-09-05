const { Sort } = require('./Sort');

class SortRequest {
  constructor() {
    this.sorts = [];
  }

  addSort(field, direction) {
    this.sorts.push(new Sort(field, direction));
  }
}

const Unsorted = new SortRequest();

module.exports = { SortRequest, Unsorted };
