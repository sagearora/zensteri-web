import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from "yup"
import Button from '../../../lib/Button'
import TextInput from '../../../lib/form/TextInput'
import { UserModel } from '../../../models/user.model'

export type UserFormprops = {
    user?: UserModel;
    onSave: (v: {
        name: string;
        pin: number;
    }) => Promise<void>;
}

const schema = yup.object({
    name: yup.string().required('Please enter a name'),
    pin: yup.string().min(4, 'Must be a 4 digit number').max(4, 'Must be a 4 digit number').required('Please enter a 4 digit number'),
}).required();

type SteriFields = {
    name: string;
    pin: number;
}

function UserForm({
    user,
    onSave,
}: UserFormprops) {
    const { control, handleSubmit } = useForm<SteriFields>({
        resolver: yupResolver(schema),
        defaultValues: user ? {
            name: user.name,
        } : {}
    })

    const onSubmit: SubmitHandler<SteriFields> = async (data) => {
        return onSave({
            name: data.name,
            pin: data.pin,
        })
    }

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <TextInput
                label='Full name'
                control={control}
                name='name'
            />
             <TextInput
                label='Pin # (Must be 4 digits)'
                control={control}
                type='number'
                name='pin'
            />
            <Button type='submit'>Save User</Button>
        </form>
    )
}

export default UserForm