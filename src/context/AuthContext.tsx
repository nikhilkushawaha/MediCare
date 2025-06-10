
import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';
import { User, UserRole, AuthState } from '../utils/types';
import { toast } from 'sonner';

// Define actions for auth reducer
type AuthAction = 
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
  updateUserProfile: (userData: Partial<User>) => void;
}

// Mock data to simulate backend
const MOCK_USERS: User[] = [
  {
    _id: '1',
    name: 'Nikhil Kushawaha',
    email: 'admin@medicare.com',
    password: 'password123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    isVerified: true
  },
  {
    _id: '2',
    name: 'Dr. Jane Smith',
    email: 'doctor@medicare.com',
    password: 'password123',
    role: 'doctor',
    specialty: 'Cardiology',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    isVerified: true
  },
  {
    _id: '3',
    name: 'John Doe',
    email: 'patient@medicare.com',
    password: 'password123',
    role: 'patient',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    isVerified: true
  }
];

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Auth reducer for managing auth state
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check local storage for saved user session
    const loadUser = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        const savedUser = localStorage.getItem('medicare_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // In a real app, this would be an API call
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Remove password before storing
        const { password, ...safeUser } = user;
        
        // Save to local storage
        localStorage.setItem('medicare_user', JSON.stringify(safeUser));
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: safeUser });
        toast.success(`Welcome back, ${safeUser.name}!`);
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid email or password' });
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login failed:', error);
      dispatch({ type: 'LOGIN_FAILURE', payload: 'An error occurred during login' });
      toast.error('Login failed. Please try again.');
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Check if email already exists
      const userExists = MOCK_USERS.some(u => u.email === email);
      
      if (userExists) {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Email already in use' });
        toast.error('Email already in use');
        return;
      }
      
      // In a real app, this would be an API call to register
      const newUser: User = {
        _id: String(MOCK_USERS.length + 1),
        name,
        email,
        role,
        isVerified: false,
        dateJoined: new Date().toISOString()
      };
      
      // Remove password before storing
      const { password: _, ...safeUser } = newUser;
      
      // Save to local storage
      localStorage.setItem('medicare_user', JSON.stringify(safeUser));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: safeUser });
      toast.success('Registration successful! Welcome to MediCare.');
    } catch (error) {
      console.error('Registration failed:', error);
      dispatch({ type: 'LOGIN_FAILURE', payload: 'An error occurred during registration' });
      toast.error('Registration failed. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('medicare_user');
    dispatch({ type: 'LOGOUT' });
    toast.info('You have been logged out');
  };

  const hasPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!state.user) return false;
    
    if (state.user.role === 'admin') return true; // Admin has access to everything
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(state.user.role);
    }
    
    return state.user.role === requiredRole;
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('medicare_user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: userData });
      toast.success('Profile updated successfully');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        register,
        hasPermission,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
