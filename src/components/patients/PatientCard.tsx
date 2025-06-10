
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
import { Phone, Mail, Clock, FileText } from 'lucide-react';
import { Patient } from '@/utils/types';
import { useNavigate } from 'react-router-dom';

interface PatientCardProps {
  patient: Patient;
  compact?: boolean;
}

export default function PatientCard({ patient, compact = false }: PatientCardProps) {
  const navigate = useNavigate();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  if (compact) {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:bg-accent/5">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={patient.avatar} alt={patient.name} />
              <AvatarFallback className="bg-medical/10 text-medical">
                {getInitials(patient.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium leading-none">{patient.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{patient.birthDate} • {patient.gender}</p>
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
              <AvatarImage src={patient.avatar} alt={patient.name} />
              <AvatarFallback className="bg-medical/10 text-medical">
                {getInitials(patient.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{patient.name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Clock className="mr-1 h-3 w-3" /> 
                {new Date(patient.birthDate).toLocaleDateString()} • {patient.bloodType || 'Unknown Blood Type'}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="bg-accent">
            {patient.gender === 'male' ? 'Male' : patient.gender === 'female' ? 'Female' : 'Other'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid gap-2">
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{patient.phone}</span>
          </div>
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{patient.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{patient.insurance || 'No insurance'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full hover:bg-medical hover:text-white transition-colors"
          onClick={() => navigate(`/records?patient=${patient._id || patient.id}`)}
        >
          View Medical Records
        </Button>
      </CardFooter>
    </Card>
  );
}
