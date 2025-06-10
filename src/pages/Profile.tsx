
import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, UserCircle, Building, Shield, Edit, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function Profile() {
  const { state, updateUserProfile } = useAuth();
  const { user } = state;
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, CA 12345',
    specialty: user?.specialty || '',
    dateJoined: user?.dateJoined || new Date().toISOString().split('T')[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateUserProfile({
      name: formData.name,
      specialty: formData.specialty
    });
    setIsEditing(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-600 hover:bg-red-700';
      case 'doctor': return 'bg-blue-600 hover:bg-blue-700';
      case 'patient': return 'bg-green-600 hover:bg-green-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-display font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          View and manage your personal information.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-2">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-medical text-white text-lg">
                {user?.name ? getInitials(user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{user?.name}</CardTitle>
            <CardDescription className="flex justify-center">
              <Badge className={getRoleBadgeColor(user?.role || '')}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-sm">
              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
              {user?.email}
            </div>
            <div className="flex items-center text-sm">
              <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
              (555) 123-4567
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              Joined {new Date(user?.dateJoined || Date.now()).toLocaleDateString()}
            </div>
            {user?.role === 'doctor' && user?.specialty && (
              <div className="flex items-center text-sm">
                <UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                {user.specialty}
              </div>
            )}
            <div className="flex items-center text-sm">
              <Building className="mr-2 h-4 w-4 text-muted-foreground" />
              123 Main St, Anytown, CA 12345
            </div>
            <div className="flex items-center text-sm">
              <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
              {user?.isVerified ? 'Verified Account' : 'Unverified Account'}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant={isEditing ? "default" : "outline"}
              className="w-full"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Manage your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={true} // Email cannot be changed
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    {user?.role === 'doctor' && (
                      <div className="space-y-2">
                        <Label htmlFor="specialty">Specialty</Label>
                        <Input
                          id="specialty"
                          name="specialty"
                          value={formData.specialty}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {user?.role === 'patient' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Information</CardTitle>
                    <CardDescription>
                      Your personal medical details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-muted-foreground text-sm">Blood Type</Label>
                        <p className="font-medium">A+</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">Height</Label>
                        <p className="font-medium">5'10" (178 cm)</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">Weight</Label>
                        <p className="font-medium">160 lbs (72.5 kg)</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">Allergies</Label>
                        <p className="font-medium">Penicillin, Peanuts</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="text-muted-foreground text-sm">Current Medications</Label>
                      <ul className="list-disc list-inside mt-1">
                        <li>Lisinopril (10mg, once daily)</li>
                        <li>Metformin (500mg, twice daily)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <Label className="text-muted-foreground text-sm">Emergency Contact</Label>
                      <p className="font-medium mt-1">Sarah Johnson (Spouse) - (555) 987-6543</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => toast.info('Medical information update feature coming soon!')}>
                      Update Medical Information
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" placeholder="••••••••" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => toast.info('Password update feature coming soon!')}>
                    Update Password
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Two-factor authentication adds an additional layer of security to your
                    account by requiring more than just a password to sign in.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => toast.info('2FA feature coming soon!')}>
                    Enable Two-Factor Authentication
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive email notifications for appointments and updates
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive text messages for appointment reminders
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Marketing Communications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about new services and features
                        </p>
                      </div>
                      <Switch checked={false} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => toast.success('Preferences saved!')}>
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Simple Switch component since we don't have it imported
function Switch({ checked = false }: { checked?: boolean }) {
  const [isChecked, setIsChecked] = useState(checked);
  
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        isChecked ? 'bg-primary' : 'bg-muted'
      }`}
      onClick={() => setIsChecked(!isChecked)}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isChecked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
