import { Schema, model } from 'mongoose';

function getCurrentDateFormatted() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(today.getDate()).padStart(2, '0');
  
  return new Date(`${year}-${month}-${day}`);
}

const formattedDate = getCurrentDateFormatted();

const medicationSchema = new Schema({
  creationDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  updateDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  name: { type: String, default: null, required: true },
  dose: { type: String, default: null, required: true },
  frequency: { type: String, default: null, required: true },
  quantity: { type: String, default: null, required: true },
  type: { type: String, enum: ['allergy', 'disease', 'wellness'], default: 'disease', required: true },
  condition: { type: String, default: null, required: true },
  provider: { type: String, enum: ['Cardiologist - Andrei Dumitru', 'Dermatologist - Elena Ionescu', 'Oncologist - Ioan Popescu', 'General practitioner - Alex Matei', 'Endocrinologist - Maria Popescu'], default: 'General practitioner - Alex Matei', required: true },
  status: { type: String, enum: ['on-going', 'on-pause', 'cancelled'], default: 'on-going', required: true },
});

const Medication = model('Medication', medicationSchema);

export default Medication;