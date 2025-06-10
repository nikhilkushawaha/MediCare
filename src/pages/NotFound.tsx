
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center animate-fade-in">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-display font-bold text-medical">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We couldn't find the page you were looking for. It might have been moved or doesn't exist.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button 
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button 
            className="flex items-center gap-1"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
