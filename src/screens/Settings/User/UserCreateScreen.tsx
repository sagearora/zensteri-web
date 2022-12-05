import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../lib/BackButton";
import { useDialog } from "../../../lib/dialog.context";
import { UserFragment } from "../../../models/user.model";
import { useClinic } from "../../../services/clinic.context";
import UserForm from "./UserForm";
import { QueryUserList } from "./UserListScreen";

function UserCreateScreen() {
    const { clinic } = useClinic();
    const dialog = useDialog();
    const navigate = useNavigate();
    const [execute] = useMutation(gql`
        mutation create($object: clinic_user_insert_input!) {
            insert_clinic_user_one(
                object: $object,
            ) {
                ${UserFragment}
            }
        }
    `, {
        refetchQueries: [{
            query: QueryUserList,
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
            <BackButton href='/settings/users' />
            <p className='ml-2 font-bold'>Add User</p>
        </div>
        <UserForm
            onSave={onSave}
        />
    </div>
}

export default UserCreateScreen;
