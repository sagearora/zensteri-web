import { Switch } from '@headlessui/react'
import React from 'react'
import { useController } from 'react-hook-form'

export type SwitchInputProps = {
    control: any;
    name: string;
    label: string;
}

function SwitchInput({
    control,
    name,
    label,
}: SwitchInputProps) {
    const {
        field, fieldState
    } = useController({
        control,
        name,
    })
    return (
        <div className='mb-4 flex items-center'>
            <p className={[
                "flex-1",
                fieldState.error && 'text-red-500'
            ].join(' ')}>
                {label}
            </p>
            <Switch
                checked={field.value}
                onChange={field.onChange}
                className={`${field.value ? 'bg-orange-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
                <span className="sr-only">{label}</span>
                <span
                    className={`${field.value ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white`}
                />
            </Switch>
            {fieldState.error && <p className="text-red-500 text-xs italic mt-2">{fieldState.error.message}</p>}
        </div>
    )
}

export default SwitchInput