
import React, { useState, useEffect } from "react";
import UserDetailsForm, { UserFormData } from "@/components/UserDetailsForm";
import MeasurementDisplay from "@/components/MeasurementDisplay";
import MeasurementHistory from "@/components/MeasurementHistory";
import MeasurementSuccess from "@/components/MeasurementSuccess";
import { saveUserMeasurement, getUserMeasurements, UserMeasurement } from "@/services/storageService";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { generateQRCode } from "@/utils/qrCodeUtils";
import { toast } from "@/components/ui/use-toast";

enum AppState {
  USER_DETAILS,
  MEASUREMENT,
  SUCCESS,
  HISTORY
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HISTORY);
  const [userData, setUserData] = useState<UserFormData | null>(null);
  const [measurements, setMeasurements] = useState<UserMeasurement[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const storedMeasurements = getUserMeasurements();
    setMeasurements(storedMeasurements);

    if (storedMeasurements.length === 0) {
      setAppState(AppState.USER_DETAILS);
    }
  }, []);

  const handleUserFormSubmit = (data: UserFormData) => {
    setUserData(data);
    setAppState(AppState.MEASUREMENT);
  };

  const handleMeasurementSubmit = async (weight: number, height: number) => {
    if (userData && userData.dob) {
      const newMeasurement: UserMeasurement = {
        id: uuidv4(),
        name: userData.name,
        parentName: userData.parentName,
        age: userData.age,
        dob: userData.dob.toISOString(),
        weight: weight,
        height: height,
        measurementDate: new Date().toISOString()
      };

      const qrPayload = {
        name: userData.name,
        parentName: userData.parentName,
        age: userData.age,
        dob: userData.dob.toISOString(),
        weight,
        height,
        measurementDate: newMeasurement.measurementDate,
      };

      let qrDataUrl = "";
      try {
        qrDataUrl = await generateQRCode(qrPayload);
        setQrDataUrl(qrDataUrl);
      } catch (err) {
        setQrDataUrl(null);
        console.error("Failed to generate QR code:", err);
        toast({
          title: "Error",
          description: "Failed to generate QR code.",
          variant: "destructive"
        });
      }

      saveUserMeasurement(newMeasurement);
      setMeasurements([...measurements, newMeasurement]);
      setAppState(AppState.SUCCESS);

      try {
        const { error } = await supabase.from("user_qr_codes").insert([
          {
            name: userData.name,
            parent_name: userData.parentName,
            dob: userData.dob.toISOString(),
            age: userData.age,
            height,
            weight,
            qr_data: JSON.stringify(qrPayload),
            qr_image_url: qrDataUrl,
          },
        ]);
        if (error) {
          console.error("Supabase insert error:", error);
          toast({
            title: "Storage Error",
            description: "Failed to save measurement to Supabase.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Success!",
            description: "Measurement saved to Supabase.",
            variant: "default"
          });
        }
      } catch (err) {
        console.error("Supabase insert exception:", err);
        toast({
          title: "Storage Exception",
          description: "Error when saving measurement to Supabase.",
          variant: "destructive"
        });
      }
    }
  };

  const handleStartNewMeasurement = () => {
    setUserData(null);
    setQrDataUrl(null);
    setAppState(AppState.USER_DETAILS);
  };

  const handleBackToUserDetails = () => {
    setAppState(AppState.USER_DETAILS);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.USER_DETAILS:
        return (
          <UserDetailsForm 
            onFormSubmit={handleUserFormSubmit} 
          />
        );
      case AppState.MEASUREMENT:
        return userData ? (
          <MeasurementDisplay 
            userData={userData}
            onSubmit={handleMeasurementSubmit}
            onBack={handleBackToUserDetails}
          />
        ) : null;
      case AppState.SUCCESS:
        return (
          <MeasurementSuccess 
            onClose={() => setAppState(AppState.HISTORY)}
            qrDataUrl={qrDataUrl}
          />
        );
      case AppState.HISTORY:
      default:
        return (
          <MeasurementHistory 
            measurements={measurements}
            onNewMeasurement={handleStartNewMeasurement}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <header className="w-full py-6 bg-white dark:bg-gray-900 shadow-sm">
        <div className="container px-4 mx-auto">
          <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">
            Health Measurement App
          </h1>
        </div>
      </header>

      <main className="flex-1 container px-4 mx-auto py-8">
        <div className="flex justify-center">
          {renderContent()}
        </div>
      </main>

      <footer className="w-full py-4 bg-white dark:bg-gray-900 border-t">
        <div className="container px-4 mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Health Measurement System
        </div>
      </footer>
    </div>
  );
};

export default Index;
