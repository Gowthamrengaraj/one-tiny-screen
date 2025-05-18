
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { getWeightData, getHeightData } from "@/services/measurementService";
import { UserFormData } from "@/components/UserDetailsForm";
import { ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MeasurementDisplayProps {
  userData: UserFormData;
  onSubmit: (weight: number, height: number) => void;
  onBack: () => void;
}

const MeasurementDisplay: React.FC<MeasurementDisplayProps> = ({ 
  userData, 
  onSubmit,
  onBack
}) => {
  const [weight, setWeight] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Function to update measurements from IoT devices
  const updateMeasurements = async () => {
    try {
      setIsUpdating(true);
      
      const weightValue = await getWeightData();
      
      // Determine which height endpoint to use based on age
      const isAboveOneYear = userData.age >= 1;
      const heightValue = await getHeightData(isAboveOneYear);
      
      setWeight(weightValue);
      setHeight(heightValue);
      
      toast({
        title: "Measurements Updated",
        description: "Weight and height values have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating measurements:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update measurements. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      await updateMeasurements();
      setIsLoading(false);
    };
    
    fetchInitialData();
  }, [userData.age]);

  const handleSubmit = () => {
    onSubmit(weight, height);
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Measurement Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Card className="measurement-card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-center">Weight</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex justify-center items-center p-4">
                <span className="text-4xl font-bold">
                  {isLoading ? "Loading..." : `${weight.toFixed(1)}`}
                </span>
                <span className="ml-2 text-xl">kg</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="measurement-card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-center">Height</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex justify-center items-center p-4">
                <span className="text-4xl font-bold">
                  {isLoading ? "Loading..." : `${height.toFixed(1)}`}
                </span>
                <span className="ml-2 text-xl">cm</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="pt-4 text-center">
          <p className="text-sm text-muted-foreground">
            User: <span className="font-medium text-foreground">{userData.name}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Age: <span className="font-medium text-foreground">{userData.age} {userData.age === 1 ? "year" : "years"}</span>
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          onClick={updateMeasurements} 
          variant="outline" 
          className="w-full"
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update Measurements"}
        </Button>
        <div className="flex w-full gap-2">
          <Button onClick={onBack} variant="ghost" className="flex-1">
            Back
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="flex-1"
            disabled={isLoading || isUpdating || (weight === 0 && height === 0)}
          >
            Submit <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MeasurementDisplay;
