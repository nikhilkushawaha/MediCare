
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  Pill, 
  BarChart, 
  Settings,
  User,
  Heart,
  Stethoscope,
  Video,
  Clipboard,
  ShoppingCart,
  PlusCircle,
  UserCog
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SideNavProps {
  isOpen: boolean;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
  active?: boolean;
}

export default function SideNav({ isOpen }: SideNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useAuth();
  const { user } = state;

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Create different navigation items based on user role
  const getNavItems = (): NavItem[] => {
    const commonItems: NavItem[] = [
      { title: 'Dashboard', href: '/', icon: Home, active: isActive('/') },
      { title: 'Settings', href: '/settings', icon: Settings, active: isActive('/settings') },
    ];

    const patientItems: NavItem[] = [
      { title: 'Doctors', href: '/doctors', icon: User, active: isActive('/doctors') },
      { title: 'Book Appointment', href: '/book-appointment', icon: Calendar, active: isActive('/book-appointment') },
      { title: 'My Appointments', href: '/appointments', icon: Calendar, active: isActive('/appointments') },
      { title: 'Medical Records', href: '/records', icon: FileText, active: isActive('/records') },
      { title: 'Symptom Checker', href: '/symptom-checker', icon: Stethoscope, active: isActive('/symptom-checker') },
      { title: 'Pharmacy', href: '/pharmacy', icon: Pill, active: isActive('/pharmacy') },
    ];

    const doctorItems: NavItem[] = [
      { title: 'Patients', href: '/patients', icon: Users, active: isActive('/patients') },
      { title: 'Appointments', href: '/appointments', icon: Calendar, active: isActive('/appointments') },
      { title: 'Medical Records', href: '/records', icon: FileText, active: isActive('/records') },
      { title: 'Prescriptions', href: '/prescriptions', icon: Clipboard, active: isActive('/prescriptions') },
      { title: 'Video Consultations', href: '/video-consult', icon: Video, active: isActive('/video-consult') },
    ];

    const adminItems: NavItem[] = [
      { title: 'Patients', href: '/patients', icon: Users, active: isActive('/patients') },
      { title: 'Doctors', href: '/doctors', icon: User, active: isActive('/doctors') },
      { title: 'Staff', href: '/staff', icon: UserCog, active: isActive('/staff') },
      { title: 'Appointments', href: '/appointments', icon: Calendar, active: isActive('/appointments') },
      { title: 'Medical Records', href: '/records', icon: FileText, active: isActive('/records') },
      { title: 'Pharmacy', href: '/pharmacy', icon: ShoppingCart, active: isActive('/pharmacy') },
      { title: 'Reports', href: '/reports', icon: BarChart, active: isActive('/reports') },
    ];

    // Add profile link for all users
    commonItems.push({ 
      title: 'My Profile', 
      href: '/profile', 
      icon: UserCog,
      active: isActive('/profile')
    });

    if (user?.role === 'patient') {
      return [...commonItems, ...patientItems];
    } else if (user?.role === 'doctor') {
      return [...commonItems, ...doctorItems];
    } else if (user?.role === 'admin') {
      return [...commonItems, ...adminItems];
    }

    // Default items if somehow no user role is available
    return commonItems;
  };

  const navItems = getNavItems();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-border transition-transform duration-300 ease-in-out bg-sidebar backdrop-blur-sm lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="h-16 flex items-center justify-center border-b px-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-medical flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-lg font-semibold">MediCare</span>
        </div>
      </div>
      
      <ScrollArea className="flex-1 pt-3">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={item.active ? "default" : "ghost"}
              className={cn(
                "group relative h-10 justify-start px-3 py-2 text-sm font-medium transition-colors",
                item.active
                  ? "bg-medical text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => navigate(item.href)}
            >
              <item.icon className={cn("mr-2 h-4 w-4", item.active ? "" : "opacity-70")} />
              <span className={item.active ? "text-primary-foreground" : ""}>
                {item.title}
              </span>
              {item.active && (
                <span className="absolute right-2 h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </Button>
          ))}
        </nav>
      </ScrollArea>
      
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center justify-center">
          <div className="text-xs text-muted-foreground text-center">
            <p>MediCare v1.0</p>
            <p className="mt-1">© 2023 MediCare Inc.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
