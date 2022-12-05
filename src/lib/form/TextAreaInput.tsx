import React, { forwardRef } from 'react';
import { useController } from 'react-hook-form';

export interface TextAreaInputProps extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
    label: string;
    name: string;
    placeholder?: string;
    control: any;
    disablePadding?: boolean;
}

const TextAreaInput = forwardRef<HTMLTextAreaElement, TextAreaInputProps>(({
    label,
    name,
    placeholder,
    control,
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
            <label
                htmlFor={label}
                className={[
                    "block text-gray-700 text-sm font-bold mb-2",
                    fieldState.error && 'text-red-500'
                ].join(' ')}>
                {label}
            </label>
            <textarea
                {...props}
                ref={ref}
                className={[
                    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
                    fieldState.error && 'border-red-500',
                ].join(' ')}
                id={label}
                value={field.value}
                onChange={field.onChange}
                placeholder={placeholder} />
            {fieldState.error && <p className="text-red-500 text-xs italic mt-2">{fieldState.error.message}</p>}

        </div>
    )
});

export default TextAreaInput