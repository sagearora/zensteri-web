import React, { forwardRef } from 'react';
import { useController } from 'react-hook-form';

export interface TextInputProps extends 
React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    label?: string;
    name: string;
    control: any;
    disablePadding?: boolean;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({
    label,
    placeholder,
    type,
    name,
    control,
    className,
    disablePadding,
    ...props
}, ref) => {
    const { 
        field, fieldState
    } = useController({
        control,
        name,
    })
    return (
        <div className={[
            disablePadding ? '' : 'mb-4',
            'w-full'
        ].join(' ')}>
            {label ? <label
                htmlFor={label}
                className={[
                    "block text-gray-700 text-sm font-bold mb-2",
                    fieldState.error && 'text-red-500'
                ].join(' ')}>
                {label}
            </label> : null}
            <input
                {...props}
                ref={ref}
                value={field.value}
                onChange={field.onChange}
                className={[
                    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
                    fieldState.error && 'border-red-500',
                ].join(' ')}
                id={label}
                type={type}
                placeholder={placeholder} />
            {fieldState.error && <p className="text-red-500 text-xs italic mt-2">{fieldState.error.message}</p>}

        </div>
    )
});

export default TextInput