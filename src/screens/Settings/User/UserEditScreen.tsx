import { gql, useMutation, useQuery } from "@apollo/client";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../lib/BackButton";
import { useDialog } from "../../../lib/dialog.context";
import Loading from "../../../lib/Loading";
import NotFoundItem from "../../../lib/NotFoundItem";
import { UserFragment, UserModel } from "../../../models/user.model";
import UserForm from "./UserForm";

function UserEditScreen() {
    const dialog = useDialog();
    const navigate = useNavigate();
    const user_id = useParams().user_id
    const {
        loading,
        data,
    } = useQuery(gql`
        query($id: bigint!) { 
            clinic_user_by_pk(id: $id) {
                ${UserFragment}
            }
        }
    `, {
        variables: {
            id: user_id,
        }
    })
    const [execute] = useMutation(gql`
        mutation save($id: bigint!, $set: clinic_user_set_input!) {
            update_clinic_user_by_pk(
                pk_columns: {id: $id},
                _set: $set,
            ) {
                ${UserFragment}
            }
        }
    `)

    if (loading) {
        return <Loading />
    }
    const user = data?.clinic_user_by_pk as UserModel;

    if (!user) {
        return <NotFoundItem
            title='Sorry user not found'
        />
    }

    const onSave = async (v: any) => {
        try {
            await execute({
                variables: {
                    id: user.id,
                    set: v,
                }
            })
            navigate('..')
        } catch (e) {
            dialog.showError(e);
        }
    }



    return <div className='my-6 mx-auto container'>
        <BackButton href='/settings/users' />

        <div className='mb-4 mt-2'>
            <p className='text-sm text-gray-500'>Edit User</p>
            <p className='font-bold'>{user.name}</p>
        </div>
        <UserForm
            user={user}
            onSave={onSave}
        />
    </div>
}

export default UserEditScreen;
