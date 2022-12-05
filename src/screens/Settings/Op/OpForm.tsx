import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from "yup"
import Button from '../../../lib/Button'
import SwitchInput from '../../../lib/form/SwitchInput'
import TextInput from '../../../lib/form/TextInput'
import { OpModel } from '../../../models/op.model'

export type OpFormProps = {
    op?: OpModel;
    onSave: (v: {
        name: string;
        archived_at: string | null;
    }) => Promise<void>;
    loading?: boolean;
}

const schema = yup.object({
    name: yup.string().required('Please enter an op name'),
}).required();

type OpFields = {
    name: string;
    is_active: boolean;
}

function OpForm({
    op,
    onSave,
    loading,
}: OpFormProps) {
    const { control, handleSubmit } = useForm<OpFields>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: op?.name || '',
            is_active: !op?.archived_at,
        }
    })

    const onSubmit: SubmitHandler<OpFields> = async (data) => {
        return onSave({
            name: data.name,
            archived_at: data.is_active ? null : (op?.archived_at || 'now()'),
        })
    }

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <TextInput
                label='Op name e.g. Suite #1'
                control={control}
                name='name'
            />
            <SwitchInput
                label='Op is active'
                control={control}
                name='is_active'
            />
            <Button loading={loading} type='submit'>Save Op</Button>
        </form>
    )
}

export default OpForm