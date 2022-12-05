import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from "yup"
import Button from '../../../lib/Button'
import SwitchInput from '../../../lib/form/SwitchInput'
import TextInput from '../../../lib/form/TextInput'
import { SteriModel } from '../../../models/steri.model'

export type TemplateFormProps = {
    steri?: SteriModel;
    onSave: (v: {
        name: string;
        serial: string;
        archived_at: string | null;
    }) => Promise<void>;
}

const schema = yup.object({
    name: yup.string().required('Please enter a name'),
    serial: yup.string().required('Please enter a serial number'),
}).required();

type SteriFields = {
    name: string;
    serial: string;
    is_active: boolean;
}

function SteriForm({
    steri,
    onSave,
}: TemplateFormProps) {
    const { control, handleSubmit } = useForm<SteriFields>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: steri?.name || '',
            serial: steri?.serial || '',
            is_active: !steri?.archived_at,
        }
    })

    const onSubmit: SubmitHandler<SteriFields> = async (data) => {
        return onSave({
            name: data.name,
            serial: data.serial,
            archived_at: data.is_active ? null : (steri?.archived_at || 'now()'),
        })
    }

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <TextInput
                label='Steri name (e.g. Top Sterilizer or Lexa 1)'
                control={control}
                name='name'
            />
            <TextInput
                label='Serial #'
                control={control}
                name='serial'
            />
            <SwitchInput
                label='Sterilizer is active'
                control={control}
                name='is_active'
            />
            <Button type='submit'>Save Sterilizer</Button>
        </form>
    )
}

export default SteriForm