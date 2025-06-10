
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, MapPin, Video, Info, Check, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { Doctor, Department } from '@/utils/types';
import { toast } from 'sonner';

// Mock data for doctors
const mockDoctors: Doctor[] = [
  {
    _id: '1',
    userId: 'u1',
    name: 'Dr. Robert Miller',
    specialty: 'Cardiology',
    email: 'robert.miller@example.com',
    phone: '(555) 123-4567',
    availability: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'],
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    bio: 'Specializes in cardiovascular disease diagnosis and treatment with 15+ years of experience.',
    department: 'cardiology',
    consultationType: ['video', 'in-person'],
    consultationFee: 150
  },
  {
    _id: '2',
    userId: 'u2',
    name: 'Dr. Jane Smith',
    specialty: 'Dermatology',
    email: 'jane.smith@example.com',
    phone: '(555) 234-5678',
    availability: ['10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '4:00 PM'],
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    bio: 'Board-certified dermatologist specializing in skin cancer detection and treatment.',
    department: 'dermatology',
    consultationType: ['in-person'],
    consultationFee: 175
  },
  {
    _id: '3',
    userId: 'u3',
    name: 'Dr. Susan Lee',
    specialty: 'Neurology',
    email: 'susan.lee@example.com',
    phone: '(555) 345-6789',
    availability: ['9:30 AM', '11:30 AM', '1:30 PM', '3:30 PM'],
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    bio: 'Neurologist with expertise in headache treatment and movement disorders.',
    department: 'neurology',
    consultationType: ['video', 'in-person'],
    consultationFee: 200
  },
  {
    _id: '4',
    userId: 'u4',
    name: 'Dr. Michael Thompson',
    specialty: 'Orthopedics',
    email: 'michael.thompson@example.com',
    phone: '(555) 456-7890',
    availability: ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'],
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    bio: 'Orthopedic surgeon specializing in sports medicine and joint replacement.',
    department: 'orthopedics',
    consultationType: ['in-person'],
    consultationFee: 225
  },
  {
    _id: '5',
    userId: 'u5',
    name: 'Dr. Emily Davis',
    specialty: 'Pediatrics',
    email: 'emily.davis@example.com',
    phone: '(555) 567-8901',
    availability: ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM'],
    avatar: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    bio: 'Pediatrician with a focus on childhood development and preventive care.',
    department: 'pediatrics',
    consultationType: ['video', 'in-person'],
    consultationFee: 135
  }
];

// Mock data for departments
const mockDepartments: Department[] = [
  { _id: 'cardiology', name: 'Cardiology', description: 'Heart and cardiovascular conditions', icon: '❤️' },
  { _id: 'dermatology', name: 'Dermatology', description: 'Skin conditions', icon: '🧬' },
  { _id: 'neurology', name: 'Neurology', description: 'Brain and nervous system disorders', icon: '🧠' },
  { _id: 'orthopedics', name: 'Orthopedics', description: 'Bone and joint issues', icon: '🦴' },
  { _id: 'pediatrics', name: 'Pediatrics', description: 'Children\'s health', icon: '👶' },
  { _id: 'ophthalmology', name: 'Ophthalmology', description: 'Eye care', icon: '👁️' },
  { _id: 'psychiatry', name: 'Psychiatry', description: 'Mental health services', icon: '🧘' },
  { _id: 'general', name: 'General Medicine', description: 'Primary care', icon: '🏥' }
];

export default function BookAppointment() {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [appointmentType, setAppointmentType] = useState<'video' | 'in-person'>('in-person');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter doctors based on department and appointment type
  useEffect(() => {
    let filtered = mockDoctors;
    
    if (selectedDepartment) {
      filtered = filtered.filter(doctor => doctor.department === selectedDepartment);
    }
    
    filtered = filtered.filter(doctor => doctor.consultationType.includes(appointmentType));
    
    setFilteredDoctors(filtered);
    
    // Reset selected doctor if not in filtered list
    if (selectedDoctor && !filtered.some(d => d._id === selectedDoctor)) {
      setSelectedDoctor('');
      setSelectedTime('');
    }
  }, [selectedDepartment, appointmentType, selectedDoctor]);

  // Update current doctor when selection changes
  useEffect(() => {
    if (selectedDoctor) {
      const doctor = mockDoctors.find(d => d._id === selectedDoctor) || null;
      setCurrentDoctor(doctor);
    } else {
      setCurrentDoctor(null);
    }
  }, [selectedDoctor]);

  const handleAppointmentTypeChange = (value: string) => {
    setAppointmentType(value as 'video' | 'in-person');
    // Reset department and doctor when changing appointment type
    setSelectedDepartment('');
    setSelectedDoctor('');
    setSelectedTime('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDoctor || !selectedDate || !selectedTime || !reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Appointment booked successfully!');
      setIsSubmitting(false);
      navigate('/appointments');
    }, 1500);
  };

  const isFormComplete = selectedDoctor && selectedDate && selectedTime && reason.trim();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-display font-bold tracking-tight">Book an Appointment</h1>
        <p className="text-muted-foreground">
          Schedule an appointment with a healthcare professional.
        </p>
      </div>
      
      <Tabs defaultValue="in-person" onValueChange={handleAppointmentTypeChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="in-person" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            In-Person Visit
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Video Consultation
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Select a Department & Doctor</CardTitle>
              <CardDescription>
                Choose a department and doctor for your {appointmentType === 'video' ? 'video consultation' : 'in-person visit'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDepartments.map(dept => (
                      <SelectItem key={dept._id?.toString() || dept.id} value={dept._id?.toString() || dept.id?.toString() || ''}>
                        <span className="mr-2">{dept.icon}</span> {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor</Label>
                <Select
                  value={selectedDoctor}
                  onValueChange={setSelectedDoctor}
                  disabled={filteredDoctors.length === 0}
                >
                  <SelectTrigger id="doctor">
                    <SelectValue placeholder={
                      filteredDoctors.length === 0 
                        ? `No doctors available for ${appointmentType}` 
                        : "Select a doctor"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredDoctors.map(doctor => (
                      <SelectItem key={doctor._id?.toString() || doctor.id} value={doctor._id?.toString() || doctor.id?.toString() || ''}>
                        {doctor.name} - {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {currentDoctor && (
                <Card className="bg-muted/50 mt-4">
                  <CardContent className="pt-4">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={currentDoctor.avatar} 
                        alt={currentDoctor.name} 
                        className="h-16 w-16 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium">{currentDoctor.name}</h4>
                        <p className="text-sm text-muted-foreground">{currentDoctor.specialty}</p>
                        <div className="mt-2 flex items-center text-sm">
                          <Info className="mr-1 h-3 w-3 text-muted-foreground" />
                          Fee: ${currentDoctor.consultationFee}
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                          {currentDoctor.bio}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
              <CardDescription>
                Select a date and time for your appointment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={!selectedDoctor}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Time</Label>
                <RadioGroup value={selectedTime} onValueChange={setSelectedTime} disabled={!selectedDoctor}>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {currentDoctor?.availability.map((time) => (
                      <Label
                        key={time}
                        htmlFor={time}
                        className={`flex cursor-pointer items-center justify-center rounded-md border border-muted p-2 text-sm ${
                          selectedTime === time ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                        }`}
                      >
                        <RadioGroupItem
                          value={time}
                          id={time}
                          className="sr-only"
                        />
                        <Clock className="mr-1 h-3 w-3" />
                        {time}
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Textarea
                  id="reason"
                  placeholder="Briefly describe your symptoms or reason for appointment..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={!selectedDoctor}
                  className="min-h-24"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Appointment Type</h3>
                  <p className="font-medium flex items-center">
                    {appointmentType === 'video' ? (
                      <>
                        <Video className="mr-2 h-4 w-4" />
                        Video Consultation
                      </>
                    ) : (
                      <>
                        <MapPin className="mr-2 h-4 w-4" />
                        In-Person Visit
                      </>
                    )}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Doctor</h3>
                  <p className="font-medium">{currentDoctor?.name || "Not selected"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date & Time</h3>
                  <p className="font-medium">
                    {selectedDate ? format(selectedDate, 'PP') : "Not selected"}{selectedTime ? `, ${selectedTime}` : ""}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Fee</h3>
                  <p className="font-medium">${currentDoctor?.consultationFee || "-"}</p>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                size="lg" 
                disabled={!isFormComplete || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking Appointment...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Confirm Appointment
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
