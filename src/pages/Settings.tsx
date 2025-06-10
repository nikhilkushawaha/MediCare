import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function Settings() {
  const { state } = useAuth();
  const { user } = state;

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-display font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <Tabs defaultValue="account" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                View and update your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={user?.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue={user?.role.charAt(0).toUpperCase() + user?.role.slice(1)} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joined">Joined Date</Label>
                  <Input id="joined" defaultValue={new Date(user?.dateJoined || Date.now()).toLocaleDateString()} disabled />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Update your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => toast.success('Password updated successfully')}>Update Password</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Delete Account</Label>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all of your data. This action cannot be undone.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={() => toast.error('Account deletion is disabled in demo mode')}>
                Delete Account
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Customize the appearance of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="border rounded p-4 flex flex-col items-center space-y-2 cursor-pointer bg-background hover:border-primary">
                  <div className="w-full h-24 rounded bg-white border"></div>
                  <Label>Light</Label>
                </div>
                <div className="border rounded p-4 flex flex-col items-center space-y-2 cursor-pointer hover:border-primary">
                  <div className="w-full h-24 rounded bg-gray-900 border border-gray-700"></div>
                  <Label>Dark</Label>
                </div>
                <div className="border rounded p-4 flex flex-col items-center space-y-2 cursor-pointer hover:border-primary">
                  <div className="w-full h-24 rounded bg-gradient-to-b from-white to-gray-900 border"></div>
                  <Label>System</Label>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <div className="grid grid-cols-4 gap-2">
                  <Button variant="outline" className="text-xs">Small</Button>
                  <Button variant="outline" className="bg-primary/10 text-primary">Medium</Button>
                  <Button variant="outline" className="text-lg">Large</Button>
                  <Button variant="outline" className="text-xl">Extra Large</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color-scheme">Color Scheme</Label>
                <div className="grid grid-cols-4 gap-2">
                  <Button variant="outline" className="border-blue-500 bg-blue-50 text-blue-700">Blue</Button>
                  <Button variant="outline" className="border-green-500 bg-green-50 text-green-700">Green</Button>
                  <Button variant="outline" className="border-purple-500 bg-purple-50 text-purple-700">Purple</Button>
                  <Button variant="outline" className="border-orange-500 bg-orange-50 text-orange-700">Orange</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control what notifications you receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Label>Email Notifications Settings</Label>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="appointment" className="flex-1">Appointment Reminders</Label>
                      <Switch id="appointment" checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="updates" className="flex-1">Treatment Updates</Label>
                      <Switch id="updates" checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="billing" className="flex-1">Billing Notifications</Label>
                      <Switch id="billing" checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="newsletter" className="flex-1">Newsletter</Label>
                      <Switch id="newsletter" checked={false} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketing" className="flex-1">Marketing Communications</Label>
                      <Switch id="marketing" checked={false} />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">SMS Notifications</Label>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <div className="space-y-3">
                  <Label>SMS Notifications Settings</Label>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-appointment" className="flex-1">Appointment Reminders</Label>
                      <Switch id="sms-appointment" checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-prescription" className="flex-1">Prescription Refills</Label>
                      <Switch id="sms-prescription" checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-billing" className="flex-1">Billing Notifications</Label>
                      <Switch id="sms-billing" checked={false} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Manage your privacy and data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Profile Visibility</Label>
                    <p className="text-sm text-muted-foreground">
                      Control who can see your profile information
                    </p>
                  </div>
                  <Select defaultValue="doctors">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="doctors">Doctors Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Control how your data is used for research and improvement
                    </p>
                  </div>
                  <Switch checked={false} />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label className="text-base">Data Export</Label>
                  <p className="text-sm text-muted-foreground">
                    Download a copy of your personal data
                  </p>
                  <Button variant="outline" onClick={() => toast.info('Data export feature coming soon')}>
                    Request Data Export
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Privacy Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Switch({ checked = false, id }: { checked?: boolean; id?: string }) {
  const [isChecked, setIsChecked] = useState(checked);
  
  return (
    <button
      id={id}
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

function Select({ children, defaultValue }: { children: React.ReactNode; defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue || '');
  
  return (
    <div className="relative">
      <select
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SelectContent) {
            return React.Children.map(child.props.children, (option) => {
              if (React.isValidElement(option) && option.type === SelectItem) {
                return (
                  <option value={option.props.value}>
                    {option.props.children}
                  </option>
                );
              }
              return null;
            });
          }
          return null;
        })}
      </select>
    </div>
  );
}

function SelectTrigger({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return null; // Not used in this simplified implementation
}

function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <>{children}</>;
}

function SelectValue({ placeholder }: { placeholder: string }) {
  return <>{placeholder}</>;
}
