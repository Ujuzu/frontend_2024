import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import logo from "@/assets/images/logo.png";
import { Loader2, CheckCircle, Mail } from 'lucide-react';
import { API_URL } from '@/helper/hooks/endPoints';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Define the API URL (using Vite environment variables)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Request password reset
      await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email: email
      });
      
      // Show success state
      setIsSubmitted(true);
      toast.success('Password reset link has been sent to your email');
      
    } catch (error) {
      console.error('Failed to send reset email:', error);
      
      // Show success message anyway for security reasons
      // This prevents email enumeration attacks
      setIsSubmitted(true);
      toast.success('If your email exists in our system, you will receive a reset link');
      
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-[#000b17] p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="w-48 h-auto" />
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="w-20 h-20 rounded-full bg-[#AC19AD] flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Check Your Email</h2>
            <p className="mb-6 text-gray-600">
              We've sent a password reset link to <span className="font-semibold">{email}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Please check your inbox and follow the instructions to reset your password.
              The link will expire in 24 hours.
            </p>
            <div className="flex flex-col space-y-3">
              <Link to="/admin/login">
                <Button 
                  className="w-full bg-[#AC19AD] text-white hover:bg-[#8e16a1]"
                >
                  Back to Login
                </Button>
              </Link>
              <Button 
                type="button" 
                variant="outline"
                className="w-full border-gray-300"
                onClick={() => setIsSubmitted(false)}
              >
                Try a different email
              </Button>
            </div>
          </div>
          
          <div className="mt-8 text-center text-white text-sm">
            <p>© {new Date().getFullYear()} Ujuzi. All rights reserved.</p>
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
          <div className="w-16 h-16 rounded-full bg-[#AC19AD] bg-opacity-10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-[#AC19AD]" />
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-3">Forgot Password</h2>
          <p className="text-center text-gray-600 mb-6">
            Enter your email and we'll send you a link to reset your password
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
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
            
            <Button 
              type="submit" 
              className="w-full bg-[#AC19AD] text-white hover:bg-[#8e16a1] h-12 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link to="/admin/login" className="text-[#AC19AD] hover:underline font-medium">
                  Back to Login
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

export default ForgotPassword;
