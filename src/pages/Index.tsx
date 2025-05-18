
import React, { useState, useEffect } from "react";
import UserDetailsForm, { UserFormData } from "@/components/UserDetailsForm";
import MeasurementDisplay from "@/components/MeasurementDisplay";
import MeasurementHistory from "@/components/MeasurementHistory";
import MeasurementSuccess from "@/components/MeasurementSuccess";
import { saveUserMeasurement, getUserMeasurements, UserMeasurement } from "@/services/storageService";
import { v4 as uuidv4 } from "uuid";

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

  useEffect(() => {
    // Load existing measurements on component mount
    const storedMeasurements = getUserMeasurements();
    setMeasurements(storedMeasurements);
    
    // If no measurements exist, start with user details form
    if (storedMeasurements.length === 0) {
      setAppState(AppState.USER_DETAILS);
    }
  }, []);

  const handleUserFormSubmit = (data: UserFormData) => {
    setUserData(data);
    setAppState(AppState.MEASUREMENT);
  };

  const handleMeasurementSubmit = (weight: number, height: number) => {
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
      
      saveUserMeasurement(newMeasurement);
      
      // Update local state
      setMeasurements([...measurements, newMeasurement]);
      setAppState(AppState.SUCCESS);
    }
  };

  const handleStartNewMeasurement = () => {
    setUserData(null);
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
