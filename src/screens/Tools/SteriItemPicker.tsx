import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Control, FieldValues } from 'react-hook-form';
import AutocompleteInput from '../../lib/form/AutocompleteInput';
import Loading from '../../lib/Loading';

export type SteriItemCategoryPickerProps = {
    name: string;
    control: Control<FieldValues, object>;
}
const QueryUniqueCategories = gql`query unique_categories {
    steri_item (where: {archived_at: {_is_null: true}}, order_by: {category: asc}) {
        id
        name
        category
    }
}`

export const SteriItemPicker = ({
    name,
    control,
}: SteriItemCategoryPickerProps) => {
    const [options, setOptions] = useState<{value: number; label: string}[]>([])
    const { loading, data } = useQuery(QueryUniqueCategories, {
        fetchPolicy: 'network-only'
    })
    const categories = (data?.steri_item || []) as { id: number; name: string; category: string }[]

    if (loading) {
        return <Loading />
    }

    const search = (text: string) => {
        setOptions(categories
            .filter(c => `${c.name} - ${c.category}`.toLowerCase().indexOf(text.toLowerCase()) > -1)
            .map(t => ({
                value: t.id,
                label: `${t.name} - ${t.category}`,
            })))
    }

    return <AutocompleteInput
        control={control}
        name={name}
        onInputChange={search}
        items={options}
        label='Select a Steri Item'
    />
}