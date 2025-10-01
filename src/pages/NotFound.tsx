import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { SEO } from "@/components/common/SEO";
import { Home, ShoppingBag, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  // Track 404 errors for analytics without console errors
  useEffect(() => {
    // Log to analytics service instead of console
    if (typeof window !== 'undefined') {
      // Future: Send to analytics tracking service
    }
  }, [location.pathname]);

  return (
    <>
      <SEO
        title="404 - Page Not Found | Strength Over Struggle"
        description="The page you're looking for doesn't exist. Return to Strength Over Struggle to explore our mission, programs, and ways to support youth empowerment."
        ogUrl={`https://strength-over-struggle.com${location.pathname}`}
      />
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center max-w-2xl">
          <h1 className="mb-4 text-8xl font-bold text-primary">404</h1>
          <h2 className="mb-4 text-3xl font-semibold text-foreground">Page Not Found</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                Return Home
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link to="/shop">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Visit Shop
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link to="/story">
                <BookOpen className="mr-2 h-5 w-5" />
                Our Story
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
