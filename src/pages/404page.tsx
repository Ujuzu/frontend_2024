import { useNavigate } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
      <Card className="max-w-lg w-full">
        <CardHeader className="flex flex-col items-center pt-8">
          <div className="p-4 bg-indigo-100 rounded-full mb-4">
            <SearchX className="w-16 h-16 text-indigo-500" />
          </div>
          <h1 className="text-6xl font-bold text-gray-800">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mt-2">Page Not Found</h2>
        </CardHeader>
        
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to another location.
          </p>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
          <Button 
            variant="default" 
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={() => navigate('/')}
          >
            Return to home
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Go back
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          Need help finding something? <a href="/contact" className="text-indigo-600 hover:text-indigo-800 underline">Contact support</a>
        </p>
      </div>
    </section>
  );
}
