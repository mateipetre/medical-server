import { Schema, model } from 'mongoose';

function getCurrentDateFormatted() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(today.getDate()).padStart(2, '0');
  
  return new Date(`${year}-${month}-${day}`);
}

const formattedDate = getCurrentDateFormatted();

const labSchema = new Schema({
  creationDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  updateDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  testName: { type: String, default: null, required: true },
  patientName: { type: String, enum: ['Ion Popescu', 'Maria Ionescu', 'Andrei Georgescu', 'Elena Dumitrescu', 'Petre Matei'], default: 'Petre Matei', required: true },
  result: { type: String, default: null, required: true },
  unit: { type: String, default: null, required: true },
  date: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  code: { type: String, default: null, required: true },
  status: { type: String, enum: ['Done', 'Need Result'], default: 'Need Result', required: true },
  recurrent: { type: String, enum: ['Yes', 'No', 'Not Known'], default: 'Not Known', required: true },
});

const Lab = model('Lab', labSchema);

export default Lab;