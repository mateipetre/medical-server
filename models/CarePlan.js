import { Schema, model } from 'mongoose';

function getCurrentDateFormatted() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(today.getDate()).padStart(2, '0');
  
  return new Date(`${year}-${month}-${day}`);
}

const formattedDate = getCurrentDateFormatted();

const carePlanSchema = new Schema({
  creationDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  updateDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  name: { type: String, default: null, required: true },
  purpose: { type: String, default: null, required: true },
  patientName: { type: String, enum: ['Ion Popescu', 'Maria Ionescu', 'Andrei Georgescu', 'Elena Dumitrescu', 'Petre Matei'], default: 'Petre Matei', required: true },
  patientCondition: { type: String, default: null, required: true },
  type: { type: String, enum: ['Permanent', 'Temporary'], default: 'Permanent', required: true },
  pdfDocument: { type: String, default: null, required: false },
});

const CarePlan = model('CarePlan', carePlanSchema);

export default CarePlan;
