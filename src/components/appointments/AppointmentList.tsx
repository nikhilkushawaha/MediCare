
import { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Appointment } from '@/utils/types';

interface AppointmentListProps {
  appointments: Appointment[];
  title?: string;
  showFilter?: boolean;
}

export default function AppointmentList({ 
  appointments,
  title = "Upcoming Appointments",
  showFilter = true
}: AppointmentListProps) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'canceled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'canceled':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesFilter = filter === 'all' || appointment.status === filter;
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="text-xl">{title}</CardTitle>
          {showFilter && (
            <div className="flex items-center space-x-2">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-9 w-full sm:w-[180px] rounded-full"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {paginatedAppointments.length > 0 ? (
            paginatedAppointments.map((appointment) => (
              <div
                key={appointment._id || appointment.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src="" alt={appointment.patientName} />
                    <AvatarFallback className="bg-medical/10 text-medical">
                      {getInitials(appointment.patientName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{appointment.patientName}</h4>
                    <p className="text-sm text-muted-foreground">with Dr. {appointment.doctorName}</p>
                  </div>
                </div>
                
                <div className="flex items-center mt-2 sm:mt-0">
                  <div className="flex items-center mr-4 text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center mr-4 text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{appointment.time}</span>
                  </div>
                  <Badge 
                    className={`flex items-center space-x-1 ${getStatusColor(appointment.status)}`}
                    variant="outline"
                  >
                    {getStatusIcon(appointment.status)}
                    <span>{appointment.status}</span>
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No appointments found.
            </div>
          )}
          
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
      </CardContent>
    </Card>
  );
}
