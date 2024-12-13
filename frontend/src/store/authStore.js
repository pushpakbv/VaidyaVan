import { create } from 'zustand';

const API_URL = 'http://localhost:5000/api';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed.');

      localStorage.setItem('token', data.token);
      set({ token: data.token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  register: async ({ name, email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed.');

      localStorage.setItem('token', data.token);
      set({ token: data.token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  logout: async (navigate) => {
    try {
      // Call backend to clear the cookie
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
  
      if (!response.ok) {
        console.error('Failed to clear cookies on the server');
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      try {
        // Completely remove token from local storage
        localStorage.removeItem('token');
        console.log('Token removed from localStorage'); // Debugging log
        set({ token: null, isAuthenticated: false });
        navigate('/login'); // Redirect to login page
      } catch (removeError) {
        console.error('Failed to remove token from localStorage:', removeError);
      }
    }
  },
  

  // clearError: () => set({ error: null }),
}));

export default useAuthStore;
