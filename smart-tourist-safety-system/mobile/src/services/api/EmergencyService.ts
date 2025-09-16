import { ApiClient } from './ApiClient';
import { LocationData } from '../location/LocationService';

interface PanicAlertPayload {
  tourist_id: string | undefined;
  incident_type: string;
  location: LocationData;
  description: string;
  metadata?: {
    deviceInfo?: {
      platform: string;
      version: string | number;
      batteryLevel?: number;
      networkType?: string;
    };
    timestamp?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    [key: string]: any;
  };
}

export class EmergencyService {
  static async triggerPanicButton(payload: PanicAlertPayload) {
    try {
      const response = await ApiClient.post('/emergency/panic', payload);
      return response.data;
    } catch (error) {
      console.error('Error triggering panic button:', error);
      throw error;
    }
  }

  static async reportIncident(payload: PanicAlertPayload) {
    try {
      const response = await ApiClient.post('/emergency/report', payload);
      return response.data;
    } catch (error) {
      console.error('Error reporting incident:', error);
      throw error;
    }
  }

  static async checkIncidentStatus(incidentId: string) {
    try {
      const response = await ApiClient.get(`/emergency/incidents/${incidentId}/status`);
      return response.data;
    } catch (error) {
      console.error('Error checking incident status:', error);
      throw error;
    }
  }
}
