export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'driver' | 'mechanic';
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  make: string;
  year: number;
  currentKm: number;
  healthScore: number;
  lastInspectionAt?: string | null;
  vin?: string;
  crlvNumber?: string | null;
  renavam?: string | null;
  registrationDate?: string;
  purchasePrice?: number | string | null;
  expectedLifespanYears?: number | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Inspection {
  id: string;
  vehicleId: string;
  driverId: string;
  inspectionDate: string;
  inspectionType: 'pre_trip' | 'post_trip' | 'periodic' | 'maintenance_check';
  status: 'draft' | 'completed' | 'reviewed' | 'approved';
  totalPhotos: number;
  damageCount: number;
  odometerReading: number;
  aiQualityScore?: number | string;
}

export interface InspectionPhoto {
  id: string;
  uri: string;
  type: 'tire' | 'front' | 'rear' | 'left_side' | 'right_side' | 'roof' | 'dashboard';
  uploaded: boolean;
}

export interface MaintenanceAlert {
  id: string;
  vehicleId: string;
  component: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  kmRemaining: number;
  daysRemaining: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}
