
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserMeasurement } from "@/services/storageService";
import { format } from "date-fns";

interface MeasurementHistoryProps {
  measurements: UserMeasurement[];
  onNewMeasurement: () => void;
}

const MeasurementHistory: React.FC<MeasurementHistoryProps> = ({ 
  measurements,
  onNewMeasurement
}) => {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Measurement History</CardTitle>
        <Button onClick={onNewMeasurement}>New Measurement</Button>
      </CardHeader>
      <CardContent>
        {measurements.length > 0 ? (
          <div className="space-y-4">
            {measurements.map((measurement) => (
              <Card key={measurement.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium">{measurement.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(measurement.measurementDate), "PPP")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Parent: {measurement.parentName}</p>
                  <p className="text-sm text-muted-foreground">Age: {measurement.age}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="bg-blue-50 dark:bg-blue-900 p-2 rounded-md">
                      <p className="text-sm text-muted-foreground">Weight</p>
                      <p className="font-medium">{measurement.weight.toFixed(1)} kg</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900 p-2 rounded-md">
                      <p className="text-sm text-muted-foreground">Height</p>
                      <p className="font-medium">{measurement.height.toFixed(1)} cm</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No measurement history found</p>
            <Button onClick={onNewMeasurement}>Take First Measurement</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MeasurementHistory;
