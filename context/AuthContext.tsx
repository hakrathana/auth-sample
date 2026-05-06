import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

export type AuthToken = {
  accessToken: string;
  refreshToken?: string;
  [key: string]: unknown;
};

type AuthContextType = {
  token: AuthToken | null;
  login: (token: AuthToken) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);
const AUTH_STORAGE_KEY = 'auth_token';

export const AuthProvider = ({ children }:{children: React.ReactNode}) => {
  
  const [token, setToken] = useState<AuthToken | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(()=>{
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (storedToken) {
          setToken(JSON.parse(storedToken));
          return;
        }

        // Keep legacy key support so existing local sessions do not break.
        const legacyToken = await AsyncStorage.getItem('authToken');
        if (legacyToken) {
          setToken({ accessToken: legacyToken });
        }
      } catch (error) {
        console.error('Failed to load token', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  //function to handle login
  const login = async (nextToken: AuthToken) => {
    //set token in state and local storage
    setToken(nextToken);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextToken));
  };
  //function to handle logout
  const logout = async () => {
    setToken(null);
    await AsyncStorage.multiRemove([AUTH_STORAGE_KEY, 'authToken']);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
