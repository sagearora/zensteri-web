import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../lib/BackButton";
import { useDialog } from "../../../lib/dialog.context";
import { SteriFragment } from "../../../models/steri.model";
import { QuerySteriList } from "../../../queries";
import { useClinic } from "../../../services/clinic.context";
import SteriForm from "./SteriForm";

function SteriCreateScreen() {
    const { clinic } = useClinic();
    const dialog = useDialog();
    const navigate = useNavigate();
    const [execute] = useMutation(gql`
        mutation create($object: steri_insert_input!) {
            insert_steri_one(
                object: $object,
            ) {
                ${SteriFragment}
            }
        }
    `, {
        refetchQueries: [{
            query: QuerySteriList(),
        }]
    })

    const onSave = async (v: any) => {
        try {
            await execute({
                variables: {
                    object: {
                        ...v,
                        clinic_id: clinic.id,
                    }
                }
            })
            navigate('..')
        } catch(e) {
            dialog.showError(e);
        }
    }



    return <div className='my-6 mx-auto container'>
        <div className='mb-4 flex items-center'>
            <BackButton href='/settings/sterilizers' />
            <p className='ml-2 font-bold'>Create Sterilizer</p>
        </div>
        <SteriForm
            onSave={onSave}
        />
    </div>
}

export default SteriCreateScreen;
