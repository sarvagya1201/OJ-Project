import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user will have email, role, etc.

useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser(); // Fetches user info from backend
        setUser(data.user);
      } catch (err) {
        console.error('Not logged in');
        setUser(null);
      }
    };
    fetchUser();
  }, []);



  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
