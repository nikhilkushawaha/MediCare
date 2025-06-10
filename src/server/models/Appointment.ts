
import mongoose from 'mongoose';
import { Appointment } from '../../utils/types';

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'canceled'],
    default: 'scheduled'
  },
  type: {
    type: String,
    enum: ['video', 'in-person'],
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  notes: String
}, {
  timestamps: true
});

const AppointmentModel = mongoose.model<Appointment & mongoose.Document>('Appointment', appointmentSchema);

export default AppointmentModel;
