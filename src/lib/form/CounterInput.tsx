import React from "react"
import { Control, FieldValues, useController } from "react-hook-form"

export type CounterInputProps = {
    name: string;
    label: string;
    control: Control<FieldValues, object>;
    rules?: any;
    min?: number;
    max?: number;
}

export const CounterInput = ({
    name,
    label,
    control,
    rules,
    min,
    max,
}: CounterInputProps) => {
    const { field, fieldState } = useController({
        control,
        name,
        rules
    })

    const increaseCount = () => {
        if (max !== undefined) {
            field.onChange(Math.min(max, (+field.value || 0) + 1))
            return;
        }
        field.onChange((+field.value || 0) + 1)

    }

    const decreaseCount = () => {
        if (min !== undefined) {
            field.onChange(Math.max(min, (+field.value || 0) - 1))
            return;
        }
        field.onChange((+field.value || 0) - 1)
    }

    return <div className='flex py-2 border-b-2 items-center'>
        <p className='text-md flex-1'>{label}</p>
        <div className='flex items-center'>
            <button
                type='button'
                onClick={decreaseCount}
                className='flex items-center justify-center text-xl font-bold bg-slate-200 w-8 h-8 rounded-full'>-</button>
            <p className='text-2xl font-bold w-12 text-center px-2'>{field.value || 0}</p>
            <button
                type='button'
                onClick={increaseCount}
                className='text-xl font-bold bg-slate-200 w-8 h-8 rounded-full'>+</button>
        </div>
    </div>
}