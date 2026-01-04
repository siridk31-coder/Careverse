import type { Patient, Appointment, DigitalHealthRecord, HospitalOperation, Doctor } from './types';

// Data is hardcoded here as there's no CSV writing capability.
// In a real app this would be a database.

export const patients: Patient[] = [
    {
        "uid": "p1",
        "name": "Gayathri",
        "biometric_id": "bio789123",
        "language_pref": "Hindi",
        "literacy_level": "Low",
        "current_schemes": ["Ayushman Bharat PM-JAY"],
        "avatarId": "patient-avatar-1",
        "age": 50,
        "gender": "Female"
    },
    {
        "uid": "p2",
        "name": "John Doe",
        "biometric_id": "bio456789",
        "language_pref": "English",
        "literacy_level": "High",
        "current_schemes": [],
        "avatarId": "patient-avatar-2",
        "age": 45,
        "gender": "Male"
    }
];

export const doctors: Doctor[] = [
    { uid: 'd1', name: 'Dr. Emily Carter', specialty: 'Geriatrics' },
    { uid: 'd2', name: 'Dr. Benfield', specialty: 'Cardiology' },
];

export const appointments: Appointment[] = [
    {
        "id": "appt1",
        "patient_uid": "p1",
        "status": "Completed",
        "voice_note_url": "/voice-notes/vn1.mp3",
        "follow_up_date": "2024-08-15T00:00:00.000Z",
        "date": "2024-07-15T10:00:00.000Z",
        "hospital_name": "City General Hospital",
        "record_id": "rec1",
        "doctor_name": "Dr. Emily Carter",
        "specialty": "Geriatrics"
    },
    {
        "id": "appt2",
        "patient_uid": "p1",
        "status": "Scheduled",
        "date": "2024-08-20T11:30:00.000Z",
        "hospital_name": "City General Hospital",
        "record_id": "rec1",
        "doctor_name": "Dr. Emily Carter",
        "specialty": "Geriatrics"
    },
    {
        "id": "appt3",
        "patient_uid": "p2",
        "status": "Completed",
        "voice_note_url": "/voice-notes/vn2.mp3",
        "date": "2024-07-20T09:00:00.000Z",
        "hospital_name": "Community Clinic",
        "record_id": "rec3",
        "doctor_name": "Dr. Benfield",
        "specialty": "Cardiology"
    }
];

export const healthRecords: DigitalHealthRecord[] = [
    {
        "record_id": "rec1",
        "patient_uid": "p1",
        "hospital_id": "hosp1",
        "diagnosis": "Alzheimer's Disease",
        "notes": "Patient presents with progressive memory loss and cognitive decline. Recent tests confirm early-stage Alzheimer's Disease. Family advised on creating a safe home environment and establishing routines. Discussed long-term care options.",
        "prescriptions": [
            { "name": "Donepezil", "dosage": "5mg", "frequency": "Once daily at bedtime" },
            { "name": "Memantine", "dosage": "10mg", "frequency": "Twice daily" },
            { "name": "Vitamin E", "dosage": "1000 IU", "frequency": "Twice daily" }
        ],
        "scan_ids": ["medical-scan-2"],
        "timestamp": "2024-07-15T10:30:00.000Z",
        "doctor": { "name": "Dr. Emily Carter", "specialty": "Geriatrics" }
    },
    {
        "record_id": "rec3",
        "patient_uid": "p2",
        "hospital_id": "hosp1",
        "diagnosis": "Hypertension",
        "notes": "Patient presented with high blood pressure readings during a routine check-up. Lifestyle modifications, including diet and exercise, were advised. Medication prescribed to manage blood pressure.",
        "prescriptions": [
            { "name": "Lisinopril", "dosage": "10mg", "frequency": "Once daily" },
            { "name": "Amlodipine", "dosage": "5mg", "frequency": "Once daily" }
        ],
        "scan_ids": ["medical-scan-1"],
        "timestamp": "2024-07-20T09:30:00.000Z",
        "doctor": { "name": "Dr. Benfield", "specialty": "Cardiology" }
    }
];

export const hospitalOperations: HospitalOperation[] = [
    {
        "hospital_id": "hosp1",
        "name": "City General Hospital",
        "live_medicine_stock": {
            "Paracetamol": { "quantity": 1500, "low_stock_threshold": 500 },
            "Lisinopril": { "quantity": 800, "low_stock_threshold": 200 },
            "Amlodipine": { "quantity": 650, "low_stock_threshold": 200 },
            "Metformin": { "quantity": 900, "low_stock_threshold": 300 }
        },
        "opd_status": "Normal",
        "doctor_availability": [
            { "specialty": "Cardiology", "available": 4, "total": 5 },
            { "specialty": "Neurology", "available": 2, "total": 3 },
            { "specialty": "Orthopedics", "available": 5, "total": 5 },
            { "specialty": "Geriatrics", "available": 1, "total": 2 }
        ],
        "emergency_cases": [
            { "case_id": "er001", "description": "Chest Pains", "severity": "High", "patientName": "R. Sharma" },
            { "case_id": "er002", "description": "Fractured Arm", "severity": "Medium", "patientName": "S. Jones" }
        ],
        "isGovernment": true,
        "special_equipment": ["MRI", "Radiotherapy"],
        "location": { "lat": 12.9716, "lng": 77.5946 }
    },
    {
        "hospital_id": "hosp2",
        "name": "Apollo Hospital",
        "live_medicine_stock": {
            "Paracetamol": { "quantity": 2000, "low_stock_threshold": 500 },
            "Lisinopril": { "quantity": 1000, "low_stock_threshold": 200 },
            "Metformin": { "quantity": 1200, "low_stock_threshold": 300 }
        },
        "opd_status": "Light",
        "doctor_availability": [
            { "specialty": "Cardiology", "available": 5, "total": 5 },
            { "specialty": "Neurology", "available": 3, "total": 3 },
            { "specialty": "Oncology", "available": 4, "total": 4 }
        ],
        "emergency_cases": [],
        "isGovernment": false,
        "special_equipment": ["PET Scan", "MRI"],
        "location": { "lat": 12.9345, "lng": 77.6262 }
    },
     {
        "hospital_id": "hosp3",
        "name": "Fortis Hospital",
        "live_medicine_stock": {
            "Paracetamol": { "quantity": 1800, "low_stock_threshold": 500 },
            "Amlodipine": { "quantity": 700, "low_stock_threshold": 200 }
        },
        "opd_status": "Crowded",
        "doctor_availability": [
            { "specialty": "Orthopedics", "available": 3, "total": 5 },
            { "specialty": "Pediatrics", "available": 6, "total": 6 }
        ],
        "emergency_cases": [
             { "case_id": "er003", "description": "High fever", "severity": "Medium", "patientName": "A. Kumar" }
        ],
        "isGovernment": false,
        "special_equipment": ["MRI"],
        "location": { "lat": 12.9141, "lng": 77.6369 }
    },
    {
        "hospital_id": "hosp4",
        "name": "Sanjay Gandhi Institute",
        "live_medicine_stock": {
            "Paracetamol": { "quantity": 100, "low_stock_threshold": 500 },
            "Amlodipine": { "quantity": 700, "low_stock_threshold": 200 }
        },
        "opd_status": "Normal",
        "doctor_availability": [
            { "specialty": "Orthopedics", "available": 3, "total": 5 },
            { "specialty": "Pediatrics", "available": 6, "total": 6 }
        ],
        "emergency_cases": [],
        "isGovernment": true,
        "special_equipment": ["PET Scan"],
        "location": { "lat": 12.9248, "lng": 77.5807 }
    }
];
