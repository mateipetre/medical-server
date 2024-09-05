import { Schema, model } from 'mongoose';

function getCurrentDateFormatted() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(today.getDate()).padStart(2, '0');
  
  return new Date(`${year}-${month}-${day}`);
}

const formattedDate = getCurrentDateFormatted();

const noteSchema = new Schema({
  creationDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  updateDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  name: { type: String, default: null, required: true },
  type: { type: String, enum: ['Doctor', 'Patient', 'System', 'Other'], default: 'Patient', required: true },
  content: { type: String, default: null, required: true },
});

const Note = model('Note', noteSchema);

export default Note;
