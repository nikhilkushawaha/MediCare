
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  FileText, 
  Download,
  User,
  CalendarDays,
  Clock,
  Pill,
  ChevronLeft,
  ChevronRight,
  Clipboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { Patient, MedicalRecord } from '@/utils/types';

// Mock data for patients
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

// Mock data for medical records
const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    date: '2023-09-10',
    diagnosis: 'Hypertension',
    prescription: ['Lisinopril 10mg', 'Hydrochlorothiazide 12.5mg'],
    notes: 'Patient reported occasional headaches and dizziness. BP elevated at 142/90.'
  },
  {
    id: '2',
    patientId: '1',
    doctorId: '2',
    date: '2023-08-15',
    diagnosis: 'Seasonal Allergies',
    prescription: ['Cetirizine 10mg'],
    notes: 'Patient experiencing nasal congestion and itchy eyes due to seasonal allergies.'
  },
  {
    id: '3',
    patientId: '1',
    doctorId: '1',
    date: '2023-07-22',
    diagnosis: 'Annual Physical',
    prescription: [],
    notes: 'Routine physical examination. All vitals within normal range.'
  },
  {
    id: '4',
    patientId: '2',
    doctorId: '3',
    date: '2023-09-05',
    diagnosis: 'Lower Back Pain',
    prescription: ['Ibuprofen 400mg', 'Cyclobenzaprine 5mg'],
    notes: 'Patient reported pain after lifting heavy objects. Recommended physical therapy.'
  },
  {
    id: '5',
    patientId: '3',
    doctorId: '2',
    date: '2023-09-12',
    diagnosis: 'Migraine',
    prescription: ['Sumatriptan 50mg'],
    notes: 'Patient reports recurring migraines. Discussed potential triggers and lifestyle modifications.'
  }
];

export default function MedicalRecords() {
  const [searchParams] = useSearchParams();
  const patientIdFromUrl = searchParams.get('patient');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Select patient from URL parameter if available
  useEffect(() => {
    if (patientIdFromUrl) {
      const patient = mockPatients.find(p => p.id === patientIdFromUrl) || null;
      setSelectedPatient(patient);
    }
  }, [patientIdFromUrl]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Filter records based on selected patient and search term
  const getFilteredRecords = () => {
    let records = mockMedicalRecords;
    
    if (selectedPatient) {
      records = records.filter(record => record.patientId === selectedPatient.id);
    }
    
    if (searchTerm) {
      records = records.filter(record => 
        record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.prescription?.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return records;
  };

  const filteredRecords = getFilteredRecords();
  
  // Calculate pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handlePatientSelect = (patient: Patient | null) => {
    setSelectedPatient(patient);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-display font-bold tracking-tight">Medical Records</h1>
        <p className="text-muted-foreground">View and manage patient medical history.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search patients..."
              className="pl-9 w-full"
            />
          </div>
          
          <div className="bg-accent/30 rounded-lg p-2 space-y-2">
            <div className="font-medium px-2 py-1">Select Patient</div>
            {mockPatients.map(patient => (
              <div
                key={patient.id}
                className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors ${
                  selectedPatient?.id === patient.id
                    ? 'bg-medical text-white'
                    : 'hover:bg-accent'
                }`}
                onClick={() => handlePatientSelect(patient)}
              >
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={patient.avatar} alt={patient.name} />
                  <AvatarFallback className={`${
                    selectedPatient?.id === patient.id
                      ? 'bg-white text-medical'
                      : 'bg-medical/10 text-medical'
                  }`}>
                    {getInitials(patient.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm leading-none">{patient.name}</div>
                  <div className="text-xs mt-1">ID: {patient.id}</div>
                </div>
              </div>
            ))}
            <div 
              className="flex items-center justify-center p-2 border border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors mt-2"
              onClick={() => handlePatientSelect(null)}
            >
              <span className="text-xs text-muted-foreground">View All Records</span>
            </div>
          </div>
          
          {selectedPatient && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src={selectedPatient.avatar} alt={selectedPatient.name} />
                    <AvatarFallback className="bg-medical/10 text-medical">
                      {getInitials(selectedPatient.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{selectedPatient.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(selectedPatient.birthDate).toLocaleDateString()} • {selectedPatient.gender}
                    </div>
                  </div>
                </div>
                
                <Separator className="my-2" />
                
                <div className="grid gap-1">
                  <div className="flex items-center text-sm">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">Blood Type: {selectedPatient.bloodType || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">Age: {new Date().getFullYear() - new Date(selectedPatient.birthDate).getFullYear()}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clipboard className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">{selectedPatient.insurance}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View Full Profile
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
        
        <div className="md:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search medical records..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button size="sm" className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                New Record
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Records</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {currentRecords.length > 0 ? (
                <div className="space-y-4">
                  {currentRecords.map((record) => {
                    const patient = mockPatients.find(p => p.id === record.patientId);
                    
                    return (
                      <Card key={record.id} className="overflow-hidden hover:shadow-md transition-all duration-300">
                        <div className={`h-1 w-full bg-medical`}></div>
                        <CardHeader className="pb-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center space-x-3">
                              {selectedPatient ? (
                                <div className="flex flex-col">
                                  <CardTitle className="text-lg">{record.diagnosis}</CardTitle>
                                  <CardDescription className="flex items-center">
                                    <CalendarDays className="mr-1 h-3 w-3" /> 
                                    {record.date}
                                  </CardDescription>
                                </div>
                              ) : (
                                <>
                                  <Avatar className="h-10 w-10 border">
                                    <AvatarImage src={patient?.avatar} alt={patient?.name} />
                                    <AvatarFallback className="bg-medical/10 text-medical">
                                      {patient ? getInitials(patient.name) : "?"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <CardTitle className="text-lg">{patient?.name}</CardTitle>
                                    <CardDescription className="flex items-center">
                                      <CalendarDays className="mr-1 h-3 w-3" /> 
                                      {record.date}
                                    </CardDescription>
                                  </div>
                                </>
                              )}
                            </div>
                            <Badge className="bg-medical text-white">
                              {record.diagnosis}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="grid gap-2">
                            {record.notes && (
                              <div className="text-sm">{record.notes}</div>
                            )}
                            {record.prescription && record.prescription.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {record.prescription.map((med, index) => (
                                  <Badge key={index} variant="outline" className="flex items-center bg-accent/50">
                                    <Pill className="mr-1 h-3 w-3" />
                                    {med}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-2 flex justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-medical hover:text-medical/80 hover:bg-medical/10"
                          >
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                  
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-accent/30 rounded-lg p-8 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Records Found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {selectedPatient 
                      ? `No medical records found for ${selectedPatient.name}. Create a new record to get started.`
                      : "No medical records match your search criteria. Try adjusting your filters or create a new record."}
                  </p>
                  <Button className="mt-4">Create New Record</Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recent">
              <div className="text-muted-foreground text-center py-12">
                Recent records content coming soon.
              </div>
            </TabsContent>
            
            <TabsContent value="diagnoses">
              <div className="text-muted-foreground text-center py-12">
                Diagnoses content coming soon.
              </div>
            </TabsContent>
            
            <TabsContent value="prescriptions">
              <div className="text-muted-foreground text-center py-12">
                Prescriptions content coming soon.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
