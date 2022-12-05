import { gql, useMutation, useQuery } from "@apollo/client";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../lib/BackButton";
import { useDialog } from "../../../lib/dialog.context";
import Loading from "../../../lib/Loading";
import { SteriFragment, SteriModel } from "../../../models/steri.model";
import SteriForm from "./SteriForm";

function SteriEditScreen() {
    const dialog = useDialog();
    const navigate = useNavigate();
    const steri_id = useParams().steri_id
    const {
        loading,
        data,
    } = useQuery(gql`
        query($id: bigint!) { 
            steri_by_pk(id: $id) {
                ${SteriFragment}
            }
        }
    `, {
        variables: {
            id: steri_id,
        }
    })
    const [execute] = useMutation(gql`
        mutation save($id: bigint!, $set: steri_set_input!) {
            update_steri_by_pk(
                pk_columns: {id: $id},
                _set: $set,
            ) {
                ${SteriFragment}
            }
        }
    `)

    if (loading) {
        return <Loading />
    }
    const steri = data?.steri_by_pk as SteriModel;

    if (!steri) {
        return <div>Sorry sterilizer not found.</div>
    }

    const onSave = async (v: any) => {
        try {
            await execute({
                variables: {
                    id: steri.id,
                    set: v,
                }
            })
            navigate('..')
        } catch(e) {
            dialog.showError(e);
        }
    }



    return <div className='my-6 mx-auto container'>
        <BackButton href='/settings/sterilizers' />
        <div className='mt-2 mb-4'>
            <p className='text-sm text-gray-500'>Edit Sterilizer</p>
            <p className='font-bold'>{steri.name}</p>
        </div>
        <SteriForm
            steri={steri}
            onSave={onSave}
        />
    </div>
}

export default SteriEditScreen;
