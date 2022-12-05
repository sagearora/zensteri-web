import { Menu, Transition } from '@headlessui/react';
import React, { ChangeEventHandler, forwardRef, Fragment, useState } from 'react';
import { useController } from 'react-hook-form';
import { classNames } from './classNames';

export interface AutocompleteInputProps extends
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    label?: string;
    name: string;
    onInputChange: (text: string) => void;
    control: any;
    disablePadding?: boolean;
    items?: { value: any; label: string }[];
}


const AutocompleteInput = forwardRef<HTMLInputElement, AutocompleteInputProps>(({
    label,
    placeholder,
    type,
    name,
    control,
    className,
    onInputChange,
    disablePadding,
    items = [],
    ...props
}, ref) => {
    const [open, setOpen] = useState(false)
    const {
        field, fieldState
    } = useController({
        control,
        name,
    })

    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        field.onChange(e)
        onInputChange(e.target.value)
    }

    const select = (item: {value: any; label: string;}) => {
        field.onChange(item)
        setOpen(false)
    }

    return (
        <Menu as='div' className='relative w-full inline-block text-left'>{() => (
            <div className={classNames(
                'w-full',
                disablePadding ? '' : 'mb-4'
            )}>
                {label ? <label
                    htmlFor={label}
                    className={classNames(
                        className,
                        "block text-gray-700 text-sm font-bold mb-2",
                        fieldState.error && 'text-red-500'
                    )}>
                    {label}
                </label> : null}
                <input
                    {...props}
                    ref={ref}
                    onBlur={() => setOpen(false)}
                    onFocus={() => setOpen(true)}
                    value={field.value?.label}
                    onChange={onChange}
                    className={classNames(
                        "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
                        fieldState.error && 'border-red-500',
                    )}
                    id={label}
                    type={type}
                    placeholder={placeholder} />
                {fieldState.error && <p className="text-red-500 text-xs italic mt-2">{fieldState.error.message}</p>}

                <Transition
                    show={open && items.length > 0}
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items static className="origin-top absolute left-0 right-0 mt-2 w-56
                    max-h-48 overflow-y-auto rounded-md shadow-lg z-50 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1"></div>
                        {items.map(item => <Menu.Item key={item.value}>{({ active }) => (
                            <button
                                type='button'
                                onClick={() => select(item)}
                                className={classNames(
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'block px-4 py-2 text-sm w-full'
                                )}
                            >
                                {item.label}
                            </button>
                        )}</Menu.Item>)}
                    </Menu.Items>
                </Transition>
            </div >)}
        </Menu>
    )
});

export default AutocompleteInput