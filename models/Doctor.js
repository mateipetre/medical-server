import { Schema, model } from 'mongoose';;

function getCurrentDateFormatted() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(today.getDate()).padStart(2, '0');
  
  return new Date(`${year}-${month}-${day}`);
}

const formattedDate = getCurrentDateFormatted();

const doctorSchema = new Schema({
  creationDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  updateDate: { type: Date, default: new Date(formattedDate), unique: false, required: true },
  firstName: { type: String, default: null, required: true },
  lastName: { type: String, default: null, required: true },
  username: { type: String, default: null, unique: true, required: true },
  email: { type: String, default: null, unique: true, required: true },
  phoneNumber: { type: String, default: null, required: true },
  position: { type: String, default: null, required: true },
  associatedHospital: { type: String, default: null, required: true },
  experience: { type: String, default: null, required: true },
  languages: [ { type: String, default: null, required: true } ],
  specialties: [ { type: String, default: null, required: true } ],
  appointments: [ { type: Schema.Types.ObjectId, ref: 'Appointment', required: false} ],
  patients: [ { type: Schema.Types.ObjectId, ref: 'Patient', required: false} ],
  carePlans: [ { type: Schema.Types.ObjectId, ref: 'CarePlan', required: false} ],
  incidents: [ { type: Schema.Types.ObjectId, ref: 'Incident', required: false} ],
  notes: [ { type: Schema.Types.ObjectId, ref: 'Note', required: false} ],
  labs: [ { type: Schema.Types.ObjectId, ref: 'Lab', required: false} ],
  imagings: [ { type: Schema.Types.ObjectId, ref: 'Imaging', required: false} ],
  relatedPersons: [ { type: Schema.Types.ObjectId, ref: 'RelatedPerson', required: false} ],
});

const Doctor = model('Doctor', doctorSchema);

export default Doctor;
