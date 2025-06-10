
import { ObjectId } from 'mongodb';

export type UserRole = 'admin' | 'doctor' | 'patient';

export interface User {
  _id?: string | ObjectId;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  specialty?: string; // For doctors
  dateJoined?: string;
  isVerified?: boolean;
}

export interface Patient {
  _id?: string | ObjectId;
  userId: string | ObjectId;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  address?: string;
  insurance?: string;
  emergencyContact?: string;
  medicalHistory?: MedicalRecord[];
  avatar?: string;
  allergies?: string[];
  medications?: Medication[];
  // Add id property for compatibility with existing code
  id?: string;
}

export interface Doctor {
  _id?: string | ObjectId;
  userId: string | ObjectId;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  qualification?: string;
  experience?: number;
  availability: string[];
  consultationFee?: number;
  patients?: string[];
  rating?: number;
  avatar?: string;
  bio?: string;
  department?: string;
  consultationType?: ('video' | 'in-person')[];
  // Add id property for compatibility with existing code
  id?: string;
}

export interface Department {
  _id?: string | ObjectId;
  name: string;
  description?: string;
  doctors?: string[] | ObjectId[];
  icon?: string;
  // Add id property for compatibility with existing code
  id?: string;
}

export interface Appointment {
  _id?: string | ObjectId;
  patientId: string | ObjectId;
  patientName: string;
  doctorId: string | ObjectId;
  doctorName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'canceled';
  type: 'video' | 'in-person';
  reason: string;
  notes?: string;
  // Add id property for compatibility with existing code
  id?: string;
}

export interface MedicalRecord {
  _id?: string | ObjectId;
  patientId: string | ObjectId;
  doctorId: string | ObjectId;
  date: string;
  diagnosis: string;
  prescription?: string[];
  notes?: string;
  attachments?: string[];
  symptoms?: string[];
  followUpDate?: string;
  // Add id property for compatibility with existing code
  id?: string;
}

export interface Prescription {
  _id?: string | ObjectId;
  patientId: string | ObjectId;
  doctorId: string | ObjectId;
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  instructions?: string;
  status: 'active' | 'completed' | 'cancelled';
  // Add id property for compatibility with existing code
  id?: string;
}

export interface Medication {
  _id?: string | ObjectId;
  name: string;
  description: string;
  sideEffects?: string[];
  interactions?: string[];
  stock: number;
  price: number;
  category?: string;
  requiresPrescription?: boolean;
  dosageForm?: string;
  manufacturer?: string;
  // Add id property for compatibility with existing code
  id?: string;
}

export interface Bill {
  _id?: string | ObjectId;
  patientId: string | ObjectId;
  date: string;
  items: {
    description: string;
    amount: number;
  }[];
  total: number;
  status: 'pending' | 'paid' | 'overdue';
  paidDate?: string;
  // Add id property for compatibility with existing code
  id?: string;
}

export interface Notification {
  _id?: string | ObjectId;
  userId: string | ObjectId;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'appointment' | 'message' | 'reminder' | 'system';
  // Add id property for compatibility with existing code
  id?: string;
}

export interface HealthMetric {
  _id?: string | ObjectId;
  patientId: string | ObjectId;
  type: 'bloodPressure' | 'heartRate' | 'temperature' | 'weight' | 'bloodSugar' | 'other';
  value: number | string;
  unit: string;
  date: string;
  notes?: string;
  // Add id property for compatibility with existing code
  id?: string;
}

export interface SymptomCheckerResult {
  inputSymptoms: string[];
  matchedSymptoms: string[];
  possibleConditions: string[];
  severity: string;
  recommendation: string;
  confidence: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
