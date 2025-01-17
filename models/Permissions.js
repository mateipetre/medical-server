const Permissions = Object.freeze({
  ReadPatients: 'read:patients',
  WritePatients: 'write:patients',
  AddPatient: 'add:patient',
  DeletePatient: 'delete:patient',
  ViewPatient: 'view:patient',
  EditPatient: 'edit:patient',
  ReadAppointments: 'read:appointments',
  WriteAppointments: 'write:appointments',
  DeleteAppointment: 'delete:appointment',
  ViewAppointment: 'view:appointment',
  EditAppointment: 'edit:appointment',
  AddAllergy: 'write:allergy',
  ViewAllergy: 'view:allergy',
  EditAllergy: 'edit:allergy',
  ReadAllergies: 'read:allergies',
  DeleteAllergy: 'delete:allergy',
  AddDiagnosis: 'write:diagnosis',
  ViewDiagnosis: 'view:diagnosis',
  EditDiagnosis: 'edit:diagnosis',
  DeleteDiagnosis: 'delete:diagnosis',
  ViewDiagnoses: 'view:diagnoses',
  RequestLab: 'write:labs',
  CancelLab: 'cancel:lab',
  CompleteLab: 'complete:lab',
  ViewLab: 'read:lab',
  ViewLabs: 'read:labs',
  DeleteLab: 'delete:lab',
  UpdateLab: 'update:lab',
  ViewIncidents: 'read:incidents',
  ViewIncident: 'read:incident',
  UpdateIncident: 'update:incident',
  ReportIncident: 'write:incident',
  ResolveIncident: 'resolve:incident',
  AddCarePlan: 'write:care_plan',
  ReadCarePlan: 'read:care_plan',
  ViewCarePlans: 'view:care_plans',
  DeleteCarePlan: 'delete:care_plan',
  EditCarePlan: 'edit:care_plan',
  AddCareGoal: 'write:care_goal',
  DeleteCareGoal: 'delete:care_goal',
  ViewCareGoals: 'view:care_goals',
  ViewCareGoal: 'view:care_goal',
  EditCareGoal: 'edit:care_goal',
  RequestMedication: 'write:medication',
  CancelMedication: 'cancel:medication',
  CompleteMedication: 'complete:medication',
  EditMedication: 'edit:medication',
  ViewMedication: 'read:medication',
  ViewMedications: 'read:medications',
  DeleteMedication: 'delete:medication',
  RequestImaging: 'write:imaging',
  ViewImagings: 'read:imagings',
  ViewImaging: 'view:imaging',
  DeleteImaging: 'delete:imaging',
  ViewIncidentWidgets: 'read:incident_widgets',
  ViewNote: 'view:note',
  ViewNotes: 'view:notes',
  EditNote: 'edit:note',
  DeleteNote: 'delete:note',
  AddNote: 'add:note',
  ViewRelatedPersons: "view:related_persons",
  ViewRelatedPerson: "view:related_person",
  DeleteRelatedPerson: "delete:related_person",
  EditRelatedPerson: "edit:related_person",
  AddRelatedPerson: "add:related_person"
});

export default Permissions;