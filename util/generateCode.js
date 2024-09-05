import { v4 as uuidv4 } from 'uuid';

// Function to generate a unique code with a prefix
const generateCode = (prefix) => {
  const id = uuidv4().split('-')[0];
  return `${prefix}-${id}`;
};

export default generateCode;