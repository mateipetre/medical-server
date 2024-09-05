class Search {
    constructor(searchString, fields) {
      if (typeof searchString !== 'string') {
        throw new Error('searchString must be a string');
      }
      if (!Array.isArray(fields)) {
        throw new Error('fields must be an array of strings');
      }
      this.searchString = searchString;
      this.fields = fields;
    }
  }
  
  export default Search;
  