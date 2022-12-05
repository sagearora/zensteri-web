import { gql, useApolloClient } from '@apollo/client';
import { Dialog, Transition } from '@headlessui/react';
import dayjs from 'dayjs';
import React, { Fragment, useMemo, useRef, useState } from 'react';
import { QRType } from '../../constants';
import { SteriLabelFragment, SteriLabelModel } from '../../models/steri-label.model';
import useScanner from '../../services/use-scanner';

function LabelScanner() {
    const apollo = useApolloClient();
    const [label, setLabel] = useState<SteriLabelModel | undefined>();
    const cancelButtonRef = useRef(null);

    const onScan = async (data: {
        type: QRType;
        id: number;
    }) => {
        if (data?.type === QRType.SteriLabel) {
            const { id } = data;
            // add this label to the load.
            try {
                const { data } = await apollo.query({
                    query: gql`query sl($id: bigint!) {
                        steri_label_by_pk(id: $id) {
                            ${SteriLabelFragment}
                        }
                    }`,
                    variables: {
                        id,
                    },
                    fetchPolicy: 'network-only',
                })
                const steri_label = data?.steri_label_by_pk;
                setLabel(steri_label)
            } catch (e) {
                console.error(e)
            }
        }
    }


    const color = useMemo(() => {
        if (!label) {
            return ''
        }
        if (label.appointment) {
            return 'bg-black text-white'
        }
        if (!label.steri_cycle) {
            return 'bg-slate-100'
        }
        if (label.steri_cycle.status === 'loading') {
            return 'bg-yellow-100'
        }
        if (label.steri_cycle.status === 'running') {
            return 'bg-blue-100'
        }
        if (label.steri_cycle.status === 'failed') {
            return 'bg-red-200'
        }
        if (label.steri_cycle.status === 'finished') {
            return 'bg-green-200'
        }
    }, [label?.steri_cycle])

    useScanner({
        is_scanning: true,
        onScan,
    })

    const onClose = () => {
        setLabel(undefined);
    }

    if (!label) {
        return null;
    }

    return (
        <Transition.Root show={!!label} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={onClose}>
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="relative inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <Dialog.Title as="h3" className="flex items-center text-lg px-4 pt-3 pb-2 w-full font-medium text-gray-900 border-b-2">
                                <div className='flex-1'>{label.id} - {label.steri_item.name}</div>
                                <button autoFocus={false} className='text-lg text-gray-800'
                                    onClick={onClose}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </Dialog.Title>
                            <div className={`${color} px-4 pt-5 pb-4`}>
                                <p className='text-sm'>#{label.id} - {label.steri_item.category}</p>
                                <p className='text-lg font-bold'>{label.steri_item.name}</p>
                                <p className='text-sm font-semibold'>{label.clinic_user.name}</p>
                                <p className='text-sm'>Date: {dayjs(label.created_at).format('YYYY-MM-DD HH:mm')}</p>
                                <p className='text-sm'>Exp: {dayjs(label.expiry_at).format('YYYY-MM-DD HH:mm')}</p>
                                {label.steri_cycle_clinic_user && label.steri_cycle && <div className='mt-2'>
                                    <p className='text-sm font-semibold'>Sterilization (<span className='capitalize'>{label.steri_cycle.status}</span>)</p>
                                    <p className='text-sm'>Cycle: #{label.steri_cycle.cycle_number}</p>
                                    <p className='text-sm'>Loaded By: {label.steri_cycle_clinic_user.name}</p>
                                    <p className='text-sm'>Loaded When: {dayjs(label.loaded_at).format('YYYY-MM-DD HH:mm')}</p>
                                </div>}
                                {label.appointment_clinic_user && label.appointment && <div className='mt-2'>
                                    <p className='text-sm font-semibold'>Appointment</p>
                                    <p className='text-sm'>Patient: {label.appointment.patient.first_name} {label.appointment.patient.last_name}</p>
                                    <p className='text-sm'>Checkout By: {label.appointment_clinic_user.name}</p>
                                    <p className='text-sm'>Checkout When: {dayjs(label.checkout_at).format('YYYY-MM-DD HH:mm')}</p>
                                </div>}
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default LabelScanner