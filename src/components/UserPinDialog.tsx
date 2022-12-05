import { useLazyQuery, gql } from '@apollo/client'
import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'
import { UserFragment, UserModel } from '../models/user.model'
import PinCodeInput from './PinCodeInput'

export type UserPinDialogProps = {
    show?: boolean;
    onClose: () => void;
    setUser: (user: UserModel) => void;
}

function UserPinDialog({
    show,
    onClose,
    setUser,
}: UserPinDialogProps) {
    const [error, setError] = useState('');
    const [query] = useLazyQuery(gql`
    query get_user_by_pin($pin: smallint!) {
        clinic_user(where: {
            pin: {_eq: $pin}
        }) {
            ${UserFragment}
        }
    }`)

    const onTestPin = async (pin: string) => {
        setError('');
        const result = await query({
            variables: {
                pin: +pin,
            }
        });
        const user = (result?.data?.clinic_user || [])[0] as UserModel;
        if (!user) {
            setError('Wrong Pin');
            return;
        }
        setUser(user);
    }

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className='bg-white p-4 rounded-xl relative'>
                                <button
                                    onClick={onClose} className='absolute right-0 top-0 p-4 outline-0'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                                <div className='text-lg font-bold text-center'>Enter your pin.</div>
                                <PinCodeInput
                                    onTestPin={onTestPin}
                                />
                                {error && <p className="text-red-500 text-lg text-center mt-2">{error}</p>}
                            </div>

                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default UserPinDialog