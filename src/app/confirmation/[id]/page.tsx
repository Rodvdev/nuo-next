'use client'

import { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter, useParams } from 'next/navigation'; // Import useParams to get the ID

export default function SubmissionConfirmation() {
  const router = useRouter();
  const { id: applicationId } = useParams(); // Get the applicationId from the route params
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(20); // Initialize countdown to 20 seconds

  // Automatically redirect to the application page after countdown reaches 0
  useEffect(() => {
    const timer = countdown > 0 ? setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000) : null;

    // Redirect to the application page when countdown reaches 0
    if (countdown === 0) {
      router.push(`/application/${applicationId}`);
    }

    return () => {
      if (timer) clearInterval(timer); // Clean up interval when component unmounts
    };
  }, [countdown, router, applicationId]);

  // Handle manual redirection to the application
  const handleGoToApplication = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push(`/application/${applicationId}`);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center bg-background min-h-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Submission Successful!</CardTitle>
          <CardDescription className="text-center">
            Your company foundation application has been received.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            We are processing your application. You will be redirected to the application page in 
            <span className="font-semibold text-blue-600"> {countdown} seconds</span>, or you can proceed manually.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Application Progress</span>
              <span>25%</span>
            </div>
            <Progress value={25} className="w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleGoToApplication}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="mr-2">Loading...</span>
                <Progress value={100} className="w-6 h-6 rounded-full" />
              </>
            ) : (
              <>
                Go to Application
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
