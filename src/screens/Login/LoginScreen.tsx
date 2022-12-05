import { yupResolver } from '@hookform/resolvers/yup';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import Button from '../../lib/Button';
import TextInput from '../../lib/form/TextInput';
import { auth } from '../../firebase';
import { useDialog } from '../../lib/dialog.context';

const schema = yup.object({
    email: yup.string().required('Please enter your email'),
    password: yup.string().required('Please enter your password'),
}).required();

type LoginFields = {
    email: string;
    password: string;
}

function LoginScreen() {
    const dialog = useDialog();
    const [loading, setLoading] = useState(false);
    const { control, handleSubmit } = useForm<LoginFields>({
        resolver: yupResolver(schema),
        defaultValues: {

        }
    });

    const onSubmit: SubmitHandler<LoginFields> = async (data) => {
        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, data.email, data.password)
        } catch (e) {
            dialog.showError(e)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='container'>
            <div className="max-w-lg px-4 py-16 mx-auto sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-center text-indigo-600 sm:text-3xl">ZenSteri</h1>

                <p className="max-w-md mx-auto mt-4 text-center text-gray-500">
                    Dental sterilization simplified
                </p>
                <form
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div
                        className="p-8 mt-6 mb-0 space-y-4 rounded-lg shadow-2xl">
                        <TextInput
                            label='Email address'
                            control={control}
                            type='email'
                            name='email'
                        />
                        <TextInput
                            label='Password'
                            type='password'
                            control={control}
                            name='password'
                        />
                        <Button
                            loading={loading}
                            color="orange"
                            type='submit'>Sign In</Button>

                        <p className="text-sm text-center text-gray-500">
                            By signing in you agree that you have read and are in compliance with our <a className="underline" href="">
                                Acceptable Use Policy</a> and our  <a className="underline" href="">
                                Privacy Policy.</a>
                        </p>
                    </div>
                </form>
            </div>
        </div >
    )
}

export default LoginScreen