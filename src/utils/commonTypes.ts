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