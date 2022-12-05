import { gql, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { Control, FieldValues, useController } from 'react-hook-form';
import { DropdownInput } from '../../lib/form/DropdownInput';
import Loading from '../../lib/Loading';
import { SteriFragment, SteriModel } from '../../models/steri.model';

export type SteriPickerProps = {
    name: string;
    control: Control<FieldValues, object>;
}


export const SteriPicker = ({
    name,
    control,
}: SteriPickerProps) => {
    const { field, fieldState } = useController({
        control,
        name,
    })
    const { loading, data } = useQuery(gql`query {
        steri (where: {archived_at: {_is_null: true}}) {
            ${SteriFragment}
        }
    }`)
    const sterilizers = (data?.steri || []) as SteriModel[]

    useEffect(() => {
        if (sterilizers.length > 0 && sterilizers.length === 1 && !field.value) {
            field.onChange({
                value: sterilizers[0].id,
                label: `${sterilizers[0].name} - ${sterilizers[0].serial}`,
            })
        }
    }, [data])

    if (loading) {
        return <Loading />
    }

    return <DropdownInput
        items={sterilizers.map(t => ({
            value: t.id,
            label: `${t.name} - ${t.serial}`,
        }))}
        label='Select a Sterilizer'
        onSelect={field.onChange}
        selected={field.value}
        error={fieldState.error?.message}
    />
}