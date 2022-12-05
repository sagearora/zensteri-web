export type UserModel = {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    pin: number;
    clinic_id: number;
    is_admin?: boolean;
}

export const UserFragment = `
    id
    created_at
    updated_at
    name
    pin
    clinic_id
    is_admin
`;