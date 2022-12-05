import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../lib/BackButton";
import { LargeInt, PageLimit } from "../../../constants";
import { OpFragment } from "../../../models/op.model";
import { QueryOpList } from "../../../queries";
import { useClinic } from "../../../services/clinic.context";
import { useDialog } from "../../../lib/dialog.context";
import OpForm from "./OpForm";

function OpCreateScreen() {
    const { clinic } = useClinic();
    const dialog = useDialog();
    const navigate = useNavigate();
    const [execute, { loading }] = useMutation(gql`
        mutation create($object: op_insert_input!) {
            insert_op_one(
                object: $object,
            ) {
                ${OpFragment}
            }
        }
    `, {
        refetchQueries: [{
            query: QueryOpList(),
            variables: {
                cursor: LargeInt,
                limit: PageLimit,
            }
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
        } catch (e) {
            dialog.showError(e);
        }
    }



    return <div className='my-6 mx-auto container'>
        <div className='mb-4 flex items-center'>
            <BackButton href='/settings/ops' />
            <p className='ml-2 font-bold'>Create Op</p>
        </div>
        <OpForm
            loading={loading}
            onSave={onSave}
        />
    </div>
}

export default OpCreateScreen;
