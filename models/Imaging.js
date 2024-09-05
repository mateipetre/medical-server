import { Schema, model } from 'mongoose';

function getCurrentDateFormatted() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(today.getDate()).padStart(2, '0');
  
  return new Date(`${year}-${month}-${day}`);
}

const formattedDate = getCurrentDateFormatted();

const imagingSchema = new Schema({
  creationDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  updateDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  name: { type: String, default: null, required: true },
  type: { type: String, enum: ['radiography', 'computed tomography', 'fluoroscopy'], default: 'radiography', required: true },
  conditionSuspicion: { type: String, default: null, required: true },
  code: { type: String, default: null, required: true },
  patientName: { type: String, enum: ['Ion Popescu', 'Maria Ionescu', 'Andrei Georgescu', 'Elena Dumitrescu', 'Petre Matei'], default: 'Petre Matei', required: true },
  image: { type: String, default: '/images/spinal-x-ray.jpg', required: false },
  status: { type: String, enum: ['Done', 'Need Result'], default: 'Need Result', required: true },
});

const Imaging = model('Imaging', imagingSchema);

export default Imaging;