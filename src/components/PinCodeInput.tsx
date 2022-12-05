import React, { useState } from 'react'

export type PinCodeInputProps = {
    onTestPin: (pin: string) => void;
    pin?: string
}

function PinCodeInput({
    onTestPin,
    pin,
}: PinCodeInputProps) {
    const [value, setValue] = useState(pin || '')

    const setNumber = (n: number) => {
        if (value.length < 3) {
            setValue(v => `${v}${n}`)
            return;
        }
        onTestPin(`${value}${n}`)
        setValue('')
    }

    return (
        <div className='max-w-sm mx-auto'>
            <div className='flex'>
                {[0, 1, 2, 3].map(idx => <div
                    key={idx}
                    className='w-1/4 p-2'>
                    <div className='border-2
                    h-16
                    flex
                    items-center
                    justify-center rounded-lg
                    text-2xl font-bold
                    text-center'>
                        {value[idx] || ' '}
                    </div>
                </div>)}
            </div>
            <div className='flex flex-wrap justify-center'>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(item => <div className='w-1/3 p-2' key={item}>
                    <button
                    onClick={() => setNumber(item)} className='p-6 bg-slate-200 hover:bg-slate-300 w-full rounded-lg'>{item}</button>
                </div>)}
            </div>
        </div>
    )
}

export default PinCodeInput