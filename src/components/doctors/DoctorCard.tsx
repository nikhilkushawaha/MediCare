
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Star, Calendar } from 'lucide-react';
import { Doctor } from '@/utils/types';
import { useNavigate } from 'react-router-dom';

interface DoctorCardProps {
  doctor: Doctor;
  compact?: boolean;
}

export default function DoctorCard({ doctor, compact = false }: DoctorCardProps) {
  const navigate = useNavigate();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const renderRating = (rating: number = 0) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ));
  };

  if (compact) {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:bg-accent/5">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={doctor.avatar} alt={doctor.name} />
              <AvatarFallback className="bg-medical/10 text-medical">
                {getInitials(doctor.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium leading-none">{doctor.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{doctor.specialty}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:bg-accent/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border">
              <AvatarImage src={doctor.avatar} alt={doctor.name} />
              <AvatarFallback className="bg-medical/10 text-medical">
                {getInitials(doctor.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">Dr. {doctor.name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                {renderRating(doctor.rating)}
                <span className="ml-1 text-xs">{doctor.rating?.toFixed(1) || 'No ratings'}</span>
              </CardDescription>
            </div>
          </div>
          <Badge className="bg-medical text-white">
            {doctor.specialty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid gap-2">
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{doctor.phone}</span>
          </div>
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{doctor.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Available: </span>
            <span className="ml-1">{doctor.availability ? doctor.availability.join(', ') : 'Not specified'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full hover:bg-medical hover:text-white transition-colors"
          onClick={() => navigate('/appointments')}
        >
          Schedule Appointment
        </Button>
      </CardFooter>
    </Card>
  );
}
