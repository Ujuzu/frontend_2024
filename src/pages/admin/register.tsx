import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import logo from "@/assets/images/logo.png"; // Import logo
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';

const AdminRegister: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Password requirements
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  
  // Define the API URL (using Vite environment variables)
  const API_URL = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';
  
  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/admin/userManagement');
    }
  }, [navigate]);
  
  // Check password strength
  useEffect(() => {
    setPasswordStrength({
      length: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [password]);
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!email || !username || !password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    // Check password strength
    const strengthValues = Object.values(passwordStrength);
    if (strengthValues.filter(value => value).length < 4) {
      toast.error('Password does not meet the minimum requirements');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register new user
      await axios.post(`${API_URL}/api/auth/local/register`, {
        username: username,
        email: email,
        password: password,
      });
      
      // Show success state
      setIsSubmitted(true);
      toast.success('Registration successful!');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000b17] p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="w-48 h-auto" />
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="w-20 h-20 rounded-full bg-[#AC19AD] flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Registration Successful!</h2>
            <p className="mb-6 text-gray-600">Your account has been created successfully.</p>
            <p className="text-sm text-gray-500 mb-4">Redirecting to login...</p>
            <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
              <div className="bg-[#AC19AD] h-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div className="mt-8 text-center text-white text-sm">
            <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-[#000b17] p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-48 h-auto" />
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Create Admin Account</h2>
          
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
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
              
              {/* Password strength indicator */}
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-500">Password strength:</span>
                  <span className="text-xs font-medium">
                    {Object.values(passwordStrength).filter(v => v).length < 2 && password ? 'Weak' : 
                     Object.values(passwordStrength).filter(v => v).length < 4 ? 'Medium' : 
                     Object.values(passwordStrength).filter(v => v).length >= 4 ? 'Strong' : ''}
                  </span>
                </div>
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      Object.values(passwordStrength).filter(v => v).length < 2 ? 'bg-red-500' : 
                      Object.values(passwordStrength).filter(v => v).length < 4 ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`}
                    style={{ 
                      width: password ? 
                        `${Math.max(20, (Object.values(passwordStrength).filter(v => v).length / 5) * 100)}%` : 
                        '0%' 
                    }}
                  ></div>
                </div>
                
                <ul className="mt-2 space-y-1 text-xs text-gray-500">
                  <li className={`flex items-center ${passwordStrength.length ? 'text-green-600' : ''}`}>
                    <span className={`mr-1 ${passwordStrength.length ? 'text-green-600' : ''}`}>•</span>
                    At least 8 characters
                  </li>
                  <li className={`flex items-center ${passwordStrength.hasUppercase ? 'text-green-600' : ''}`}>
                    <span className={`mr-1 ${passwordStrength.hasUppercase ? 'text-green-600' : ''}`}>•</span>
                    Contains uppercase letter
                  </li>
                  <li className={`flex items-center ${passwordStrength.hasLowercase ? 'text-green-600' : ''}`}>
                    <span className={`mr-1 ${passwordStrength.hasLowercase ? 'text-green-600' : ''}`}>•</span>
                    Contains lowercase letter
                  </li>
                  <li className={`flex items-center ${passwordStrength.hasNumber ? 'text-green-600' : ''}`}>
                    <span className={`mr-1 ${passwordStrength.hasNumber ? 'text-green-600' : ''}`}>•</span>
                    Contains number
                  </li>
                  <li className={`flex items-center ${passwordStrength.hasSpecialChar ? 'text-green-600' : ''}`}>
                    <span className={`mr-1 ${passwordStrength.hasSpecialChar ? 'text-green-600' : ''}`}>•</span>
                    Contains special character
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`w-full pr-10 ${
                    confirmPassword && password !== confirmPassword ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#AC19AD] text-white hover:bg-[#8e16a1] h-12 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/admin/login" className="text-[#AC19AD] hover:underline font-medium">
                  Sign in instead
                </Link>
              </p>
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

export default AdminRegister;
