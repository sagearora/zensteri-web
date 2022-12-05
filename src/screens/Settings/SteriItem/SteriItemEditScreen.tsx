import { gql, useMutation, useQuery } from "@apollo/client";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../lib/BackButton";
import { useDialog } from "../../../lib/dialog.context";
import Loading from "../../../lib/Loading";
import NotFoundItem from "../../../lib/NotFoundItem";
import { SteriItemFragment, SteriItemModel } from "../../../models/steri-item.model";
import SteriItemForm from "./SteriItemForm";

function SteriItemEditScreen() {
    const dialog = useDialog();
    const navigate = useNavigate();
    const item_id = useParams().item_id
    const {
        loading,
        data,
    } = useQuery(gql`
        query($id: bigint!) { 
            steri_item_by_pk(id: $id) {
                ${SteriItemFragment}
            }
        }
    `, {
        variables: {
            id: item_id,
        }
    })
    const [execute] = useMutation(gql`
        mutation save($id: bigint!, $set: steri_item_set_input!) {
            update_steri_item_by_pk(
                pk_columns: {id: $id},
                _set: $set,
            ) {
                ${SteriItemFragment}
            }
        }
    `)

    if (loading) {
        return <Loading />
    }
    const steri_item = data?.steri_item_by_pk as SteriItemModel;

    if (!steri_item) {
        return <NotFoundItem title='Sorry, steri item was not found' />
    }

    const onSave = async (v: any) => {
        try {
            await execute({
                variables: {
                    id: steri_item.id,
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
            <p className='text-sm text-gray-500'>Edit Steri Item</p>
            <p className='font-bold'>{steri_item.name}</p>
        </div>
        <SteriItemForm
            steri_item={steri_item}
            onSave={onSave}
        />
    </div>
}

export default SteriItemEditScreen;
