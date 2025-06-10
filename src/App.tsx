
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Dashboard from "@/components/layout/Dashboard";
import Index from "./pages/Index";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Doctors from "./pages/Doctors";
import BookAppointment from "./pages/BookAppointment";
import MedicalRecords from "./pages/MedicalRecords";
import SymptomChecker from "./pages/SymptomChecker";
import Pharmacy from "./pages/Pharmacy";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, roles }: { children: JSX.Element, roles?: string[] }) => {
  const { state } = useAuth();
  
  if (state.isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!state.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (roles && !roles.includes(state.user?.role || '')) {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Auth route component (redirects to dashboard if already logged in)
const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const { state } = useAuth();
  
  if (state.isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (state.isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
            
            {/* Protected dashboard routes */}
            <Route element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
              <Route path="/" element={<Index />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/book-appointment" element={<BookAppointment />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/records" element={<MedicalRecords />} />
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/pharmacy" element={<Pharmacy />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            {/* Error routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
