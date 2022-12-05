import { gql, useLazyQuery } from '@apollo/client'
import React, { useState } from 'react'
import { UserFragment, UserModel } from '../models/user.model'
import { useClinic } from '../services/clinic.context'
import PinCodeInput from '../components/PinCodeInput'

export type NoUserScreenProps = {
    setUser: (user: UserModel) => void;
}

function NoUserScreen({
    setUser,
}: NoUserScreenProps) {
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
        }
        setUser(user);
    }

    return (
        <div className='my-6 mx-auto container'>
            <h1 className="text-2xl font-bold text-center text-indigo-600 sm:text-3xl">ZenSteri</h1>

            <p className="max-w-md mx-auto mt-4 text-center text-gray-500">
                Login with your PIN
            </p>

            {error && <p className="text-red-500 text-lg text-center mt-2">{error}</p>}
            <PinCodeInput onTestPin={onTestPin} />
        </div>
    )
}

export default NoUserScreen