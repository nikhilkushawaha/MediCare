
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Clock, Calendar, Activity, Users, PlusCircle, Heart, ArrowUpRight, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import PatientCard from '@/components/patients/PatientCard';
import AppointmentList from '@/components/appointments/AppointmentList';
import { Appointment, Patient, Doctor } from '@/utils/types';
import { db } from '@/utils/database';

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Sarah Johnson',
    doctorId: '1',
    doctorName: 'Robert Miller',
    date: '2023-09-15',
    time: '10:00 AM',
    status: 'scheduled',
    reason: 'Annual checkup'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Michael Thompson',
    doctorId: '2',
    doctorName: 'Jane Smith',
    date: '2023-09-16',
    time: '11:30 AM',
    status: 'scheduled',
    reason: 'Follow-up'
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Emily Davis',
    doctorId: '1',
    doctorName: 'Robert Miller',
    date: '2023-09-14',
    time: '3:15 PM',
    status: 'completed',
    reason: 'Blood test'
  },
  {
    id: '4',
    patientId: '4',
    patientName: 'David Wilson',
    doctorId: '3',
    doctorName: 'Susan Lee',
    date: '2023-09-17',
    time: '2:00 PM',
    status: 'canceled',
    reason: 'Consultation'
  },
  {
    id: '5',
    patientId: '5',
    patientName: 'Jessica Brown',
    doctorId: '2',
    doctorName: 'Jane Smith',
    date: '2023-09-18',
    time: '9:45 AM',
    status: 'scheduled',
    reason: 'Vaccination'
  }
];

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 123-4567',
    birthDate: '1985-05-15',
    gender: 'female',
    bloodType: 'A+',
    insurance: 'BlueCross #12345',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
  },
  {
    id: '2',
    name: 'Michael Thompson',
    email: 'michael.t@example.com',
    phone: '(555) 987-6543',
    birthDate: '1978-11-22',
    gender: 'male',
    bloodType: 'O-',
    insurance: 'Aetna #67890',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    phone: '(555) 456-7890',
    birthDate: '1992-08-10',
    gender: 'female',
    bloodType: 'B+',
    insurance: 'UnitedHealth #23456',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
  }
];

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [stats, setStats] = useState({
    patients: 0,
    appointments: 0,
    completed: 0,
    occupancy: 0
  });
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const patients = db.getAll<Patient>('patients');
      const appointments = db.getAll<Appointment>('appointments');
      
      setTodayAppointments(3);
      setStats({
        patients: Object.keys(patients).length || 1254,
        appointments: Object.keys(appointments).length || 72,
        completed: 48,
        occupancy: 78
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-display font-bold tracking-tight">Welcome back, {user?.name.split(' ')[0]}</h1>
        <p className="text-muted-foreground">
          Here's what's happening at the hospital today.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.patients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +23 new this month
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.appointments} this week
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Appointment Completion</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <div className="flex items-center space-x-1 pt-1">
              <Progress value={Math.round((stats.completed / stats.appointments) * 100)} className="h-1" />
              <span className="text-xs text-muted-foreground">{Math.round((stats.completed / stats.appointments) * 100)}%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupancy}%</div>
            <div className="flex items-center space-x-1 pt-1">
              <Progress value={stats.occupancy} className="h-1" />
              <span className="text-xs text-muted-foreground">187/240 beds</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <AppointmentList
            appointments={mockAppointments}
            title="Today's Appointments"
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Patients</h3>
            <Button 
              variant="ghost" 
              className="flex items-center text-medical" 
              size="sm"
              onClick={() => navigate('/patients')}
            >
              View all
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {mockPatients.map(patient => (
              <PatientCard key={patient.id} patient={patient} compact />
            ))}
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Commonly used functions</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button 
                className="justify-start" 
                variant="outline"
                onClick={() => navigate('/appointments')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
              <Button 
                className="justify-start" 
                variant="outline"
                onClick={() => navigate('/patients')}
              >
                <User className="mr-2 h-4 w-4" />
                Register New Patient
              </Button>
              <Button 
                className="justify-start" 
                variant="outline"
                onClick={() => navigate('/records')}
              >
                <Clock className="mr-2 h-4 w-4" />
                View Medical Records
              </Button>
              <Button 
                className="justify-start bg-primary/10 hover:bg-primary/20 text-primary" 
                variant="outline"
                onClick={() => navigate('/symptom-checker')}
              >
                <Stethoscope className="mr-2 h-4 w-4" />
                AI Symptom Checker
              </Button>
              <Button 
                className="justify-start" 
                variant="outline"
                onClick={() => navigate('/doctors')}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Doctor
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
