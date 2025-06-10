
import mongoose from 'mongoose';
import { Doctor } from '../../utils/types';

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  specialty: {
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
  qualification: String,
  experience: Number,
  availability: [String],
  consultationFee: Number,
  patients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  }],
  rating: {
    type: Number,
    default: 0
  },
  avatar: String,
  bio: String,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  consultationType: {
    type: [String],
    enum: ['video', 'in-person'],
    default: ['in-person']
  }
}, {
  timestamps: true
});

const DoctorModel = mongoose.model<Doctor & mongoose.Document>('Doctor', doctorSchema);

export default DoctorModel;
