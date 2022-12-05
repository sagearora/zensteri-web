import { PatientFragment, PatientModel } from "./patient.model";

export type AppointmentModel = {
    id: number;
    created_at: string;
    deleted_at?: string;
    patient_id: string;
    schedule_date: string;
    patient: PatientModel
}

export const AppointmentFragment = `
    id
    created_at
    deleted_at
    patient_id
    schedule_date
    patient {
        ${PatientFragment}
    }
`