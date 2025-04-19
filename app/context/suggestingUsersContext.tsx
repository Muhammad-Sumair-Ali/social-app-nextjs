"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { IUser } from "@/lib/types";
import { useAuth } from "./useAuth";

const SuggestedUsersContext = createContext<any>(null);

export const SuggestedUsersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const {user} = useAuth()

  

  const fetchSuggestedUsers = async () => {
    try {
      const res = await axios.get("/api/auth/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching suggested users", err);
    }
  };

  useEffect(() => {
    if (typeof window !== undefined) {
      const token = localStorage.getItem('token');
      if (user && token) {
        fetchSuggestedUsers();
      }
    }
  }, []);

  return (
    <SuggestedUsersContext.Provider value={{ users, fetchSuggestedUsers }}>
      {children}
    </SuggestedUsersContext.Provider>
  );
};

export const useSuggestedUsers = () => useContext(SuggestedUsersContext);
