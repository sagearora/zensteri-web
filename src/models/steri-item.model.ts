export type SteriItemModel = {
    id: number;
    created_at: string;
    updated_at: string;
    clinic_id: number;
    name: string;
    archived_at?: string;
    category: string;
    is_label_printed: boolean;
    contents?: string;
    is_count_enabled: boolean;
    total_count: number;
    total_checked_out: number;
    total_checked_in?: {
        id: number;
        total_records?: number;
    }
}

export const SteriItemFragment = `
    id
    created_at
    updated_at
    clinic_id
    name
    archived_at
    category
    is_label_printed
    contents
    is_count_enabled
    total_count
    total_checked_out
    total_checked_in {
        id
        total_records
    }
`;
