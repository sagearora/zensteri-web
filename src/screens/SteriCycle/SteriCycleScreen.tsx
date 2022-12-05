import { gql, useMutation, useSubscription } from '@apollo/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import SteriLabel from '../../components/SteriLabel';
import { QRType } from '../../constants';
import BackButton from '../../lib/BackButton';
import { useDialog } from '../../lib/dialog.context';
import Loading from '../../lib/Loading';
import NotFoundItem from '../../lib/NotFoundItem';
import { SteriCycleFragment, SteriCycleModel } from '../../models/steri-cycle.model';
import { SteriLabelEvent, SteriLabelFragment, SteriLabelModel } from '../../models/steri-label.model';
import useScanner from '../../services/use-scanner';
import { useUser } from '../../services/user.context';
import SteriController from './SteriController';
import SteriLogViewer from './SteriLogViewer';

dayjs.extend(relativeTime)

export const SubSteriCycleByPk = gql`
    subscription steri_cycle($id: bigint!) {
        steri_cycle_by_pk(id: $id) {
            ${SteriCycleFragment}
        }
    }
`;

const MutationAddItem = gql`
    mutation insert_steri_label_event($object: steri_label_event_insert_input!) {
        insert_steri_label_event_one(object: $object) {
            id
            steri_label {
                ${SteriLabelFragment}
            }
        }
    }
`;

const MutationUpdateSteriCycle = gql`
mutation update_steri_cycle($id: bigint!, $set: steri_cycle_set_input!) {
    update_steri_cycle_by_pk(
        pk_columns: {
            id: $id
        }, _set: $set) {
        ${SteriCycleFragment}
    }
}
`

function SteriCycleScreen() {
    const { user } = useUser();
    const cycle_id = +(useParams().cycle_id as string);
    const dialog = useDialog();
    const [insertSteriLabelEvent] = useMutation(MutationAddItem)
    const [loading_steri_cycle_item, setLoadingSteriCycleItem] = useState<{ [id: number]: boolean }>({})

    const {
        data,
        loading,
    } = useSubscription(SubSteriCycleByPk, {
        variables: {
            id: cycle_id,
        }
    })

    const cycle = data?.steri_cycle_by_pk as SteriCycleModel;

    const onScan = async (data: {
        type: QRType;
        id: number;
    }) => {
        if (!cycle) {
            return;
        }
        if (data?.type === QRType.SteriLabel) {
            const { id } = data;
            // add this label to the load.
            try {
                const { data } = await insertSteriLabelEvent({
                    variables: {
                        object: {
                            type: SteriLabelEvent.SteriCycleAddItem,
                            steri_label_id: id,
                            clinic_user_id: user.id,
                            data: {
                                steri_cycle_id: cycle_id,
                            }
                        }
                    }
                })
                const item = data?.insert_steri_label_event_one as {
                    id: number;
                    steri_label: SteriLabelModel
                };
                if (!item) {
                    dialog.showToast({
                        message: `Failed to add item`,
                        type: 'error',
                    });
                    return;
                }
                dialog.showToast({
                    message: `Added ${item.steri_label.steri_item.name} to #${cycle_id}`,
                    type: "success",
                });
            } catch (e) {
                dialog.showError(e)
            }
        }
    }

    const { is_scanning } = useScanner({
        is_scanning: !!user,
        onScan: onScan
    })

    const [executeMutation, status] = useMutation(MutationUpdateSteriCycle);

    const removeSteriCycleItem = async (steri_label: SteriLabelModel) => {
        setLoadingSteriCycleItem(l => ({
            ...l,
            [steri_label.id]: true,
        }))
        try {
            await insertSteriLabelEvent({
                variables: {
                    object: {
                        type: SteriLabelEvent.SteriCycleRemoveItem,
                        data: {},
                        steri_label_id: steri_label.id,
                        clinic_user_id: user.id,
                    }
                }
            })
        } catch (e) {
            dialog.showError(e)
        } finally {
            setLoadingSteriCycleItem(l => ({
                ...l,
                [steri_label.id]: false,
            }))
        }
    }
    const updateCycle = async (v: any) => {
        try {
            await executeMutation({
                variables: {
                    id: cycle.id,
                    set: v,
                }
            });
        } catch (e) {
            dialog.showError(e);
        }
    }


    if (loading) {
        return <Loading />
    }

    if (!cycle) {
        return <NotFoundItem title='Sorry, this steri cycle was not found' />
    }

    return (
        <div className='my-6 mx-auto container'>
            <BackButton href='/cycles' />
            <div className='mt-2 flex items-start border-b-2 pb-2'>
                <div className='flex-1'>
                    <p className='text-sm text-gray-500'>{cycle.id} - {cycle.steri?.name}</p>
                    <p className='font-bold'>Cycle #: {cycle.cycle_number}</p>
                    <p className='text-sm'>Start: {cycle.start_at ? `${dayjs(cycle.start_at).format('MM/DD/YYYY HH:mm')} - ${cycle.start_user?.name}` : 'Not Started'}</p>
                    <p className='text-sm'>Finish: {cycle.finish_at ? `${dayjs(cycle.finish_at).format('MM/DD/YYYY HH:mm')} - ${cycle.finish_user?.name}` : 'Not finished'}</p>
                </div>
                <Link to='edit'>Edit</Link>
            </div>
            {cycle.is_spore_test_enabled && <div className={`${!cycle.spore_test_recorded_at ? 'bg-orange-200' : cycle.spore_test_result === 'passed' ? 'bg-green-200' : 'bg-red-200'} p-2 rounded-xl my-2`}>
                <p className='text-sm font-bold'>Spore Test</p>
                {cycle.spore_test_user && <p className='text-sm'>Recorded by: {cycle.spore_test_user.name}</p>}
                <p className='text-sm'>{!cycle.spore_test_result ? 'Pending results' : `${cycle.spore_test_result} @ ${dayjs(cycle.spore_test_recorded_at).format('MM/DD/YYYY HH:mm')}`}</p>
            </div>}
            {cycle.notes ? <div className='my-2'>
                <p className='text-sm text-gray-800 font-semibold'>Notes</p>
                <p className='text-sm'>{cycle.notes}</p>
            </div> : null}

            {cycle.status === 'loading' && <div className='my-4 flex flex-col items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                </svg>
                {cycle.steri_labels && cycle.steri_labels.length > 0 && <>
                    <p className='text-5xl font-bold text-green-600'>{cycle.steri_labels.length} Items</p>
                    <p className='text-lg'>Last Added: <span className='font-bold text-green-600'>
                        {cycle.steri_labels[0]?.steri_item?.name}</span> {dayjs(cycle.steri_labels[0]?.loaded_at).fromNow()}</p>
                </>}
                <h2 className='text-md font-semibold text-gray-600'>Use the handheld scanner to scan all items going into the sterilizer.</h2>
            </div>}

            {(cycle.steri_labels || []).length > 0 ? <SteriController
                status={cycle.status}
                user={user}
                finish_at={cycle.finish_at}
                updateCycle={updateCycle}
                loading={status.loading}
            /> : null}

            <SteriLogViewer log_data={cycle.log_data} />



            <div className='py-4'>
                {!is_scanning && (cycle.steri_labels || []).length === 0 && <div className='my-6 mx-auto container flex flex-col items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                        className="w-24 h-24 mb-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
                    </svg>

                    <h1 className='text-center mb-2 font-bold text-md'>You must scan items into Sterilizer before you can start the cycle.</h1>
                </div>}
                {(cycle.steri_labels || []).length > 0 && <p className='text-lg font-bold'>Content</p>}
                <div className='grid grid-cols-2 gap-4'>
                    {
                        (cycle.steri_labels || []).map((item) =>
                            <SteriLabel
                                key={item.id}
                                item={item}
                                remove={cycle.status === 'loading' ? () => removeSteriCycleItem(item) : undefined}
                                loading={loading_steri_cycle_item[item.id]}
                            />)
                    }
                </div>
            </div>
        </div >
    )
}

export default SteriCycleScreen