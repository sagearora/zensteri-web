export type SteriModel = {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    serial: string;
    archived_at?: string;
}

export const SteriFragment = `
    id
    created_at
    updated_at
    name
    serial
    archived_at
`;