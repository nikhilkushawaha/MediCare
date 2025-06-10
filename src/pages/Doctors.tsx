
import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  UserPlus
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
import DoctorCard from '@/components/doctors/DoctorCard';
import { Doctor } from '@/utils/types';
import { db } from '@/utils/database';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for demonstration
const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Robert Miller',
    specialty: 'Cardiology',
    email: 'robert.miller@hospital.com',
    phone: '(555) 123-4567',
    availability: ['Mon', 'Wed', 'Fri'],
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
  },
  {
    id: '2',
    name: 'Jane Smith',
    specialty: 'Neurology',
    email: 'jane.smith@hospital.com',
    phone: '(555) 234-5678',
    availability: ['Tue', 'Thu', 'Sat'],
    rating: 4.6,
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
  },
  {
    id: '3',
    name: 'Susan Lee',
    specialty: 'Pediatrics',
    email: 'susan.lee@hospital.com',
    phone: '(555) 345-6789',
    availability: ['Mon', 'Tue', 'Thu', 'Fri'],
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
  },
  {
    id: '4',
    name: 'Michael Johnson',
    specialty: 'Orthopedics',
    email: 'michael.j@hospital.com',
    phone: '(555) 456-7890',
    availability: ['Wed', 'Fri'],
    rating: 4.5,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
  },
  {
    id: '5',
    name: 'Emily Chen',
    specialty: 'Dermatology',
    email: 'emily.c@hospital.com',
    phone: '(555) 567-8901',
    availability: ['Mon', 'Thu', 'Sat'],
    rating: 4.7,
    avatar: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
  },
  {
    id: '6',
    name: 'David Wilson',
    specialty: 'Ophthalmology',
    email: 'david.w@hospital.com',
    phone: '(555) 678-9012',
    availability: ['Tue', 'Wed', 'Fri'],
    rating: 4.4,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
  }
];

export default function Doctors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const doctorsPerPage = 6;

  // Load doctors from database on component mount
  useEffect(() => {
    const storedDoctors = db.getAll<Doctor>('doctors');
    if (Object.keys(storedDoctors).length === 0) {
      // If no doctors in DB, initialize with mock data
      mockDoctors.forEach(doctor => {
        db.create('doctors', doctor);
      });
      setDoctors(mockDoctors);
    } else {
      setDoctors(Object.values(storedDoctors));
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      const storedDoctors = db.getAll<Doctor>('doctors');
      setDoctors(Object.values(storedDoctors));
      setIsLoading(false);
      toast({
        title: "Refreshed",
        description: "Doctor data has been refreshed",
      });
    }, 800);
  };

  const handleAddDoctor = (data: any) => {
    const newDoctor: Doctor = {
      id: `doctor-${Date.now()}`,
      name: data.name,
      specialty: data.specialty,
      email: data.email,
      phone: data.phone,
      availability: data.availability.split(',').map((day: string) => day.trim()),
      rating: parseFloat(data.rating) || 4.5,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`
    };
    
    db.create('doctors', newDoctor);
    setDoctors([...doctors, newDoctor]);
    setIsAddDoctorOpen(false);
    
    toast({
      title: "Doctor Added",
      description: `Dr. ${data.name} has been added successfully`,
    });
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value);
    setCurrentPage(1);
  };

  // Filter doctors based on search term and filter type
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    
    // Specialty filters
    if (['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Ophthalmology'].includes(filterType)) {
      return matchesSearch && doctor.specialty === filterType;
    }
    
    // Rating filters
    if (filterType === 'rating-high') return matchesSearch && (doctor.rating || 0) >= 4.5;
    if (filterType === 'rating-medium') return matchesSearch && (doctor.rating || 0) >= 4.0 && (doctor.rating || 0) < 4.5;
    if (filterType === 'rating-low') return matchesSearch && (doctor.rating || 0) < 4.0;
    
    return matchesSearch;
  });

  // Calculate pagination
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  // Form for adding a new doctor
  const DoctorForm = () => {
    const form = useForm({
      defaultValues: {
        name: '',
        specialty: 'Cardiology',
        email: '',
        phone: '',
        availability: 'Mon, Wed, Fri',
        rating: '4.5'
      }
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAddDoctor)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Dr. John Smith" {...field} required />
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
                    <Input type="email" placeholder="john.smith@hospital.com" {...field} required />
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
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="Dermatology">Dermatology</SelectItem>
                      <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                      <SelectItem value="General Practice">General Practice</SelectItem>
                      <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Rating</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="5.0">5.0</SelectItem>
                      <SelectItem value="4.9">4.9</SelectItem>
                      <SelectItem value="4.8">4.8</SelectItem>
                      <SelectItem value="4.7">4.7</SelectItem>
                      <SelectItem value="4.6">4.6</SelectItem>
                      <SelectItem value="4.5">4.5</SelectItem>
                      <SelectItem value="4.0">4.0</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability</FormLabel>
                <FormControl>
                  <Input placeholder="Mon, Wed, Fri" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <DialogFooter>
            <Button type="submit">Add Doctor</Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-display font-bold tracking-tight">Doctors</h1>
        <p className="text-muted-foreground">View and manage hospital staff information.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search doctors by name, specialty..."
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
              <DropdownMenuLabel>Filter Doctors By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleFilterChange('all')}>
                  All Doctors
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Specialty</DropdownMenuLabel>
                {['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Ophthalmology'].map(specialty => (
                  <DropdownMenuItem key={specialty} onClick={() => handleFilterChange(specialty)}>
                    {specialty}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Rating</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleFilterChange('rating-high')}>
                  High (4.5+)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange('rating-medium')}>
                  Medium (4.0-4.4)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange('rating-low')}>
                  Low (Below 4.0)
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={isAddDoctorOpen} onOpenChange={setIsAddDoctorOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Add New Doctor
                </DialogTitle>
                <DialogDescription>
                  Fill in the doctor details. All fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <DoctorForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No doctors found matching your search.</p>
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
