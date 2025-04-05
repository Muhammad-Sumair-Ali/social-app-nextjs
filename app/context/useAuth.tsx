
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { IUser } from '@/models/Users';

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { data } = useSession();

  useEffect(() => {
    if (!data?.user) return;
    
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/auth/currentuser');
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [data]);

  const contextValue: AuthContextType = {
    user,
    loading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
