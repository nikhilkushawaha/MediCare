
import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Filter, 
  Clock,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import AppointmentList from '@/components/appointments/AppointmentList';
import { Appointment } from '@/utils/types';

// Mock appointment data
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
  },
  {
    id: '6',
    patientId: '1',
    patientName: 'Sarah Johnson',
    doctorId: '3',
    doctorName: 'Susan Lee',
    date: '2023-09-20',
    time: '1:30 PM',
    status: 'scheduled',
    reason: 'Follow-up'
  },
  {
    id: '7',
    patientId: '3',
    patientName: 'Emily Davis',
    doctorId: '2',
    doctorName: 'Jane Smith',
    date: '2023-09-19',
    time: '11:00 AM',
    status: 'scheduled',
    reason: 'Prescription refill'
  },
  {
    id: '8',
    patientId: '6',
    patientName: 'Robert Miller',
    doctorId: '1',
    doctorName: 'Robert Miller',
    date: '2023-09-13',
    time: '2:45 PM',
    status: 'completed',
    reason: 'X-ray results'
  }
];

export default function Appointments() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [tab, setTab] = useState('upcoming');
  
  // Filter appointments based on selected tab
  const upcomingAppointments = mockAppointments.filter(
    appointment => appointment.status === 'scheduled'
  );
  
  const completedAppointments = mockAppointments.filter(
    appointment => appointment.status === 'completed'
  );
  
  const canceledAppointments = mockAppointments.filter(
    appointment => appointment.status === 'canceled'
  );

  // Get appointments for a selected date
  const getAppointmentsForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return [];
    
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    return mockAppointments.filter(appointment => appointment.date === formattedDate);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-display font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">Schedule and manage patient appointments.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            Today
          </Button>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button size="sm" className="flex items-center">
            <Plus className="h-4 w-4 mr-1" />
            New Appointment
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="upcoming" value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming" className="relative px-4">
            Upcoming
            {upcomingAppointments.length > 0 && (
              <span className="ml-1 rounded-full bg-medical px-1.5 py-0.5 text-xs text-white">
                {upcomingAppointments.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="canceled">Canceled</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          <AppointmentList 
            appointments={upcomingAppointments} 
            title="Upcoming Appointments"
          />
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <AppointmentList 
            appointments={completedAppointments} 
            title="Completed Appointments"
          />
        </TabsContent>
        
        <TabsContent value="canceled" className="space-y-4">
          <AppointmentList 
            appointments={canceledAppointments} 
            title="Canceled Appointments"
          />
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="text-lg font-semibold mb-4">
              Appointments for {date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}
            </div>
            
            {date ? (
              getAppointmentsForDate(date).length > 0 ? (
                <div className="space-y-3">
                  {getAppointmentsForDate(date).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <h4 className="font-medium">{appointment.patientName}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>{appointment.time}</span>
                          <span className="mx-2">•</span>
                          <span>Dr. {appointment.doctorName}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No appointments for this date.</p>
                </div>
              )
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Please select a date to view appointments.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
