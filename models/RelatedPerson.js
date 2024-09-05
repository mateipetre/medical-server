import { Schema, model } from 'mongoose';

function getCurrentDateFormatted() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(today.getDate()).padStart(2, '0');
  
  return new Date(`${year}-${month}-${day}`);
}

const formattedDate = getCurrentDateFormatted();

const relatedPersonSchema = new Schema({
  creationDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  updateDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  firstName: { type: String, default: null, required: true },
  lastName: { type: String, default: null, required: true },
  relation: { type: String, default: null, required: true },
  patientName: { type: String, enum: ['Ion Popescu', 'Maria Ionescu', 'Andrei Georgescu', 'Elena Dumitrescu', 'Petre Matei'], default: 'Petre Matei', required: true },
  bloodRelative: { type: String, enum: ['Yes', 'No', 'Not Known'], default: 'Not Known', required: true },
  email: { type: String, default: null, unique: true, required: true },
  phoneNumber: { type: String, default: null, required: true },
  principalLanguage: { type: String, default: null, required: true },
  bloodType: { type: String, enum: ['O', 'A', 'B', 'AB'], default:'O', required: true },
  bloodRh: { type: String, enum: ['Positive', 'Negative'], default:'Positive', required: true },
});

const RelatedPerson = model('RelatedPerson', relatedPersonSchema);

export default RelatedPerson;