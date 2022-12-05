import { gql, useApolloClient } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from "yup";
import { ZsMessageChannel } from '../../ZsMessageChannel';
import { QRType } from '../../constants';
import Button from '../../lib/Button';
import { useDialog } from '../../lib/dialog.context';
import TextInput from '../../lib/form/TextInput';
import { createQr } from '../../services/qr-service';

const schema = yup.object({
    steri_label_id: yup.string().required('Please enter a label ID'),
}).required();

type ReprintFields = {
    steri_label_id: string;
}

function ReprintLabel() {
    const dialog = useDialog()
    const client = useApolloClient()
    const [loading, setLoading] = useState(false);
    const { control, handleSubmit } = useForm<ReprintFields>({
        resolver: yupResolver(schema),
        defaultValues: {
            steri_label_id: ''
        }
    });

    const onSubmit: SubmitHandler<ReprintFields> = async (values) => {
        try {
            const { data } = await client.query({
                query: gql`query ($id: bigint!) {
                    steri_label_by_pk(id: $id) {
                        id
                        steri_item {
                            id
                            name
                            category
                        }
                        clinic_user {
                            id
                            name
                        }
                        created_at
                        expiry_at
                    }
                }`,
                variables: {
                    id: values.steri_label_id,
                }
            })
            const label = data?.steri_label_by_pk;
            if (!label) {
                dialog.showDialog({
                    title: 'Not found',
                    message: 'Label not found with this id',
                    buttons: [{
                        children: 'Ok',
                    }],
                })
                return;
            }
            const result = await window.electron.ipcRenderer.invoke('zs-message', [
                ZsMessageChannel.PrintLabel,
                {
                    user: label.clinic_user.name,
                    contents: label.steri_item.name,
                    date: label.created_at,
                    expiry: label.expiry_at,
                    qr: createQr({
                        type: QRType.SteriLabel,
                        id: label.id,
                    }),
                    category: label.steri_item.category,
                    id: label.id,
                }
            ])
            if (result !== 'success') {
                dialog.showDialog({
                    title: 'Fail to print',
                    message: result,
                    buttons: [{
                        children: 'Okay'
                    }]
                })
            }
        } catch (e) {
            dialog.showError(e)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='py-6 border-b-2'>
            <p className='font-bold text-lg'>Re-print label</p>
            <p className='mb-2'>Use this tool if you need to re-print a label because it is damaged or if you changed the label item.</p>
            <form
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                className='max-w-md'
            >
                <TextInput
                    label='Label ID'
                    control={control}
                    type='number'
                    name='steri_label_id'
                />
                <Button
                    loading={loading}
                    color="orange"
                    className='flex items-center'
                    type='submit'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                    </svg>
                    Re-Print
                </Button>
            </form>
        </div>
    )
}

export default ReprintLabel