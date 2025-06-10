
import mongoose from 'mongoose';
import { Department } from '../../utils/types';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  doctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  }],
  icon: String
}, {
  timestamps: true
});

const DepartmentModel = mongoose.model<Department & mongoose.Document>('Department', departmentSchema);

export default DepartmentModel;
