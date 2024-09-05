import { Schema, model } from 'mongoose';

function getCurrentDateFormatted() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(today.getDate()).padStart(2, '0');
  
  return new Date(`${year}-${month}-${day}`);
}

const formattedDate = getCurrentDateFormatted();

const careGoalSchema = new Schema({
  creationDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  updateDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  name: { type: String, default: null, required: true },
  description: { type: String, default: null, required: true },
  duration: { type: String, enum: ['Few Days', 'Few Weeks', 'Few Months', 'Few Years', 'Permanent'], default: 'Permanent', required: true },
  type: { type: String, enum: ['Prevention', 'Treatment'], default: 'Treatment', required: true },
  status: { type: String, enum: ['On-going', 'Stopped', 'On-pause'], default: 'On-going', required: true },
});

const CareGoal = model('CareGoal', careGoalSchema);

export default CareGoal;
