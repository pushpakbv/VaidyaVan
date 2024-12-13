import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

const useAuthStore = create((set, get) => ({
  user: null,
  setUser: (user) => {
    console.log('Setting user:', user);
    set({ user });
  },
  clearUser: () => set({ user: null }),
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      
      // Set user data
      set({ user });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },
  fetchUserData: async () => {
    try {
      // Get user ID from token
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return null;
      }
      
      // Decode token to get user ID
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;
      
      if (!userId) {
        console.error('No user ID found in token:', payload);
        return null;
      }
      
      console.log('Making request to /users/profile/' + userId);
      const response = await axiosInstance.get(`/users/profile/${userId}`);
      console.log('Response from /users/profile:', response.data);
      set({ user: response.data });
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response) {
        console.log('Error response:', error.response.data);
      }
      return null;
    }
  }
}));

export { useAuthStore };
