
import mongoose from 'mongoose';
import { Patient } from '../../utils/types';

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  birthDate: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  address: String,
  insurance: String,
  emergencyContact: String,
  avatar: String,
  allergies: [String],
  medications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication'
  }]
}, {
  timestamps: true
});

const PatientModel = mongoose.model<Patient & mongoose.Document>('Patient', patientSchema);

export default PatientModel;
