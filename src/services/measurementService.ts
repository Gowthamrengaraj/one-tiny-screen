
interface MeasurementResponse {
  field1?: string;
  field2?: string;
  field3?: string;
  created_at?: string;
  entry_id?: number;
}

export async function getWeightData(): Promise<number> {
  try {
    const response = await fetch('https://api.thingspeak.com/channels/2965660/fields/1/last.json');
    if (!response.ok) {
      throw new Error('Failed to fetch weight data');
    }
    const data: MeasurementResponse = await response.json();
    return data.field1 ? parseFloat(data.field1) : 0;
  } catch (error) {
    console.error('Error fetching weight data:', error);
    return 0;
  }
}

export async function getHeightData(isAboveOneYear: boolean): Promise<number> {
  try {
    // Use field2 for age >= 1, field3 for age < 1
    const fieldNumber = isAboveOneYear ? 2 : 3;
    const response = await fetch(`https://api.thingspeak.com/channels/2965660/fields/${fieldNumber}/last.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch height data from field ${fieldNumber}`);
    }
    const data: MeasurementResponse = await response.json();
    const fieldKey = isAboveOneYear ? 'field2' : 'field3';
    return data[fieldKey as keyof MeasurementResponse] ? parseFloat(data[fieldKey as keyof MeasurementResponse] as string) : 0;
  } catch (error) {
    console.error('Error fetching height data:', error);
    return 0;
  }
}
