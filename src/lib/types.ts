export interface Patient {
  uid: string;
  name: string;
  biometric_id: string;
  language_pref: 'English' | 'Spanish' | 'Hindi';
  literacy_level: 'High' | 'Low' | 'None';
  current_schemes: string[];
  avatarId: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
}

export interface Doctor {
  uid: string;
  name: string;
  specialty: string;
}

export interface DigitalHealthRecord {
  record_id: string;
  patient_uid: string;
  hospital_id: string;
  diagnosis: string;
  notes: string;
  prescriptions: { name: string; dosage: string; frequency: string }[];
  scan_ids: string[];
  timestamp: string; // ISO date string
  doctor: {
    name: string;
    specialty: string;
  };
}

export interface HospitalOperation {
  hospital_id: string;
  name:string;
  live_medicine_stock: { [medicine: string]: { quantity: number, low_stock_threshold: number } };
  opd_status: 'Crowded' | 'Normal' | 'Light';
  doctor_availability: { specialty: string; available: number; total: number }[];
  emergency_cases: { case_id: string; description: string; severity: 'High' | 'Medium' | 'Low'; patientName: string; }[];
  isGovernment: boolean;
  special_equipment: ('MRI' | 'Radiotherapy' | 'PET Scan')[];
  location: { lat: number; lng: number };
}

export interface Appointment {
  id: string;
  patient_uid: string;
  status: 'Completed' | 'Scheduled' | 'Cancelled';
  voice_note_url?: string; // a mock url
  follow_up_date?: string; // ISO date string
  date: string; // ISO date string
  hospital_name: string;
  record_id: string;
  doctor_name: string;
  specialty: string;
}
