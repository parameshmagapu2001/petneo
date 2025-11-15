export interface PartnerAppointment {
    appointment_id: number;
    date: string;
    time: string;
    status: string;
    reason: string;
    visit_type: string;
    pet: PartnerPet;
}

export interface PartnerPet {
    id: number;
    name: string;
    species: string;
    breed: string;
    profile_picture: string;
}

export interface PartnerMyAppointments {
    upcoming: PartnerAppointment[];
    'on-going': PartnerAppointment[];
    completed: PartnerAppointment[];
    'no-show': PartnerAppointment[];
}

export interface PartnerPetDetails {
    id: number;
    name: string;
    species: string;
    gender: string;
    breeding: string;
    age: string;
    weight: number;
    licence: string;
    profile_picture: string;
}

export interface PetOwnerDetails {
    name: string;
    address: string;
    contact_number: string;
}

export interface PartnerPetAppointmentDetials {
    appointment_id: number;
    date: string;
    start_time: string;
    end_time: string;
    reason: string | null;
    status: 'booked' | 'completed';
    visit_type: 'in-clinic' | 'online';
}

export interface PetVaccinationDetails {
    id: number;
    vaccination_name: string;
    date_vaccinated: string;
    dose_type: string;
}

export interface PetPrescriptionDetails {
    id: number;
    appointment_id: number;
    prescription_file_url: string;
}