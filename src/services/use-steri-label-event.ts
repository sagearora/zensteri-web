import { gql, useMutation } from "@apollo/client";
import { useDialog } from "../lib/dialog.context";
import { SteriLabelEvent, SteriLabelFragment, SteriLabelModel } from "../models/steri-label.model";

const MutationInsertSteriLabelEvent = gql`
mutation insert_event($object: steri_label_event_insert_input!) {
    insert_steri_label_event_one(object: $object) {
        id
        steri_label {
            ${SteriLabelFragment}
        }
    }
}
`;

export const useSteriLabelEvent = () => {
    const dialog = useDialog();
    const [insertEvent, status] = useMutation(MutationInsertSteriLabelEvent)

    const insert = async (v: {
        type: SteriLabelEvent;
        id: number;
        user_id: number;
        data?: any;
    }) => {
        try {
            const { data } = await insertEvent({
                variables: {
                    object: {
                        type: v.type,
                        steri_label_id: v.id,
                        clinic_user_id: v.user_id,
                        data: v.data || {}
                    },
                }
            })
            const item = data?.insert_steri_label_event_one as {
                id: number;
                steri_label: SteriLabelModel;
            }
            return item;
        } catch(e) {
            dialog.showError(e)
        }
    }

    return {
        insert,
        inserting: status.loading,
    }
}