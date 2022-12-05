import { yupResolver } from '@hookform/resolvers/yup';
import { encode as base64_encode } from 'base-64';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from "yup";
import Button from '../../lib/Button';
import TextInput from '../../lib/form/TextInput';

const schema = yup.object({
    content: yup.string().required('Please enter text for item'),
}).required();

export type TaskItemFormProps = {
    item?: {
        content: string;
        id: string;
    };
    loading?: boolean;
    onSave: (v:{id: string; content: string}) => Promise<boolean>;
    dismiss: () => void;
}

function TaskItemForm({
    item,
    loading,
    onSave,
    dismiss,
}: TaskItemFormProps) {

    const { control, reset, handleSubmit } = useForm<{
        content: string;
    }>({
        resolver: yupResolver(schema),
        defaultValues: {
            content: item?.content || '',
        }
    })

    const onSubmit: SubmitHandler<{ content: string }> = async (data) => {
        if (await onSave({
            id: base64_encode(data.content.toLowerCase()),
            content: data.content
        })) {
            reset()
        }
    }

    return (
        <form noValidate
            className='bg-slate-100 rounded-lg p-4 border-2' onSubmit={handleSubmit(onSubmit)}>
            <TextInput
                label='Enter checklist item'
                control={control}
                name='content'
            />
            <div className='flex justify-end'>
                <Button
                    className='w-fit mr-2'
                    onClick={dismiss} type='button'>Cancel</Button>
                <Button
                    loading={loading}
                    className='w-fit bg-green-200' type='submit'>Save Item</Button>
            </div>
        </form>
    )
}

export default TaskItemForm