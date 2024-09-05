import { Schema, model } from 'mongoose';

function getCurrentDateFormatted() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(today.getDate()).padStart(2, '0');
  
  return new Date(`${year}-${month}-${day}`);
}

const formattedDate = getCurrentDateFormatted();

const allergySchema = new Schema({
  creationDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  updateDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  type: { type: String, enum: ['Medication', 'Food', 'Environmental', 'Skin'], default: 'Environmental', required: true },
  severityLevel: { type: String, enum: ['Severe', 'Moderate', 'Mild'], default: 'Mild', required: true },
  trigger: { type: String, required: true },
  manifestation: { type: String, default: null, required: true },
  onset: { type: String, enum: ['Immediate', 'Delayed'], default: 'Delayed', required: true },
  genetic: { type: String, enum: ['Yes', 'No', 'Not Known'], default: 'Not Known', required: true },
});

const Allergy = model('Allergy', allergySchema);

export default Allergy;
