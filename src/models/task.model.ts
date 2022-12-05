export type TaskModel = {
    id: number;
    created_at: string;
    title: string;
    is_recurring: boolean;
    rrule?: string;
    start_at: string;
    end_at: string;
    items?: {
        id: string;
        content: string;
    }[];
    clinic_id: number;
}


export const TaskFragment = `
    id
    created_at
    is_recurring
    title
    rrule
    start_at
    end_at
    items
    clinic_id
`
