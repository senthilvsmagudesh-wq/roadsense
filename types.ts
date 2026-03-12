
export interface TrafficData {
  intersectionId: string;
  vehicleCount: number;
  density: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Flowing' | 'Congested' | 'Accident' | 'Emergency';
  lastUpdated: string;
}

export interface SignalStatus {
  id: string;
  name: string;
  currentMode: 'Auto' | 'Manual';
  color: 'Red' | 'Yellow' | 'Green';
  timer: number;
  coordinates: { x: number; y: number };
}

export interface PredictionInsight {
  area: string;
  riskScore: number;
  reason: string;
  recommendation: string;
}

export interface EmergencyResponse {
  id: string;
  type: 'Ambulance' | 'Fire' | 'Police';
  location: string;
  destination: string;
  status: 'En Route' | 'Arrived' | 'Critical';
}

export interface IncidentReport {
  id: string;
  type: 'Accident' | 'Hazard' | 'Stalled Vehicle' | 'Roadwork';
  description: string;
  location: string;
  timestamp: string;
  status: 'Pending' | 'Validated' | 'Rejected';
  confidence: number;
  coordinates?: { lat: number; lng: number };
}

export interface RouteOption {
  id: string;
  name: string;
  duration: string;
  distance: string;
  trafficLevel: 'Low' | 'Moderate' | 'Heavy';
  isOptimal: boolean;
  isEfficient: boolean;
}
