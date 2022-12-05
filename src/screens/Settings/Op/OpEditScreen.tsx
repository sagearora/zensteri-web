import { gql, useMutation, useQuery } from "@apollo/client";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../lib/BackButton";
import { useDialog } from "../../../lib/dialog.context";
import Loading from "../../../lib/Loading";
import NotFoundItem from "../../../lib/NotFoundItem";
import { OpFragment, OpModel } from "../../../models/op.model";
import OpForm from "./OpForm";

function OpEditScreen() {
    const dialog = useDialog();
    const navigate = useNavigate();
    const op_id = useParams().op_id
    const {
        loading,
        data,
    } = useQuery(gql`
        query($id: bigint!) { 
            op_by_pk(id: $id) {
                ${OpFragment}
            }
        }
    `, {
        variables: {
            id: op_id,
        }
    })
    const [execute, save] = useMutation(gql`
        mutation save($id: bigint!, $set: op_set_input!) {
            update_op_by_pk(
                pk_columns: {id: $id},
                _set: $set,
            ) {
                ${OpFragment}
            }
        }
    `)

    if (loading) {
        return <Loading />
    }
    const op = data?.op_by_pk as OpModel;

    if (!op) {
        return <NotFoundItem title="Sorry op not found." />
    }

    const onSave = async (v: any) => {
        try {
            await execute({
                variables: {
                    id: op.id,
                    set: v,
                }
            })
            navigate('..')
        } catch(e) {
            dialog.showError(e);
        }
    }



    return <div className='my-6 mx-auto container'>
        <BackButton href='/settings/ops' />
        <div className='mt-2 mb-4'>
            <p className='text-sm text-gray-500'>Edit Operatory</p>
            <p className='font-bold'>{op.name}</p>
        </div>
        <OpForm
            op={op}
            loading={save.loading}
            onSave={onSave}
        />
    </div>
}

export default OpEditScreen;
