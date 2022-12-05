import { PatientFragment, PatientModel } from "./patient.model";

export type OpModel = {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    archived_at?: string;
    patient?: PatientModel;
}

export const OpFragment = `
    id
    created_at
    updated_at
    name
    archived_at
    patient {
        ${PatientFragment}
    }
`;
