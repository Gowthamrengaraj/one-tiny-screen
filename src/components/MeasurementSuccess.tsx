
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface MeasurementSuccessProps {
  onClose: () => void;
  qrDataUrl?: string | null;
}

const MeasurementSuccess: React.FC<MeasurementSuccessProps> = ({ onClose, qrDataUrl }) => {
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
      <CardContent className="text-center flex flex-col items-center gap-4">
        <p className="text-muted-foreground">
          The measurement has been successfully saved to your history.
        </p>
        {qrDataUrl && (
          <div>
            <div className="font-semibold mb-1">Your QR Code:</div>
            <img
              src={qrDataUrl}
              alt="Measurement QR Code"
              className="mx-auto rounded shadow border bg-white p-2"
              style={{ width: "160px", height: "160px" }}
              draggable={false}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={onClose}>View History</Button>
      </CardFooter>
    </Card>
  );
};

export default MeasurementSuccess;
