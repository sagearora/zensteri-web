import React, { DetailedHTMLProps, InputHTMLAttributes, RefObject, useCallback, useState } from 'react';
import DatePicker from 'react-date-picker';
import { useController } from 'react-hook-form';

export interface DateInputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    control: any;
    name: string;
    label?: string;
    ref?: RefObject<HTMLInputElement>;
    disablePadding?: boolean;
}

function DateInput({
    control,
    name,
    ref,
    label,
    disablePadding
}: DateInputProps) {
    const {
        field, fieldState
    } = useController({
        control,
        name,
    })

    const onChange = useCallback((value: Date) => {
        field.onChange(value)
    }, [field.onChange])

    return (
        <div className={[
            disablePadding ? '' : 'mb-4',
            'w-full'
        ].join(' ')}>
            {label ? <label
                htmlFor={label}
                className={[
                    "block text-sm font-bold mb-2",
                    fieldState.error ? 'text-red-500' : 'text-gray-700'
                ].join(' ')}>
                {label}
            </label> : null}
            <DatePicker
                inputRef={ref}
                format='yyyy/MM/dd'
                className='datepicker'
                onChange={onChange}
                value={field.value} />
            {fieldState.error && <p className="text-red-500 text-xs italic mt-2">{fieldState.error.message}</p>}
        </div>
    )
}

export default DateInput