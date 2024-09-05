import { Schema, model } from 'mongoose';

function getCurrentDateFormatted() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(today.getDate()).padStart(2, '0');
  
  return new Date(`${year}-${month}-${day}`);
}

const formattedDate = getCurrentDateFormatted();

const BLOOD_TYPE_ENUM = {
  O_PLUS: 'O+',
  O_MINUS: 'O-',
  A_PLUS: 'A+',
  A_MINUS: 'A-',
  B_PLUS: 'B+',
  B_MINUS: 'B-',
  AB_PLUS: 'AB+',
  AB_MINUS: 'AB-',
};

const patientSchema = new Schema({
  creationDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  updateDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  firstName: { type: String, default: null, required: true },
  lastName: { type: String, default: null, required: true },
  username: { type: String, default: null, unique: true, required: true },
  birthDate: { type: Date, default: null, required: true },
  occupation: { type: String, enum: ['Employed Student', 'Unemployed Student'], default: 'Unemployed Student', required: true },
  email: { type: String, default: null, unique: true, required: true },
  phoneNumber: { type: String, default: null, required: true },
  bloodType: { type: String, enum: Object.values(BLOOD_TYPE_ENUM), default: 'O+', required: true },
  principalLanguage: { type: String, default: null, required: true },
  height: { type: Number, default: null, required: true },
  weight: { type: Number, default: null, required: true },
  lastBloodPressureSystolic: { type: Number, default: null, required: true },
  lastBloodPressureDiastolic: { type: Number, default: null, required: true },
  smokingStatus: { type: String, enum: ['Smoker', 'None'], default: 'None', required: true },
  allergies: [{ type: Schema.Types.ObjectId, ref: 'Allergy', required: false }],
  diagnoses: [{ type: Schema.Types.ObjectId, ref: 'Diagnosis', required: false }],
  medications: [{ type: Schema.Types.ObjectId, ref: 'Medication', required: false }],
  appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment', required: false }],
  careGoals: [{ type: Schema.Types.ObjectId, ref: 'CareGoal', required: false }],
  incidents: [{ type: Schema.Types.ObjectId, ref: 'Incident', required: false }],
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note', required: false }],
});

const Patient = model('Patient', patientSchema);

export default Patient;