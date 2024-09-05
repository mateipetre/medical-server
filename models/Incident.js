import { Schema, model } from 'mongoose';

function getCurrentDateFormatted() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(today.getDate()).padStart(2, '0');
  
  return new Date(`${year}-${month}-${day}`);
}

const formattedDate = getCurrentDateFormatted();

const incidentSchema = new Schema({
  creationDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  updateDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  name: { type: String, default: null, required: true },
  type: { type: String, enum: ['data breach', 'misdiagnosis', 'unauthorized access', 'system outage', 'other'], default: 'other', required: true },
  description: { type: String, default: null, required: true },
  severityLevel: { type: String, enum: ['minor', 'medium', 'critical'], default: 'minor', required: true },
  cause: { type: String, enum: ['malfunction', 'human error', 'cyberattack', 'procedural failures'], default: 'malfunction', required: true },
  status: { type: String, enum: ['waiting_for_resolution', 'unresolved', 'resolved', 'waiting_for_response'], default: 'waiting_for_resolution', required: true },
});

const Incident = model('Incident', incidentSchema);

export default Incident;
