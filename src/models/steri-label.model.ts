import { SteriStatus } from "./steri-cycle.model";

export enum SteriLabelEvent {
    SteriCycleAddItem='stericycle_add_item',
    SteriCycleRemoveItem='stericycle_remove_item',
    AppointmentCheckout='appointment_checkout',
    AppointmentReturn='appointment_return',
    UpdateSteriItemId='update_steri_item_id',
}

export type SteriLabelModel = {
    id: number;
    created_at: string;
    updated_at: string;
    expiry_at: string;
    steri_item_id: number;
    steri_item: {
        id: number;
        name: string;
        category: string;
    }
    clinic_user: {
        id: number;
        name: string;
    }
    steri_cycle_id?: number;
    steri_cycle?: {
        id: number;
        status: SteriStatus;
        cycle_number: string;
    };
    steri_cycle_clinic_user?: {
        id: number;
        name: string;
    }
    loaded_at?: string;
    appointment?: {
        id: number;
        patient: {
            id: number;
            first_name: string;
            last_name: string;
            dob: string;
        }
    }
    checkout_at?: string;
    appointment_clinic_user?: {
        id: number;
        name: string;
    }
}

export const SteriLabelFragment = `
    id
    created_at
    updated_at
    expiry_at
    steri_item_id
    steri_item {
        id
        name
        category
    }
    clinic_user {
        id
        name
    }
    steri_cycle_id
    steri_cycle {
        id
        status
        cycle_number
    }
    steri_cycle_clinic_user {
        id
        name
    }
    loaded_at
    appointment {
        id
        patient {
            id
            first_name
            last_name
            dob
        }
    }
    appointment_clinic_user {
        id
        name
    }
    checkout_at
`;