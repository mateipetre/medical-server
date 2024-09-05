import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import cors from 'cors';
import Patient from './models/Patient.js';
import Allergy from './models/Allergy.js';
import Appointment from './models/Appointment.js';
import Diagnosis from './models/Diagnosis.js'
import CareGoal from './models/CareGoal.js'
import Medication from './models/Medication.js'
import Incident from './models/Incident.js'
import Note from './models/Note.js'
import Doctor from './models/Doctor.js'
import Lab from './models/Lab.js'
import CarePlan from './models/CarePlan.js'
import Imaging from './models/Imaging.js';
import RelatedPerson from './models/RelatedPerson.js';

const app = express();

const clientUrl = 'http://localhost:3000';
const mongoDbUri = 'mongodb+srv://petrematei:parola@cluster0.xqilzh8.mongodb.net/e-health?retryWrites=true&w=majority&appName=Cluster0';

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: clientUrl,
  credentials: true,
}));
app.use(session({ secret: 'HIC-secret-key', resave: false, saveUninitialized: true }));

// MongoDB Connection
mongoose.connect(mongoDbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB - E-HEALTH DATABASE');
}).catch(error => {
  console.error('Error connecting to MongoDB:', error);
});

// Helper function to get the current formatted date
function getCurrentDateFormatted() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(today.getDate()).padStart(2, '0');
  
  return new Date(`${year}-${month}-${day}`);
}

// View All Patients
app.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Server error while fetching patients' });
  }
});

// View a Specific Patient by ID
app.get('/patients/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Server error while fetching patient' });
  }
});

// Endpoint to get the full name of a patient by ID
app.get('/patients/:patientId/fullname', async (req, res) => {
  try {
    const { patientId  } = req.params;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ error: 'Invalid patient ID' });
    }

    // Query the database to find the patient by ID
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Construct the full name
    const fullName = `${patient.firstName} ${patient.lastName}`;

    // Send the full name in the response
    res.json({ fullName: fullName });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: 'An error occurred while retrieving the patient' });
  }
});

// Add a New Patient
app.post('/patients', async (req, res) => {
  try {
    const patientData = req.body;

    const newPatient = new Patient({
      ...patientData,
      creationDate: new Date(),  // Automatically set the creation date
      updateDate: new Date(),    // Automatically set the update date
      allergies: [],             // Initialize as empty arrays
      diagnoses: [],
      medications: [],
      appointments: [],
      careGoals: [],
      incidents: [],
      notes: []
    });

    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    console.error('Error adding new patient:', error);
    res.status(500).json({ message: 'Server error while adding patient' });
  }
});

// Update a Patient
app.put('/patients/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const updatedData = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      {
        ...updatedData,
        updateDate: new Date(), // Automatically set the update date
        $set: {                 // Use $set to ensure only the specified fields are updated
          firstName: updatedData.firstName,
          lastName: updatedData.lastName,
          username: updatedData.username,
          birthDate: updatedData.birthDate,
          occupation: updatedData.occupation,
          email: updatedData.email,
          phoneNumber: updatedData.phoneNumber,
          bloodType: updatedData.bloodType,
          principalLanguage: updatedData.principalLanguage,
          height: updatedData.height,
          weight: updatedData.weight,
          lastBloodPressureSystolic: updatedData.lastBloodPressureSystolic,
          lastBloodPressureDiastolic: updatedData.lastBloodPressureDiastolic,
          smokingStatus: updatedData.smokingStatus,
        }
      },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ message: 'Server error while updating patient' });
  }
});

// Delete a Patient
app.delete('/patients/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    const deletedPatient = await Patient.findByIdAndDelete(patientId);

    if (!deletedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ message: 'Server error while deleting patient' });
  }
});

// View All Allergies for a Specific Patient
app.get('/patients/:patientId/allergies', async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId).populate('allergies');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient.allergies);
  } catch (error) {
    console.error('Error fetching patient allergies:', error);
    res.status(500).json({ message: 'Server error while fetching allergies' });
  }
});

// View a Specific Allergy for a Patient
app.get('/patients/:patientId/allergies/:allergyId', async (req, res) => {
  try {
    const { allergyId } = req.params;

    // Find the specific allergy by its ID
    const allergy = await Allergy.findById(allergyId);

    if (!allergy) {
      return res.status(404).json({ message: 'Allergy not found' });
    }

    res.status(200).json(allergy);
  } catch (error) {
    console.error('Error fetching specific allergy:', error);
    res.status(500).json({ message: 'Server error while fetching allergy' });
  }
});

// Add a New Allergy for a Patient
app.post('/patients/:patientId/allergies', async (req, res) => {
  try {
    const { patientId } = req.params;
    const allergyData = req.body;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const newAllergy = new Allergy({
      ...allergyData,
      creationDate: new Date(),  // Automatically set the creation date
      updateDate: new Date(),  // Automatically set the update date
    });

    await newAllergy.save();

    patient.allergies.push(newAllergy._id);
    await patient.save();

    res.status(201).json(newAllergy);
  } catch (error) {
    console.error('Error adding new allergy:', error);
    res.status(500).json({ message: 'Server error while adding allergy' });
  }
});

// Update an Allergy for a Patient
app.put('/patients/:patientId/allergies/:allergyId', async (req, res) => {
  try {
    const { allergyId } = req.params;
    const updatedData = req.body;

    const updatedAllergy = await Allergy.findByIdAndUpdate(
      allergyId,
      { ...updatedData, updateDate: new Date() },
      { new: true }
    );

    if (!updatedAllergy) {
      return res.status(404).json({ message: 'Allergy not found' });
    }

    res.status(200).json(updatedAllergy);
  } catch (error) {
    console.error('Error updating allergy:', error);
    res.status(500).json({ message: 'Server error while updating allergy' });
  }
});

// Delete an Allergy for a Patient
app.delete('/patients/:patientId/allergies/:allergyId', async (req, res) => {
  try {
    const { patientId, allergyId } = req.params;

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const allergyIndex = patient.allergies.indexOf(allergyId);

    if (allergyIndex === -1) {
      return res.status(404).json({ message: 'Allergy not found' });
    }

    patient.allergies.splice(allergyIndex, 1);
    await Allergy.findByIdAndDelete(allergyId);
    await patient.save();

    res.status(200).json({ message: 'Allergy deleted successfully' });
  } catch (error) {
    console.error('Error deleting allergy:', error);
    res.status(500).json({ message: 'Server error while deleting allergy' });
  }
});

// View All Appointments for a Specific Patient
app.get('/patients/:patientId/appointments', async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId).populate('appointments');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient.appointments);
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({ message: 'Server error while fetching appointments' });
  }
});

// View a Specific Appointment for a Patient
app.get('/patients/:patientId/appointments/:appointmentId', async (req, res) => {
  try {
    const { patientId, appointmentId } = req.params;
    const patient = await Patient.findById(patientId).populate('appointments');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const appointment = patient.appointments.id(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error fetching specific appointment:', error);
    res.status(500).json({ message: 'Server error while fetching appointment' });
  }
});

// Add a New Appointment for a Patient
app.post('/patients/:patientId/appointments', async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointmentData = req.body;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const newAppointment = new Appointment({
      ...appointmentData,
      creationDate: new Date(), // Automatically set the creation date
      updateDate: new Date(), // Automatically set the update date
      status: 'Pending',
    });

    await newAppointment.save();

    patient.appointments.push(newAppointment._id);
    await patient.save();

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error adding new appointment:', error);
    res.status(500).json({ message: 'Server error while adding appointment' });
  }
});

// Update an Appointment for a Patient
app.put('/patients/:patientId/appointments/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const updatedData = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { ...updatedData, updateDate: new Date() },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server error while updating appointment' });
  }
});

// Delete an Appointment for a Patient
app.delete('/patients/:patientId/appointments/:appointmentId', async (req, res) => {
  try {
    const { patientId, appointmentId } = req.params;

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const appointmentIndex = patient.appointments.indexOf(appointmentId);

    if (appointmentIndex === -1) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    patient.appointments.splice(appointmentIndex, 1);
    await Appointment.findByIdAndDelete(appointmentId);
    await patient.save();

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Server error while deleting appointment' });
  }
});

// View All Diagnoses for a Specific Patient
app.get('/patients/:patientId/diagnoses', async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId).populate('diagnoses');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient.diagnoses);
  } catch (error) {
    console.error('Error fetching patient diagnoses:', error);
    res.status(500).json({ message: 'Server error while fetching diagnoses' });
  }
});

// View a Specific Diagnosis for a Patient
app.get('/patients/:patientId/diagnoses/:diagnosisId', async (req, res) => {
  try {
    const { patientId, diagnosisId } = req.params;
    const patient = await Patient.findById(patientId).populate('diagnoses');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const diagnosis = patient.diagnoses.id(diagnosisId);

    if (!diagnosis) {
      return res.status(404).json({ message: 'Diagnosis not found' });
    }

    res.status(200).json(diagnosis);
  } catch (error) {
    console.error('Error fetching specific diagnosis:', error);
    res.status(500).json({ message: 'Server error while fetching diagnosis' });
  }
});

// Add a New Diagnosis for a Patient
app.post('/patients/:patientId/diagnoses', async (req, res) => {
  try {
    const { patientId } = req.params;
    const diagnosisData = req.body;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const newDiagnosis = new Diagnosis({
      ...diagnosisData,
      creationDate: new Date(),  // Automatically set the creation date
      updateDate: new Date(),  // Automatically set the update date
    });

    await newDiagnosis.save();

    patient.diagnoses.push(newDiagnosis._id);
    await patient.save();

    res.status(201).json(newDiagnosis);
  } catch (error) {
    console.error('Error adding new diagnosis:', error);
    res.status(500).json({ message: 'Server error while adding diagnosis' });
  }
});

// Update a Diagnosis for a Patient
app.put('/patients/:patientId/diagnoses/:diagnosisId', async (req, res) => {
  try {
    const { diagnosisId } = req.params;
    const updatedData = req.body;

    // Ensure only fields other than creationDate are updated
    const updatedDiagnosis = await Diagnosis.findByIdAndUpdate(
      diagnosisId,
      { ...updatedData, updateDate: new Date() },
      { new: true }
    );

    if (!updatedDiagnosis) {
      return res.status(404).json({ message: 'Diagnosis not found' });
    }

    res.status(200).json(updatedDiagnosis);
  } catch (error) {
    console.error('Error updating diagnosis:', error);
    res.status(500).json({ message: 'Server error while updating diagnosis' });
  }
});

// Delete a Diagnosis for a Patient
app.delete('/patients/:patientId/diagnoses/:diagnosisId', async (req, res) => {
  try {
    const { patientId, diagnosisId } = req.params;

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const diagnosisIndex = patient.diagnoses.indexOf(diagnosisId);

    if (diagnosisIndex === -1) {
      return res.status(404).json({ message: 'Diagnosis not found' });
    }

    patient.diagnoses.splice(diagnosisIndex, 1);
    await Diagnosis.findByIdAndDelete(diagnosisId);
    await patient.save();

    res.status(200).json({ message: 'Diagnosis deleted successfully' });
  } catch (error) {
    console.error('Error deleting diagnosis:', error);
    res.status(500).json({ message: 'Server error while deleting diagnosis' });
  }
});

app.get('/patients/:patientId/careGoals', async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId).populate('careGoals');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.status(200).json(patient.careGoals);
  } catch (error) {
    console.error('Error fetching care goals:', error);
    res.status(500).json({ message: 'Server error while fetching care goals' });
  }
});

app.get('/patients/:patientId/careGoals/:careGoalId', async (req, res) => {
  try {
    const { patientId, careGoalId } = req.params;
    const patient = await Patient.findById(patientId).populate('careGoals');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const careGoal = patient.careGoals.id(careGoalId);

    if (!careGoal) {
      return res.status(404).json({ message: 'Care goal not found' });
    }

    res.status(200).json(careGoal);
  } catch (error) {
    console.error('Error fetching care goal:', error);
    res.status(500).json({ message: 'Server error while fetching care goal' });
  }
});

app.post('/patients/:patientId/careGoals', async (req, res) => {
  try {
    const { patientId } = req.params;
    const careGoalData = req.body;

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const newCareGoal = new CareGoal({
      ...careGoalData,
      creationDate: new Date(),  // Automatically set the creation date
      updateDate: new Date(),  // Automatically set the update date
      status: 'On-going',
    });

    await newCareGoal.save();

    patient.careGoals.push(newCareGoal._id);
    await patient.save();

    res.status(201).json(newCareGoal);
  } catch (error) {
    console.error('Error adding new care goal:', error);
    res.status(500).json({ message: 'Server error while adding care goal' });
  }
});

app.put('/patients/:patientId/careGoals/:careGoalId', async (req, res) => {
  try {
    const { careGoalId } = req.params;
    const updatedData = req.body;

    const updatedCareGoal = await CareGoal.findByIdAndUpdate(
      careGoalId,
      { ...updatedData, updateDate: new Date() },
      { new: true }
    );

    if (!updatedCareGoal) {
      return res.status(404).json({ message: 'Care goal not found' });
    }

    res.status(200).json(updatedCareGoal);
  } catch (error) {
    console.error('Error updating care goal:', error);
    res.status(500).json({ message: 'Server error while updating care goal' });
  }
});

app.delete('/patients/:patientId/careGoals/:careGoalId', async (req, res) => {
  try {
    const { patientId, careGoalId } = req.params;

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const careGoalIndex = patient.careGoals.indexOf(careGoalId);

    if (careGoalIndex === -1) {
      return res.status(404).json({ message: 'Care goal not found' });
    }

    patient.careGoals.splice(careGoalIndex, 1);
    await CareGoal.findByIdAndDelete(careGoalId);
    await patient.save();

    res.status(200).json({ message: 'Care goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting care goal:', error);
    res.status(500).json({ message: 'Server error while deleting care goal' });
  }
});

// View All Medications for a Specific Patient
app.get('/patients/:patientId/medications', async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId).populate('medications');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient.medications);
  } catch (error) {
    console.error('Error fetching patient medications:', error);
    res.status(500).json({ message: 'Server error while fetching medications' });
  }
});

// View a Specific Medication for a Patient
app.get('/patients/:patientId/medications/:medicationId', async (req, res) => {
  try {
    const { medicationId } = req.params;

    // Find the specific medication by its ID
    const medication = await Medication.findById(medicationId);

    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    res.status(200).json(medication);
  } catch (error) {
    console.error('Error fetching specific medication:', error);
    res.status(500).json({ message: 'Server error while fetching medication' });
  }
});

// Add a New Medication for a Patient
app.post('/patients/:patientId/medications', async (req, res) => {
  try {
    const { patientId } = req.params;
    const medicationData = req.body;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const newMedication = new Medication({
      ...medicationData,
      creationDate: new Date(),  // Automatically set the creation date
      updateDate: new Date(),  // Automatically set the update date
      status: 'on-going',
    });

    await newMedication.save();

    patient.medications.push(newMedication._id);
    await patient.save();

    res.status(201).json(newMedication);
  } catch (error) {
    console.error('Error adding new medication:', error);
    res.status(500).json({ message: 'Server error while adding medication' });
  }
});

// Update a Medication for a Patient
app.put('/patients/:patientId/medications/:medicationId', async (req, res) => {
  try {
    const { medicationId } = req.params;
    const updatedData = req.body;

    const updatedMedication = await Medication.findByIdAndUpdate(
      medicationId,
      { ...updatedData, updateDate: new Date() },
      { new: true }
    );

    if (!updatedMedication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    res.status(200).json(updatedMedication);
  } catch (error) {
    console.error('Error updating medication:', error);
    res.status(500).json({ message: 'Server error while updating medication' });
  }
});

// Update Medication Status to 'cancelled'
app.put('/patients/:patientId/medications/:medicationId/cancel', async (req, res) => {
  try {
    const { medicationId } = req.params;

    // Update the medication status to 'cancelled'
    const updatedMedication = await Medication.findByIdAndUpdate(
      medicationId,
      { status: 'cancelled', updateDate: new Date() },
      { new: true } // Return the updated document
    );

    if (!updatedMedication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    res.status(200).json(updatedMedication);
  } catch (error) {
    console.error('Error cancelling medication:', error);
    res.status(500).json({ message: 'Server error while cancelling medication' });
  }
});

// Delete a Medication for a Patient
app.delete('/patients/:patientId/medications/:medicationId', async (req, res) => {
  try {
    const { patientId, medicationId } = req.params;

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const medicationIndex = patient.medications.indexOf(medicationId);

    if (medicationIndex === -1) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    patient.medications.splice(medicationIndex, 1);
    await Medication.findByIdAndDelete(medicationId);
    await patient.save();

    res.status(200).json({ message: 'Medication deleted successfully' });
  } catch (error) {
    console.error('Error deleting medication:', error);
    res.status(500).json({ message: 'Server error while deleting medication' });
  }
});

// View All Incidents for a Specific Patient
app.get('/patients/:patientId/incidents', async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId).populate('incidents');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient.incidents);
  } catch (error) {
    console.error('Error fetching patient incidents:', error);
    res.status(500).json({ message: 'Server error while fetching incidents' });
  }
});

// View a Specific Incident for a Patient
app.get('/patients/:patientId/incidents/:incidentId', async (req, res) => {
  try {
    const { incidentId } = req.params;

    const incident = await Incident.findById(incidentId);

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.status(200).json(incident);
  } catch (error) {
    console.error('Error fetching specific incident:', error);
    res.status(500).json({ message: 'Server error while fetching incident' });
  }
});

// Add a New Incident for a Patient
app.post('/patients/:patientId/incidents', async (req, res) => {
  try {
    const { patientId } = req.params;
    const incidentData = req.body;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const newIncident = new Incident({
      ...incidentData,
      creationDate: new Date(),  // Automatically set the creation date
      updateDate: new Date(),  // Automatically set the update date
      status: "waiting_for_resolution",
    });

    await newIncident.save();

    patient.incidents.push(newIncident._id);
    await patient.save();

    res.status(201).json(newIncident);
  } catch (error) {
    console.error('Error adding new incident:', error);
    res.status(500).json({ message: 'Server error while adding incident' });
  }
});

// Update an Incident for a Patient
app.put('/patients/:patientId/incidents/:incidentId', async (req, res) => {
  try {
    const { incidentId } = req.params;
    const updatedData = req.body;

    const updatedIncident = await Incident.findByIdAndUpdate(
      incidentId,
      { ...updatedData, updateDate: new Date() },
      { new: true }
    );

    if (!updatedIncident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.status(200).json(updatedIncident);
  } catch (error) {
    console.error('Error updating incident:', error);
    res.status(500).json({ message: 'Server error while updating incident' });
  }
});

// Update Incident Status to 'resolved'
app.put('/patients/:patientId/incidents/:incidentId/resolve', async (req, res) => {
  try {
    const { incidentId } = req.params;

    // Update the medication status to 'cancelled'
    const updatedIncident = await Incident.findByIdAndUpdate(
      incidentId,
      { status: 'resolved', updateDate: new Date() },
      { new: true } // Return the updated document
    );

    if (!updatedIncident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.status(200).json(updatedIncident);
  } catch (error) {
    console.error('Error resolving incident:', error);
    res.status(500).json({ message: 'Server error while resolving incident' });
  }
});

// Delete an Incident for a Patient
app.delete('/patients/:patientId/incidents/:incidentId', async (req, res) => {
  try {
    const { patientId, incidentId } = req.params;

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const incidentIndex = patient.incidents.indexOf(incidentId);

    if (incidentIndex === -1) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    patient.incidents.splice(incidentIndex, 1);
    await Incident.findByIdAndDelete(incidentId);
    await patient.save();

    res.status(200).json({ message: 'Incident deleted successfully' });
  } catch (error) {
    console.error('Error deleting incident:', error);
    res.status(500).json({ message: 'Server error while deleting incident' });
  }
});

// View All Notes for a Specific Patient
app.get('/patients/:patientId/notes', async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId).populate('notes');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient.notes);
  } catch (error) {
    console.error('Error fetching patient notes:', error);
    res.status(500).json({ message: 'Server error while fetching notes' });
  }
});

// View a Specific Note for a Patient
app.get('/patients/:patientId/notes/:noteId', async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error('Error fetching specific note:', error);
    res.status(500).json({ message: 'Server error while fetching note' });
  }
});

// Add a New Note for a Patient
app.post('/patients/:patientId/notes', async (req, res) => {
  try {
    const { patientId } = req.params;
    const noteData = req.body;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const newNote = new Note({
      ...noteData,
      creationDate: new Date(),  // Automatically set the creation date
      updateDate: new Date(),  // Automatically set the update date
    });

    await newNote.save();

    patient.notes.push(newNote._id);
    await patient.save();

    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error adding new note:', error);
    res.status(500).json({ message: 'Server error while adding note' });
  }
});

// Update a Note for a Patient
app.put('/patients/:patientId/notes/:noteId', async (req, res) => {
  try {
    const { noteId } = req.params;
    const updatedData = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { ...updatedData, updateDate: new Date() },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Server error while updating note' });
  }
});

// Delete a Note for a Patient
app.delete('/patients/:patientId/notes/:noteId', async (req, res) => {
  try {
    const { patientId, noteId } = req.params;

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const noteIndex = patient.notes.indexOf(noteId);

    if (noteIndex === -1) {
      return res.status(404).json({ message: 'Note not found' });
    }

    patient.notes.splice(noteIndex, 1);
    await Note.findByIdAndDelete(noteId);
    await patient.save();

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Server error while deleting note' });
  }
});

// View All Doctors
app.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error while fetching doctors' });
  }
});

// View a Specific Doctor
app.get('/doctors/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error('Error fetching specific doctor:', error);
    res.status(500).json({ message: 'Server error while fetching doctor' });
  }
});

// Add a New Doctor
app.post('/doctors', async (req, res) => {
  try {
    const doctorData = req.body;

    const newDoctor = new Doctor({
      ...doctorData,
      creationDate: new Date(),  // Automatically set the creation date
      updateDate: new Date(),  // Automatically set the update date
      appointments: [],
      patients: [],
      carePlans: [],
      incidents: [],
      notes: [],
      labs: [],
      imagings: [],
      relatedPersons: []
    });

    await newDoctor.save();

    res.status(201).json(newDoctor);
  } catch (error) {
    console.error('Error adding new doctor:', error);
    res.status(500).json({ message: 'Server error while adding doctor' });
  }
});

// Update a Doctor
app.put('/doctors/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const updatedData = req.body;

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      {
        ...updatedData,
        updateDate: new Date(),  // Automatically set the update date
        $unset: { appointments: "", patients: "", carePlans: "", incidents: "", notes: "", labs: "", imagings: "", relatedPersons: "" }
      },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(updatedDoctor);
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ message: 'Server error while updating doctor' });
  }
});

// Delete a Doctor
app.delete('/doctors/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;

    const deletedDoctor = await Doctor.findByIdAndDelete(doctorId);

    if (!deletedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ message: 'Server error while deleting doctor' });
  }
});

app.get('/doctors/:doctorId/appointments', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId).populate('appointments');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor.appointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ message: 'Server error while fetching appointments' });
  }
});

app.get('/doctors/:doctorId/appointments/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error fetching specific appointment:', error);
    res.status(500).json({ message: 'Server error while fetching appointment' });
  }
});

app.post('/doctors/:doctorId/appointments', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointmentData = req.body;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const newAppointment = new Appointment({
      ...appointmentData,
      creationDate: new Date(),  // Automatically set the creation date
      updateDate: new Date(),  // Automatically set the update date
      status: "Pending",
    });

    await newAppointment.save();

    doctor.appointments.push(newAppointment._id);
    await doctor.save();

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error adding new appointment:', error);
    res.status(500).json({ message: 'Server error while adding appointment' });
  }
});

app.put('/doctors/:doctorId/appointments/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const updatedData = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { ...updatedData, updateDate: new Date() },  // Set the update date to the current date
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server error while updating appointment' });
  }
});

app.delete('/doctors/:doctorId/appointments/:appointmentId', async (req, res) => {
  try {
    const { doctorId, appointmentId } = req.params;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointmentIndex = doctor.appointments.indexOf(appointmentId);

    if (appointmentIndex === -1) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    doctor.appointments.splice(appointmentIndex, 1);
    await Appointment.findByIdAndDelete(appointmentId);
    await doctor.save();

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Server error while deleting appointment' });
  }
});

app.get('/doctors/:doctorId/patients', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId).populate('patients');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor.patients);
  } catch (error) {
    console.error('Error fetching doctor patients:', error);
    res.status(500).json({ message: 'Server error while fetching patients' });
  }
});

app.get('/doctors/:doctorId/patients/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching specific patient:', error);
    res.status(500).json({ message: 'Server error while fetching patient' });
  }
});

app.post('/doctors/:doctorId/patients', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const patientData = req.body;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const newPatient = new Patient({
      ...patientData,
      creationDate: new Date(),  // Automatically set the creation date
      updateDate: new Date(),  // Automatically set the update date
    });

    await newPatient.save();

    doctor.patients.push(newPatient._id);
    await doctor.save();

    res.status(201).json(newPatient);
  } catch (error) {
    console.error('Error adding new patient:', error);
    res.status(500).json({ message: 'Server error while adding patient' });
  }
});

app.put('/doctors/:doctorId/patients/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const updatedData = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { ...updatedData, updateDate: new Date() },  // Set the update date to the current date
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ message: 'Server error while updating patient' });
  }
});

app.delete('/doctors/:doctorId/patients/:patientId', async (req, res) => {
  try {
    const { doctorId, patientId } = req.params;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const patientIndex = doctor.patients.indexOf(patientId);

    if (patientIndex === -1) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    doctor.patients.splice(patientIndex, 1);
    await Patient.findByIdAndDelete(patientId);
    await doctor.save();

    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ message: 'Server error while deleting patient' });
  }
});

app.get('/doctors/:doctorId/labs', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId).populate('labs');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor.labs);
  } catch (error) {
    console.error('Error fetching doctor labs:', error);
    res.status(500).json({ message: 'Server error while fetching labs' });
  }
});

app.get('/doctors/:doctorId/labs/:labId', async (req, res) => {
  try {
    const { labId } = req.params;

    const lab = await Lab.findById(labId);

    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    res.status(200).json(lab);
  } catch (error) {
    console.error('Error fetching specific lab:', error);
    res.status(500).json({ message: 'Server error while fetching lab' });
  }
});

app.post('/doctors/:doctorId/labs', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const labData = req.body;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const newLab = new Lab({
      ...labData,
      creationDate: new Date(),  // Automatically set the creation date
      updateDate: new Date(),  // Automatically set the update date
    });

    await newLab.save();

    doctor.labs.push(newLab._id);
    await doctor.save();

    res.status(201).json(newLab);
  } catch (error) {
    console.error('Error adding new lab:', error);
    res.status(500).json({ message: 'Server error while adding lab' });
  }
});

app.put('/doctors/:doctorId/labs/:labId', async (req, res) => {
  try {
    const { labId } = req.params;
    const updatedData = req.body;

    const updatedLab = await Lab.findByIdAndUpdate(
      labId,
      { ...updatedData, updateDate: new Date() },  // Set the update date to the current date
      { new: true }
    );

    if (!updatedLab) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    res.status(200).json(updatedLab);
  } catch (error) {
    console.error('Error updating lab:', error);
    res.status(500).json({ message: 'Server error while updating lab' });
  }
});

app.delete('/doctors/:doctorId/labs/:labId', async (req, res) => {
  try {
    const { doctorId, labId } = req.params;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const labIndex = doctor.labs.indexOf(labId);

    if (labIndex === -1) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    doctor.labs.splice(labIndex, 1);
    await Lab.findByIdAndDelete(labId);
    await doctor.save();

    res.status(200).json({ message: 'Lab deleted successfully' });
  } catch (error) {
    console.error('Error deleting lab:', error);
    res.status(500).json({ message: 'Server error while deleting lab' });
  }
});

app.get('/doctors/:doctorId/incidents', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId).populate('incidents');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor.incidents);
  } catch (error) {
    console.error('Error fetching doctor incidents:', error);
    res.status(500).json({ message: 'Server error while fetching incidents' });
  }
});

app.get('/doctors/:doctorId/incidents/:incidentId', async (req, res) => {
  try {
    const { incidentId } = req.params;

    const incident = await Incident.findById(incidentId);

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.status(200).json(incident);
  } catch (error) {
    console.error('Error fetching specific incident:', error);
    res.status(500).json({ message: 'Server error while fetching incident' });
  }
});

app.post('/doctors/:doctorId/incidents', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const incidentData = req.body;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const newIncident = new Incident({
      ...incidentData,
      creationDate: new Date(),  // Automatically set the creation date
      updateDate: new Date(),  // Automatically set the update date
      status: "waiting_for_resolution",
    });

    await newIncident.save();

    doctor.incidents.push(newIncident._id);
    await doctor.save();

    res.status(201).json(newIncident);
  } catch (error) {
    console.error('Error adding new incident:', error);
    res.status(500).json({ message: 'Server error while adding incident' });
  }
});

app.put('/doctors/:doctorId/incidents/:incidentId', async (req, res) => {
  try {
    const { incidentId } = req.params;
    const updatedData = req.body;

    const updatedIncident = await Incident.findByIdAndUpdate(
      incidentId,
      { ...updatedData, updateDate: new Date() },  // Set the update date to the current date
      { new: true }
    );

    if (!updatedIncident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.status(200).json(updatedIncident);
  } catch (error) {
    console.error('Error updating incident:', error);
    res.status(500).json({ message: 'Server error while updating incident' });
  }
});

app.delete('/doctors/:doctorId/incidents/:incidentId', async (req, res) => {
  try {
    const { doctorId, incidentId } = req.params;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const incidentIndex = doctor.incidents.indexOf(incidentId);

    if (incidentIndex === -1) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    doctor.incidents.splice(incidentIndex, 1);
    await Incident.findByIdAndDelete(incidentId);
    await doctor.save();

    res.status(200).json({ message: 'Incident deleted successfully' });
  } catch (error) {
    console.error('Error deleting incident:', error);
    res.status(500).json({ message: 'Server error while deleting incident' });
  }
});

app.get('/doctors/:doctorId/care-plans', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId).populate('carePlans');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor.carePlans);
  } catch (error) {
    console.error('Error fetching doctor care plans:', error);
    res.status(500).json({ message: 'Server error while fetching care plans' });
  }
});

app.get('/doctors/:doctorId/care-plans/:carePlanId', async (req, res) => {
  try {
    const { carePlanId } = req.params;

    const carePlan = await CarePlan.findById(carePlanId);

    if (!carePlan) {
      return res.status(404).json({ message: 'Care plan not found' });
    }

    res.status(200).json(carePlan);
  } catch (error) {
    console.error('Error fetching specific care plan:', error);
    res.status(500).json({ message: 'Server error while fetching care plan' });
  }
});

app.post('/doctors/:doctorId/care-plans', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const carePlanData = req.body;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const newCarePlan = new CarePlan({
      ...carePlanData,
      creationDate: new Date(),  // Automatically set the creation date
      updateDate: new Date(),  // Automatically set the update date
    });

    await newCarePlan.save();

    doctor.carePlans.push(newCarePlan._id);
    await doctor.save();

    res.status(201).json(newCarePlan);
  } catch (error) {
    console.error('Error adding new care plan:', error);
    res.status(500).json({ message: 'Server error while adding care plan' });
  }
});

app.put('/doctors/:doctorId/care-plans/:carePlanId', async (req, res) => {
  try {
    const { carePlanId } = req.params;
    const updatedData = req.body;

    const updatedCarePlan = await CarePlan.findByIdAndUpdate(
      carePlanId,
      { ...updatedData, updateDate: new Date() },  // Set the update date to the current date
      { new: true }
    );

    if (!updatedCarePlan) {
      return res.status(404).json({ message: 'Care plan not found' });
    }

    res.status(200).json(updatedCarePlan);
  } catch (error) {
    console.error('Error updating care plan:', error);
    res.status(500).json({ message: 'Server error while updating care plan' });
  }
});

app.delete('/doctors/:doctorId/care-plans/:carePlanId', async (req, res) => {
  try {
    const { doctorId, carePlanId } = req.params;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const carePlanIndex = doctor.carePlans.indexOf(carePlanId);

    if (carePlanIndex === -1) {
      return res.status(404).json({ message: 'Care plan not found' });
    }

    doctor.carePlans.splice(carePlanIndex, 1);
    await CarePlan.findByIdAndDelete(carePlanId);
    await doctor.save();

    res.status(200).json({ message: 'Care plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting care plan:', error);
    res.status(500).json({ message: 'Server error while deleting care plan' });
  }
});

app.get('/doctors/:doctorId/imagings', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId).populate('imagings');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor.imagings);
  } catch (error) {
    console.error('Error fetching doctor imagings:', error);
    res.status(500).json({ message: 'Server error while fetching imagings' });
  }
});


app.get('/doctors/:doctorId/imagings/:imagingId', async (req, res) => {
  try {
    const { imagingId } = req.params;

    const imaging = await Imaging.findById(imagingId);

    if (!imaging) {
      return res.status(404).json({ message: 'Imaging record not found' });
    }

    res.status(200).json(imaging);
  } catch (error) {
    console.error('Error fetching specific imaging record:', error);
    res.status(500).json({ message: 'Server error while fetching imaging record' });
  }
});

app.post('/doctors/:doctorId/imagings', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const imagingData = req.body;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const newImaging = new Imaging({
      ...imagingData,
      creationDate: new Date(),  // Automatically set the creation date
      updateDate: new Date(),  // Automatically set the update date
    });

    await newImaging.save();

    doctor.imagings.push(newImaging._id);
    await doctor.save();

    res.status(201).json(newImaging);
  } catch (error) {
    console.error('Error adding new imaging record:', error);
    res.status(500).json({ message: 'Server error while adding imaging record' });
  }
});

app.put('/doctors/:doctorId/imagings/:imagingId', async (req, res) => {
  try {
    const { imagingId } = req.params;
    const updatedData = req.body;

    const updatedImaging = await Imaging.findByIdAndUpdate(
      imagingId,
      { ...updatedData, updateDate: new Date() },  // Set the update date to the current date
      { new: true }
    );

    if (!updatedImaging) {
      return res.status(404).json({ message: 'Imaging record not found' });
    }

    res.status(200).json(updatedImaging);
  } catch (error) {
    console.error('Error updating imaging record:', error);
    res.status(500).json({ message: 'Server error while updating imaging record' });
  }
});

app.delete('/doctors/:doctorId/imagings/:imagingId', async (req, res) => {
  try {
    const { doctorId, imagingId } = req.params;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const imagingIndex = doctor.imagings.indexOf(imagingId);

    if (imagingIndex === -1) {
      return res.status(404).json({ message: 'Imaging record not found' });
    }

    doctor.imagings.splice(imagingIndex, 1);
    await Imaging.findByIdAndDelete(imagingId);
    await doctor.save();

    res.status(200).json({ message: 'Imaging record deleted successfully' });
  } catch (error) {
    console.error('Error deleting imaging record:', error);
    res.status(500).json({ message: 'Server error while deleting imaging record' });
  }
});

app.get('/doctors/:doctorId/relatedpersons', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId).populate('relatedPersons');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor.relatedPersons);
  } catch (error) {
    console.error('Error fetching doctor related persons:', error);
    res.status(500).json({ message: 'Server error while fetching related persons' });
  }
});

app.get('/doctors/:doctorId/relatedpersons/:relatedPersonId', async (req, res) => {
  try {
    const { relatedPersonId } = req.params;

    const relatedPerson = await RelatedPerson.findById(relatedPersonId);

    if (!relatedPerson) {
      return res.status(404).json({ message: 'Related person not found' });
    }

    res.status(200).json(relatedPerson);
  } catch (error) {
    console.error('Error fetching specific related person:', error);
    res.status(500).json({ message: 'Server error while fetching related person' });
  }
});

app.post('/doctors/:doctorId/relatedpersons', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const relatedPersonData = req.body;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const newRelatedPerson = new RelatedPerson({
      ...relatedPersonData,
      creationDate: new Date(),  // Automatically set the creation date
      updateDate: new Date(),  // Automatically set the update date
    });

    await newRelatedPerson.save();

    doctor.relatedPersons.push(newRelatedPerson._id);
    await doctor.save();

    res.status(201).json(newRelatedPerson);
  } catch (error) {
    console.error('Error adding new related person:', error);
    res.status(500).json({ message: 'Server error while adding related person' });
  }
});

app.put('/doctors/:doctorId/relatedpersons/:relatedPersonId', async (req, res) => {
  try {
    const { relatedPersonId } = req.params;
    const updatedData = req.body;

    const updatedRelatedPerson = await RelatedPerson.findByIdAndUpdate(
      relatedPersonId,
      { ...updatedData, updateDate: new Date() },  // Set the update date to the current date
      { new: true }
    );

    if (!updatedRelatedPerson) {
      return res.status(404).json({ message: 'Related person not found' });
    }

    res.status(200).json(updatedRelatedPerson);
  } catch (error) {
    console.error('Error updating related person:', error);
    res.status(500).json({ message: 'Server error while updating related person' });
  }
});

app.delete('/doctors/:doctorId/relatedpersons/:relatedPersonId', async (req, res) => {
  try {
    const { doctorId, relatedPersonId } = req.params;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const relatedPersonIndex = doctor.relatedPersons.indexOf(relatedPersonId);

    if (relatedPersonIndex === -1) {
      return res.status(404).json({ message: 'Related person not found' });
    }

    doctor.relatedPersons.splice(relatedPersonIndex, 1);
    await RelatedPerson.findByIdAndDelete(relatedPersonId);
    await doctor.save();

    res.status(200).json({ message: 'Related person deleted successfully' });
  } catch (error) {
    console.error('Error deleting related person:', error);
    res.status(500).json({ message: 'Server error while deleting related person' });
  }
});

app.get('/doctors/:doctorId/notes', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId).populate('notes');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor.notes);
  } catch (error) {
    console.error('Error fetching doctor notes:', error);
    res.status(500).json({ message: 'Server error while fetching notes' });
  }
});

app.get('/doctors/:doctorId/notes/:noteId', async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note record not found' });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error('Error fetching specific note record:', error);
    res.status(500).json({ message: 'Server error while fetching note record' });
  }
});


app.post('/doctors/:doctorId/notes', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const noteData = req.body;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const newNote = new Note({
      ...noteData,
      creationDate: new Date(),  // Automatically set the creation date
      updateDate: new Date(),    // Automatically set the update date
    });

    await newNote.save();

    doctor.notes.push(newNote._id);
    await doctor.save();

    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error adding new note record:', error);
    res.status(500).json({ message: 'Server error while adding note record' });
  }
});

app.put('/doctors/:doctorId/notes/:noteId', async (req, res) => {
  try {
    const { noteId } = req.params;
    const updatedData = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { ...updatedData, updateDate: new Date() },  // Set the update date to the current date
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note record not found' });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error('Error updating note record:', error);
    res.status(500).json({ message: 'Server error while updating note record' });
  }
});

app.delete('/doctors/:doctorId/notes/:noteId', async (req, res) => {
  try {
    const { doctorId, noteId } = req.params;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const noteIndex = doctor.notes.indexOf(noteId);

    if (noteIndex === -1) {
      return res.status(404).json({ message: 'Note record not found' });
    }

    doctor.notes.splice(noteIndex, 1);
    await Note.findByIdAndDelete(noteId);
    await doctor.save();

    res.status(200).json({ message: 'Note record deleted successfully' });
  } catch (error) {
    console.error('Error deleting note record:', error);
    res.status(500).json({ message: 'Server error while deleting note record' });
  }
});

// Endpoint to get all appointments
app.get('/appointments', async (req, res) => {
  try {
    const doctorFilter = 'General practitioner - Alex Matei';
    const appointments = await Appointment.find({ doctor: doctorFilter }); // Apply filter here
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
});

app.put('/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const { visitType, duration, status } = req.body;

  try {
    // Find the appointment by ID and update the allowed fields
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      {
        ...(visitType && { visitType }),
        ...(duration && { duration }),
        ...(status && { status }),
        updateDate: new Date()  // Update the `updateDate` field automatically
      },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment', error });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

export default app;