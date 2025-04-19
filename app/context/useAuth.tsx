
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { IUser } from '@/lib/types';

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  isToken:string | number 
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isToken:""
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { data } = useSession();
  const isToken = typeof window !== undefined ? localStorage.getItem("token") ?? "" : "";

  useEffect(() => {
    if (!data?.user) return;
    
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/auth/currentuser');
        setUser(res.data);
        setLoading(false);

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
    loading,
    isToken
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
