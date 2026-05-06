import axios from '@/lib/axios';

type LoginPayload = {
  password: string;
  email?: string;
  countryCode?: string;
  phone?: string;
};

export const fetchOne = async <T>(endpoint: string, signal?: AbortSignal) => {
  try {
    const res = await axios.get(endpoint, { signal });
    return res.data as T;
  } catch (error: any) {
    throw error;
  }
};

export const loginRequest = async (payload: LoginPayload) =>
  (
    await axios.post('/auth/login', payload, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  ).data;
