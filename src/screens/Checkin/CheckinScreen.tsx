import { gql, useMutation } from '@apollo/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useState } from 'react';
import SteriLabel from '../../components/SteriLabel';
import { QRType } from '../../constants';
import { useDialog } from '../../lib/dialog.context';
import { SteriLabelEvent, SteriLabelFragment, SteriLabelModel } from '../../models/steri-label.model';
import useScanner from '../../services/use-scanner';
import { useUser } from '../../services/user.context';

dayjs.extend(relativeTime)


const MutationInsertSteriLabelEvent = gql`
    mutation insert_event($object: steri_label_event_insert_input!) {
        insert_steri_label_event_one(object: $object) {
            id
            steri_label {
                ${SteriLabelFragment}
            }
        }
    }
`;

function CheckinScreen() {
    const { user } = useUser();
    const [items, setItems] = useState<SteriLabelModel[]>([])
    const dialog = useDialog();
    const [insertEvent] = useMutation(MutationInsertSteriLabelEvent)
    const [loading_label, setLoadingLabel] = useState<{ [id: number]: boolean }>({});

    const onScan = async (data: {
        type: QRType;
        id: number;
    }) => {
        if (!user) {
            return;
        }
        if (data?.type === QRType.SteriLabel) {
            const { id } = data;
            // add this label to the load.
            try {
                const { data } = await insertEvent({
                    variables: {
                        object: {
                            type: SteriLabelEvent.AppointmentReturn,
                            steri_label_id: id,
                            clinic_user_id: user.id,
                            data: {}
                        },
                    }
                })
                const item = data?.insert_steri_label_event_one as {
                    id: number;
                    steri_label: SteriLabelModel;
                }
                if (!item) {
                    dialog.showToast({
                        message: `Failed to add item`,
                        type: 'error',
                    });
                    return;
                }
                setItems(i => [item.steri_label, ...i])
                dialog.showToast({
                    message: `Re stocked ${item.steri_label.steri_item.name}`,
                    type: "success",
                });
            } catch (e) {
                dialog.showError(e)
            }
        }
    }

    useScanner({
        is_scanning: true,
        onScan: onScan
    })

    return (
        <div className='my-6 container'>
            <div className='flex flex-col items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                </svg>
                {items.length > 0 && <>
                    <p className='text-5xl font-bold text-green-600'>{items.length} Items</p>
                    <p className='text-lg'>Last Added: <span className='font-bold text-green-600'>
                        {items[0]?.steri_item?.name}</span> {dayjs(items[0]?.loaded_at).fromNow()}</p>
                </>}
                <h2 className='text-md font-semibold text-gray-600'>Use the handheld scanner to scan all items that you are re-stocking.</h2>
            </div>
            <div className='grid grid-cols-2 gap-4 mt-4'>
                {items.map((item) => <SteriLabel
                    item={item}
                    loading={loading_label[item.id]}
                    key={item.id} />)
                }
            </div>
        </div>
    )
}

export default CheckinScreen