import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, LayoutGrid, List, ShoppingCart, Pill, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Medication, Prescription, Patient } from '@/utils/types';
import { db } from '@/utils/database';
import { toast } from '@/components/ui/use-toast';

// Mock data for demonstration
const mockMedications: Medication[] = [
  {
    _id: '1',
    name: 'Amoxicillin',
    description: 'A common antibiotic used to treat bacterial infections.',
    sideEffects: ['Nausea', 'Diarrhea'],
    interactions: ['Warfarin'],
    stock: 50,
    price: 12.99,
    category: 'Antibiotics',
    requiresPrescription: true,
    dosageForm: 'Capsule',
    manufacturer: 'PharmaCorp'
  },
  {
    _id: '2',
    name: 'Lisinopril',
    description: 'An ACE inhibitor used to treat high blood pressure and heart failure.',
    sideEffects: ['Dizziness', 'Cough'],
    interactions: ['NSAIDs'],
    stock: 100,
    price: 8.50,
    category: 'Cardiovascular',
    requiresPrescription: true,
    dosageForm: 'Tablet',
    manufacturer: 'MediGenix'
  },
  {
    _id: '3',
    name: 'Ibuprofen',
    description: 'A nonsteroidal anti-inflammatory drug (NSAID) used to relieve pain and reduce fever.',
    sideEffects: ['Stomach pain', 'Headache'],
    interactions: ['Aspirin'],
    stock: 200,
    price: 5.75,
    category: 'Pain Relief',
    requiresPrescription: false,
    dosageForm: 'Tablet',
    manufacturer: 'HealthFirst'
  },
  {
    _id: '4',
    name: 'Metformin',
    description: 'A medication used to treat type 2 diabetes.',
    sideEffects: ['Nausea', 'Vomiting'],
    interactions: ['Alcohol'],
    stock: 75,
    price: 10.20,
    category: 'Diabetes',
    requiresPrescription: true,
    dosageForm: 'Tablet',
    manufacturer: 'GlucoControl'
  },
  {
    _id: '5',
    name: 'Cetirizine',
    description: 'An antihistamine used to relieve allergy symptoms.',
    sideEffects: ['Drowsiness', 'Dry mouth'],
    interactions: [],
    stock: 150,
    price: 7.00,
    category: 'Allergy',
    requiresPrescription: false,
    dosageForm: 'Tablet',
    manufacturer: 'AllergyEase'
  },
  {
    _id: '6',
    name: 'Omeprazole',
    description: 'A proton pump inhibitor (PPI) used to reduce stomach acid production.',
    sideEffects: ['Headache', 'Constipation'],
    interactions: ['Clopidogrel'],
    stock: 60,
    price: 9.50,
    category: 'Gastrointestinal',
    requiresPrescription: true,
    dosageForm: 'Capsule',
    manufacturer: 'AcidRelief'
  }
];

const mockPrescriptions: Prescription[] = [
  {
    _id: 'p1',
    patientId: 'patient1',
    doctorId: 'doctor1',
    medicationName: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Twice daily',
    startDate: '2023-01-15',
    endDate: '2023-01-25',
    instructions: 'Take with food',
    status: 'active'
  },
  {
    _id: 'p2',
    patientId: 'patient2',
    doctorId: 'doctor2',
    medicationName: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    startDate: '2023-02-01',
    endDate: '2023-12-31',
    instructions: 'Take in the morning',
    status: 'active'
  },
  {
    _id: 'p3',
    patientId: 'patient1',
    doctorId: 'doctor1',
    medicationName: 'Ibuprofen',
    dosage: '200mg',
    frequency: 'As needed',
    startDate: '2023-03-10',
    endDate: '2023-03-15',
    instructions: 'Take with food',
    status: 'completed'
  }
];

export default function Pharmacy() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState('all');
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [cart, setCart] = useState<Medication[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Medication | null>(null);
  const [openCheckout, setOpenCheckout] = useState(false);

  useEffect(() => {
    const storedMedications = db.getAll<Medication>('medications');
    if (Object.keys(storedMedications).length === 0) {
      mockMedications.forEach(medication => {
        db.create('medications', medication);
      });
      setMedications(mockMedications);
    } else {
      setMedications(Object.values(storedMedications));
    }
  }, []);

  const filteredMedications = medications.filter((medication) => {
    const matchesSearch = medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medication.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'all') return matchesSearch;
    return matchesSearch && medication.category === filter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedications = filteredMedications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMedications.length / itemsPerPage);

  const handleAddToCart = (medication: Medication) => {
    setCart([...cart, medication]);
    toast({
      title: "Added to cart",
      description: `${medication.name} has been added to your cart`,
    });
  };

  const handleRemoveFromCart = (medication: Medication) => {
    setCart(cart.filter((item) => item._id !== medication._id));
    toast({
      title: "Removed from cart",
      description: `${medication.name} has been removed from your cart`,
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const handleCheckout = () => {
    setOpenCheckout(true);
    setTimeout(() => {
      setCart([]);
      setOpenCheckout(false);
      toast.success('Thank you for your purchase!');
    }, 2000);
  };

  // Component JSX
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-display font-bold tracking-tight">Pharmacy</h1>
        <p className="text-muted-foreground">
          Browse and purchase medications.
        </p>
      </div>
      
      <Tabs defaultValue="medications">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="medications" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search medications..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilter('all')}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('Antibiotics')}>Antibiotics</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('Cardiovascular')}>Cardiovascular</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('Pain Relief')}>Pain Relief</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('Diabetes')}>Diabetes</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('Allergy')}>Allergy</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('Gastrointestinal')}>Gastrointestinal</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                {viewMode === 'grid' ? <List className="h-4 w-4 mr-1" /> : <LayoutGrid className="h-4 w-4 mr-1" />}
                {viewMode === 'grid' ? 'List' : 'Grid'}
              </Button>
            </div>
          </div>
          
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : ''}`}>
            {currentMedications.map((medication) => (
              <Card 
                key={medication._id?.toString() || medication.id?.toString() || String(Math.random())}
                className={viewMode === 'grid' ? '' : 'flex flex-row overflow-hidden'}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{medication.name}</CardTitle>
                  {medication.requiresPrescription && (
                    <Badge variant="secondary">Rx</Badge>
                  )}
                </CardHeader>
                <CardContent>
                  {viewMode === 'grid' ? (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground line-clamp-2">{medication.description}</p>
                      <p className="text-sm font-medium">${medication.price.toFixed(2)}</p>
                      <Button size="sm" onClick={() => {
                        setSelectedItem(medication);
                        setOpenDialog(true);
                      }}>
                        Details
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">${medication.price.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{medication.description}</p>
                      </div>
                      <Button size="sm" onClick={() => {
                        setSelectedItem(medication);
                        setOpenDialog(true);
                      }}>
                        Details
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
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
        </TabsContent>
        
        <TabsContent value="prescriptions" className="space-y-4 mt-4">
          {prescriptions.length > 0 ? (
            <>
              {prescriptions.map((prescription) => (
                <Card 
                  key={prescription._id?.toString() || prescription.id?.toString() || String(Math.random())}
                  className="flex flex-col md:flex-row overflow-hidden"
                >
                  <CardContent>
                    <div className="md:mr-4">
                      <h3 className="text-lg font-semibold">{prescription.medicationName}</h3>
                      <p className="text-muted-foreground">Dosage: {prescription.dosage}</p>
                      <p className="text-muted-foreground">Frequency: {prescription.frequency}</p>
                      <p className="text-muted-foreground">
                        {new Date(prescription.startDate).toLocaleDateString()} - {new Date(prescription.endDate).toLocaleDateString()}
                      </p>
                      <Badge className="mt-2">{prescription.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <div className="text-center py-12">
              <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No Prescriptions</h3>
              <p className="text-muted-foreground mt-2">
                You don't have any active prescriptions at the moment.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="fixed bottom-0 left-0 w-full bg-white border-t z-10">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span className="font-medium">Cart ({cart.length})</span>
          </div>
          <div className="font-medium">Total: ${calculateTotal()}</div>
          <Button onClick={() => setOpenCheckout(true)} disabled={cart.length === 0}>
            Checkout
          </Button>
        </div>
      </div>
      
      {selectedItem && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedItem.name}</DialogTitle>
              <DialogDescription>
                Details and information about this medication.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Category</h4>
                <p className="text-sm text-muted-foreground">{selectedItem.category}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Manufacturer</h4>
                <p className="text-sm text-muted-foreground">{selectedItem.manufacturer}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Dosage Form</h4>
                <p className="text-sm text-muted-foreground">{selectedItem.dosageForm}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Side Effects</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedItem.sideEffects && selectedItem.sideEffects.map((effect, i) => (
                    <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {effect}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Interactions</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedItem.interactions && selectedItem.interactions.map((interaction, i) => (
                    <Badge key={i} variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      {interaction}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => handleAddToCart(selectedItem)}>Add to Cart</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {openCheckout && (
        <Dialog open={openCheckout} onOpenChange={setOpenCheckout}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Checkout</DialogTitle>
              <DialogDescription>
                Confirm your order and complete the purchase.
              </DialogDescription>
            </DialogHeader>
            <div className="divide-y divide-border">
              {cart.map((item) => (
                <div key={item._id} className="grid grid-cols-[1fr_100px] gap-4 py-4">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="font-medium text-sm">${item.price.toFixed(2)}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveFromCart(item)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="py-4 text-right space-x-2">
              <span className="text-lg font-medium">Total: ${calculateTotal()}</span>
            </div>
            <DialogFooter>
              <Button onClick={handleCheckout}>
                Confirm Purchase
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
