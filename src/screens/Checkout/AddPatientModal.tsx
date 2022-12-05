import { gql, useMutation } from '@apollo/client'
import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useRef } from 'react'
import { LargeInt, PageLimit } from '../../constants'
import { useDialog } from '../../lib/dialog.context'
import { PatientFragment, PatientModel } from '../../models/patient.model'
import { useClinic } from '../../services/clinic.context'
import PatientForm from '../Patient/PatientForm'
import { QueryPatientList } from '../Patient/PatientListScreen'

export type AddPatientModalProps = {
    show?: boolean;
    onClose: () => void;
    onCreate: (patient: PatientModel) => void;
}

function AddPatientModal({
    show,
    onClose,
    onCreate,
}: AddPatientModalProps) {
    const dialog = useDialog();
    const { clinic } = useClinic();
    const cancelButtonRef = useRef(null)
    const [execute, { loading }] = useMutation(gql`
        mutation create($object: patient_insert_input!) {
            insert_patient_one(
                object: $object,
            ) {
                ${PatientFragment}
            }
        }
    `, {
        refetchQueries: [{
            query: QueryPatientList,
            variables: {
                cursor: LargeInt,
                limit: PageLimit,
            }
        }]
    })

    const onSave = async (v: any) => {
        try {
            const { data } = await execute({
                variables: {
                    object: {
                        ...v,
                        clinic_id: clinic.id,
                    }
                }
            })
            if (data?.insert_patient_one) {
                onCreate(data.insert_patient_one)
            }
        } catch (e) {
            dialog.showError(e);
        }
    }

    return (
        <Transition.Root show={show} as={Fragment}>
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
                                <div className='flex-1'>Add Patient</div>
                                <button autoFocus={false} className='text-lg text-gray-800'
                                    onClick={onClose}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </Dialog.Title>
                            <div className="px-4 pt-5 pb-4">
                                <PatientForm
                                    loading={loading}
                                    onSave={onSave}
                                />
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default AddPatientModal