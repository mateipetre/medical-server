import { Schema, model } from 'mongoose';

function getCurrentDateFormatted() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(today.getDate()).padStart(2, '0');
  
  return new Date(`${year}-${month}-${day}`);
}

const formattedDate = getCurrentDateFormatted();

const diagnosisSchema = new Schema({
  creationDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  updateDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  name: { type: String, default: null, required: true },
  type: { type: String, enum: ['Normal', 'Acute', 'Chronic'], default: 'Normal', required: true },
  code: { type: String, default: null, required: true },
  cause: { type: String, default: null, required: true },
  recurrent: { type: String, enum: ['Yes', 'No', 'Not Known'], default: 'Not Known', required: true },
  infectious: { type: String, enum: ['Yes', 'No', 'Not Known'], default: 'Not Known', required: true },
  principalSymptom: { type: String, default: null, required: true },
  doctor: { type: String, enum: ['Cardiologist - Andrei Dumitru', 'Dermatologist - Elena Ionescu', 'Oncologist - Ioan Popescu', 'General practitioner - Alex Matei', 'Endocrinologist - Maria Popescu'], default: 'General practitioner - Alex Matei', required: true },
});

const Diagnosis = model('Diagnosis', diagnosisSchema);

export default Diagnosis;