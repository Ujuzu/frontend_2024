import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage() {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <section className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h1>
        
        <p className="text-gray-600 mb-6">
          We encountered an unexpected error. Please try again or return to the home page.
        </p>
        
        <div className="flex justify-center">
          <button
            onClick={handleReturn}
            className="px-5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Return to safety
          </button>
        </div>
      </div>
      
      <p className="mt-6 text-gray-500 text-sm">
        If this problem persists, please contact support.
      </p>
    </section>
  );
}
