
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface MeasurementSuccessProps {
  onClose: () => void;
}

const MeasurementSuccess: React.FC<MeasurementSuccessProps> = ({ onClose }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-center text-2xl">Measurement Saved!</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground">
          The measurement has been successfully saved to your history.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={onClose}>View History</Button>
      </CardFooter>
    </Card>
  );
};

export default MeasurementSuccess;
