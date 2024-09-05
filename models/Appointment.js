import { Schema, model } from 'mongoose';

function getCurrentDateFormatted() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(today.getDate()).padStart(2, '0');
  
  return new Date(`${year}-${month}-${day}`);
}

const formattedDate = getCurrentDateFormatted();

const appointmentSchema = new Schema({
  creationDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  updateDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  visitType: { type: String, enum: ['Urgent', 'Follow-up', 'New Symptom'], default: 'New Symptom', required: true },
  doctor: { type: String, enum: ['Cardiologist - Andrei Dumitru', 'Dermatologist - Elena Ionescu', 'Oncologist - Ioan Popescu', 'General practitioner - Alex Matei', 'Endocrinologist - Maria Popescu'], required:  false},
  patient: { type: String, enum: ['Ion Popescu', 'Maria Ionescu', 'Andrei Georgescu', 'Elena Dumitrescu', 'Petre Matei'], required:  false},
  date: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  startingHour: { type: String, default: null, required: true },
  duration: { type: Number, enum: [30, 45, 60], default: 30, required: true },
  meetingRoomName: { type: String, default: null, required: true},
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled', 'Done'], default: 'Pending', required: true },
});

const Appointment = model('Appointment', appointmentSchema);

export default Appointment;