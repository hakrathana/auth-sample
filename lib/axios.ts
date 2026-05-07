import { AuthToken } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
    apikey: API_KEY,
    'x-platform': 'android',
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  try {
    const authToken = await AsyncStorage.getItem('auth_token');

    if (authToken) {
      const tokens: AuthToken | string = JSON.parse(authToken);
      const accessToken = typeof tokens === 'string' ? tokens : tokens.accessToken;

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
  } catch (err) {
    console.error('Failed to attach access token:', err);
  }

  return config;
});

export default axiosInstance;
