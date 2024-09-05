class Sort {
    constructor(field, direction) {
      if (direction !== 'asc' && direction !== 'desc') {
        throw new Error("Direction must be 'asc' or 'desc'");
      }
      this.field = field;
      this.direction = direction;
    }
  }
  
  export default Sort;