import { SteriLabelFragment, SteriLabelModel } from "./steri-label.model"
import { UserFragment } from "./user.model"

export type CountStatus = 'counting'|'finished'|'failed'

export type CountModel = {
    id: number;
    created_at: string;
    updated_at: string;
    status: CountStatus;
    clinic_user: {
        id: number;
        name: string;
    }
    finish_at?: string;
    notes?: string;
    steri_labels?: {
        id: number;
        created_at: string;
        steri_label: SteriLabelModel;
    }[];
    steri_item_tally?: {
        id: number;
        steri_item_id: number;
        total: number;
    }[]

}

export const CountFragment = `
    id
    created_at
    updated_at
    status
    clinic_user {
        ${UserFragment}
    }
    finish_at
    notes
    steri_labels(order_by: {id: desc}) {
        id
        created_at
        steri_label {
            ${SteriLabelFragment}
        }
    }
    steri_item_tally {
        id
        steri_item_id
        total
    }
`