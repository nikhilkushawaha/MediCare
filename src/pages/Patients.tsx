
import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PatientCard from '@/components/patients/PatientCard';
import { Patient } from '@/utils/types';
import { db } from '@/utils/database';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for demonstration
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
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david.w@example.com',
    phone: '(555) 234-5678',
    birthDate: '1965-03-27',
    gender: 'male',
    bloodType: 'AB-',
    insurance: 'Medicare #34567',
    avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
  },
  {
    id: '5',
    name: 'Jessica Brown',
    email: 'jessica.b@example.com',
    phone: '(555) 876-5432',
    birthDate: '1989-12-05',
    gender: 'female',
    bloodType: 'O+',
    insurance: 'Cigna #45678',
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
  },
  {
    id: '6',
    name: 'Robert Miller',
    email: 'robert.m@example.com',
    phone: '(555) 345-6789',
    birthDate: '1972-07-18',
    gender: 'male',
    bloodType: 'A-',
    insurance: 'Humana #56789',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
  }
];

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const patientsPerPage = 6;

  // Load patients from database on component mount
  useEffect(() => {
    const storedPatients = db.getAll<Patient>('patients');
    if (Object.keys(storedPatients).length === 0) {
      // If no patients in DB, initialize with mock data
      mockPatients.forEach(patient => {
        db.create('patients', patient);
      });
      setPatients(mockPatients);
    } else {
      setPatients(Object.values(storedPatients));
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      const storedPatients = db.getAll<Patient>('patients');
      setPatients(Object.values(storedPatients));
      setIsLoading(false);
      toast({
        title: "Refreshed",
        description: "Patient data has been refreshed",
      });
    }, 800);
  };

  const handleAddPatient = (data: any) => {
    const newPatient: Patient = {
      id: `patient-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      birthDate: data.birthDate,
      gender: data.gender,
      bloodType: data.bloodType,
      insurance: data.insurance || '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`
    };
    
    db.create('patients', newPatient);
    setPatients([...patients, newPatient]);
    setIsAddPatientOpen(false);
    
    toast({
      title: "Patient Added",
      description: `${data.name} has been added successfully`,
    });
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value);
    setCurrentPage(1);
  };

  // Filter patients based on search term and filter type
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm);
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'male') return matchesSearch && patient.gender === 'male';
    if (filterType === 'female') return matchesSearch && patient.gender === 'female';
    
    // Blood type filters
    if (['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(filterType)) {
      return matchesSearch && patient.bloodType === filterType;
    }
    
    return matchesSearch;
  });

  // Calculate pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  // Form for adding a new patient
  const PatientForm = () => {
    const form = useForm({
      defaultValues: {
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        gender: 'male',
        bloodType: 'A+',
        insurance: ''
      }
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAddPatient)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="(555) 123-4567" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="bloodType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="insurance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insurance Information</FormLabel>
                  <FormControl>
                    <Input placeholder="Insurance provider & policy number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <DialogFooter>
            <Button type="submit">Add Patient</Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-display font-bold tracking-tight">Patients</h1>
        <p className="text-muted-foreground">Manage patient records and information.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search patients by name, email, or phone..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                Filter: {filterType === 'all' ? 'All' : filterType}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              <DropdownMenuLabel>Filter Patients By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleFilterChange('all')}>
                  All Patients
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Gender</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleFilterChange('male')}>
                  Male
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange('female')}>
                  Female
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Blood Type</DropdownMenuLabel>
                <div className="grid grid-cols-2 gap-1 p-1">
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                    <DropdownMenuItem key={type} onClick={() => handleFilterChange(type)}>
                      {type}
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Add New Patient
                </DialogTitle>
                <DialogDescription>
                  Fill in the patient details. All fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <PatientForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No patients found matching your search.</p>
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
