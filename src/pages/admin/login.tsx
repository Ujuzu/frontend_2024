import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import logo from "@/assets/images/logo.png";
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AxiosError } from 'axios';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Define the API URL
  const API_URL = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';
  
  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/u/');
    }
    
    // Check for remembered email
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, [navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous error messages
    setErrorMessage('');
    
    // Validate input fields
    if (!email.trim()) {
      setErrorMessage('Email is required');
      toast.error('Email is required');
      return;
    }
    
    if (!password.trim()) {
      setErrorMessage('Password is required');
      toast.error('Password is required');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/api/auth/local`, {
        identifier: email,
        password: password
      });
      
      // Check if response contains expected data
      if (!response.data || !response.data.jwt || !response.data.user) {
        throw new Error('Invalid response from server');
      }
      
      login(response.data.jwt, response.data.user);
      
      // Store the token and user info
      localStorage.setItem('token', response.data.jwt);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // If remember me is checked, store the email
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      // Set session storage for newly logged in state
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('justLoggedIn', 'true');
      
      toast.success('Login successful!');
      
      // Redirect to admin dashboard using React Router
      navigate('/u/');
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;
        
        if (!axiosError.response) {
          setErrorMessage('Network error. Please check your internet connection.');
          toast.error('Network error. Please check your internet connection.');
        } else {
          const status = axiosError.response.status;
          const errorData = axiosError.response.data;
          
          if (status === 400) {
            setErrorMessage('Invalid email or password');
            toast.error('Invalid email or password');
          } else if (status === 401 || status === 403) {
            setErrorMessage('Unauthorized. Please check your credentials.');
            toast.error('Unauthorized. Please check your credentials.');
          } else if (status === 429) {
            setErrorMessage('Too many login attempts. Please try again later.');
            toast.error('Too many login attempts. Please try again later.');
          } else if (errorData && errorData.error && errorData.error.message) {
            setErrorMessage(errorData.error.message);
            toast.error(errorData.error.message);
          } else {
            setErrorMessage('Login failed. Please try again later.');
            toast.error('Login failed. Please try again later.');
          }
        }
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-[#000b17] p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-48 h-auto" />
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Admin Sign In</h2>
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="off"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <Link to="/admin/forgot-password" className="text-blue-600 hover:underline">
                  Forgot Password </Link>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#AC19AD] text-white hover:bg-[#8e16a1] h-12 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/admin/register" className="text-[#AC19AD] hover:underline font-medium">
                  Register instead
                </Link>
              </p>
            </div>
            
            <div className="flex items-center justify-center mt-6">
              <div className="text-center border-t w-full pt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full border border-gray-300 hover:bg-gray-50 h-12"
                  onClick={() => toast.error('Google login not implemented')}
                >
                  <span className="mr-2">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                      </g>
                    </svg>
                  </span>
                  Continue with Google
                </Button>
              </div>
            </div>
          </form>
        </div>
        <div className="mt-8 text-center text-white text-sm">
          <p>© {new Date().getFullYear()} Ujuzi. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
