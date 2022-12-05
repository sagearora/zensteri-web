import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from "yup"
import Button from '../../lib/Button'
import DateInput from '../../lib/form/DateInput'
import SwitchInput from '../../lib/form/SwitchInput'
import TextInput from '../../lib/form/TextInput'
import { PatientModel } from '../../models/patient.model'

export type PatientFormProps = {
    patient?: PatientModel;
    onSave: (v: {
        first_name: string;
        last_name: string;
        dob: string;
        archived_at: string | null;
    }) => Promise<void>;
    loading?: boolean;
}

const schema = yup.object({
    first_name: yup.string().required('Please enter a first name'),
    last_name: yup.string().required('Please enter a last name'),
    dob: yup.date().required('Please enter a date of birth'),
}).required();

type PatientFields = {
    first_name: string;
    last_name: string;
    dob: Date;
    is_active: boolean;
}

function PatientForm({
    patient,
    onSave,
    loading,
}: PatientFormProps) {
    const { control, handleSubmit } = useForm<PatientFields>({
        resolver: yupResolver(schema),
        defaultValues: {
            first_name: patient?.first_name || '',
            last_name: patient?.last_name || '',
            dob: patient ? new Date(`${patient.dob}T00:00:00`) : undefined,
            is_active: !patient?.archived_at,
        }
    })

    const onSubmit: SubmitHandler<PatientFields> = async (data) => {
        return onSave({
            first_name: data.first_name,
            last_name: data.last_name,
            dob: data.dob.toDateString(),
            archived_at: data.is_active ? null : (patient?.archived_at || 'now()'),
        })
    }

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className='grid grid-cols-2 gap-2'>
                <TextInput
                    label='First name'
                    control={control}
                    name='first_name'
                />
                <TextInput
                    label='Last name'
                    control={control}
                    name='last_name'
                />
            </div>
            <DateInput
                label='Date of birth'
                control={control}
                name='dob'
            />
            <SwitchInput
                label='Patient is active'
                control={control}
                name='is_active'
            />
            <Button loading={loading} type='submit'>Save Patient</Button>
        </form>
    )
}

export default PatientForm