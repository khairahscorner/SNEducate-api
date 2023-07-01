const express = require('express');
const router = express.Router();

// Import the TherapistController
const TherapistController = require('../controllers/TherapistController');

// Define the routes and corresponding controller methods
router.post('/register', TherapistController.register);
router.post('/add_patient', TherapistController.addPatient);
router.get('/dashboard', TherapistController.viewTherapistDashboard);
router.get('/view_patients', TherapistController.viewTherapistPatient);
router.put('/edit_patient/:patient_id', TherapistController.updatePatient);
router.delete('/delete_patient/:patient_id', TherapistController.deletePatient);
router.delete('/remove_specialization/:therapist_specialization_id', TherapistController.removeSpecialization);
router.get('/', TherapistController.therapistProfile);
router.get('/:user_id', TherapistController.getSingleTherapist);
router.put('/:user_id', TherapistController.update);

module.exports = router;
