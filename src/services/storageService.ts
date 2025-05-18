
export interface UserMeasurement {
  id: string;
  name: string;
  parentName: string;
  age: number;
  dob: string;
  weight: number;
  height: number;
  measurementDate: string;
}

const STORAGE_KEY = 'user_measurements';

export function saveUserMeasurement(data: UserMeasurement): void {
  try {
    const existingData = getUserMeasurements();
    existingData.push(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
  } catch (error) {
    console.error('Error saving user measurement:', error);
  }
}

export function getUserMeasurements(): UserMeasurement[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving user measurements:', error);
    return [];
  }
}

export function getUserMeasurementById(id: string): UserMeasurement | undefined {
  const measurements = getUserMeasurements();
  return measurements.find(measurement => measurement.id === id);
}
