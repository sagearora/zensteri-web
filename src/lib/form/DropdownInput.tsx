import { Menu, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

export type DropdownInputProps = {
    items: {
        label: string;
        value: string | number;
    }[];
    placeholder?: string;
    label: string;
    error?: string;
    selected?: { value: string | number; label: string };
    onSelect: (v: {
        label: string;
        value: string | number;
    }) => void;
}


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export const DropdownInput = ({
    items,
    label,
    placeholder,
    error,
    selected,
    onSelect,
}: DropdownInputProps) => {

    return <div className="mb-4">

        <label
            htmlFor={label}
            className={[
                "block text-gray-700 text-sm font-bold mb-2",
                error && 'text-red-500'
            ].join(' ')}>
            {label}
        </label>
        <Menu as="div" className="relative w-full inline-block text-left">{({ open }) => (
            <>
                <Menu.Button
                    type='button'
                    className={classNames(
                        "w-full bg-white shadow appearance-none border rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline",
                        error ? 'text-red-500 border-red-500' : 'text-gray-700'
                    )}>
                    {selected?.label || placeholder || 'Make a selection'}
                </Menu.Button>
                <Transition
                    show={open}
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="origin-top absolute left-0 right-0 mt-2 w-56 rounded-md shadow-lg z-50 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1"></div>
                        {items.map(item => <Menu.Item key={item.value}>{({ active }) => (
                            <button
                                type='button'
                                onClick={() => onSelect(item)}
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
                {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
            </>)}

        </Menu>
    </div>
}