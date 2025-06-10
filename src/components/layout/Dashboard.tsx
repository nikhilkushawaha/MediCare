
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import SideNav from './SideNav';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  useSmoothScroll();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1">
        <SideNav isOpen={isSidebarOpen} />
        <main 
          className={`transition-all duration-300 ease-in-out flex-1 ${
            isSidebarOpen ? 'lg:ml-64' : ''
          }`}
        >
          <div className="container mx-auto px-4 py-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
