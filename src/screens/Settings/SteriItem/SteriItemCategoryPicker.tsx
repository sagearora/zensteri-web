import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Control, FieldValues, useController } from 'react-hook-form';
import AutocompleteInput from '../../../lib/form/AutocompleteInput';
import Loading from '../../../lib/Loading';

export type SteriItemCategoryPickerProps = {
    name: string;
    control: Control<FieldValues, object>;
}
const QueryUniqueCategories = gql`query unique_categories {
    steri_item (distinct_on: category) {
        id
        category
    }
}`

export const SteriItemCategoryPicker = ({
    name,
    control,
}: SteriItemCategoryPickerProps) => {
    const [options, setOptions] = useState<{
        value: string;
        label: string;
    }[]>([])
    const { loading, data } = useQuery(QueryUniqueCategories, {
        fetchPolicy: 'network-only'
    })
    const categories = (data?.steri_item || []) as { id: number; category: string }[]

    if (loading) {
        return <Loading />
    }

    const search = (text: string) => {
        setOptions(categories
            .filter(c => c.category.toLowerCase().indexOf(text.toLowerCase()) > -1)
            .map(t => ({
                value: t.category,
                label: `${t.category}`,
            })))
    }

    return <AutocompleteInput
        control={control}
        name={name}
        onInputChange={search}
        items={options}
        label='Select a Category'
    />
}