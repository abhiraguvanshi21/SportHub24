import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  profileImage?: string;
  joinedDate: string;
  stats: {
    matchesPlayed: number;
    matchesScored: number;
    totalRuns: number;
    totalWickets: number;
    bestBowling: string;
    highestScore: number;
    battingAverage: number;
    bowlingAverage: number;
    strikeRate: number;
    economyRate: number;
  };
  achievements: string[];
  favoriteTeam?: string;
  playingRole: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper' | 'Not specified';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('sportHub24User');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('sportHub24User');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - replace with actual API response
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: email,
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1990-05-15',
        joinedDate: '2024-01-01',
        stats: {
          matchesPlayed: 45,
          matchesScored: 12,
          totalRuns: 1250,
          totalWickets: 23,
          bestBowling: '4/32',
          highestScore: 89,
          battingAverage: 32.5,
          bowlingAverage: 28.4,
          strikeRate: 125.6,
          economyRate: 7.2
        },
        achievements: ['Best Bowler 2023', 'Century Maker', 'Match Winner'],
        favoriteTeam: 'Mumbai Indians',
        playingRole: 'All-rounder'
      };

      setUser(mockUser);
      localStorage.setItem('sportHub24User', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth || '',
        joinedDate: new Date().toISOString().split('T')[0],
        stats: {
          matchesPlayed: 0,
          matchesScored: 0,
          totalRuns: 0,
          totalWickets: 0,
          bestBowling: '0/0',
          highestScore: 0,
          battingAverage: 0,
          bowlingAverage: 0,
          strikeRate: 0,
          economyRate: 0
        },
        achievements: [],
        playingRole: userData.playingRole || 'Not specified'
      };

      setUser(newUser);
      localStorage.setItem('sportHub24User', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sportHub24User');
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('sportHub24User', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};