export type PatientModel = {
    id: number;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    dob: string;
    archived_at?: string;
}

export const PatientFragment = `
    id
    created_at
    updated_at
    first_name
    last_name
    dob
    archived_at
`;
