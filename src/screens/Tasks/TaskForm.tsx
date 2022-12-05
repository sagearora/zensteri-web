import { Dialog, Transition } from '@headlessui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import dayjs from 'dayjs'
import React, { Fragment } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from "yup"
import Button from '../../lib/Button'
import DateInput from '../../lib/form/DateInput'
import SwitchInput from '../../lib/form/SwitchInput'
import TextInput from '../../lib/form/TextInput'
import { TaskModel } from '../../models/task.model'

export type TaskFormProps = {
    show?: boolean;
    task?: TaskModel;
    loading?: boolean;
    onClose: () => void;
    onSave: (v: {
        title: string;
        is_recurring: boolean;
        rrule?: string;
        start_at: string;
        end_at: string;
    }) => void;
}

const schema = yup.object({
    title: yup.string().required('Please enter a task title'),
    is_recurring: yup.boolean().required(),
    rrule: yup.string().when('is_recurring', {
        is: true,
        then: yup.string().required('Please enter a recurrence rule')
    }),
    start_at: yup.date().when('is_recurring', {
        is: false,
        then: yup.date().required('Please select the event date')
    }),
    end_at: yup.date().when('is_recurring', {
        is: true,
        then: yup.date().required('Please select an end date for this event')
    })
}).required();

type TaskFields = {
    title: string;
    is_recurring: boolean;
    rrule?: string;
    start_at?: Date;
    end_at?: Date;
}

function TaskForm({
    show,
    task,
    loading,
    onClose,
    onSave,
}: TaskFormProps) {
    const { control, handleSubmit, watch } = useForm<TaskFields>({
        resolver: yupResolver(schema),
        defaultValues: {
            title: task?.title || '',
            is_recurring: task?.is_recurring || true,
            rrule: task?.rrule || '',
            start_at: task ? dayjs(task.start_at).toDate()
                : dayjs().startOf('day').toDate(),
            end_at: task ? dayjs(task.end_at).toDate()
                : dayjs().startOf('day').add(1, 'month').toDate(),
        }
    })
    const is_recurring = watch('is_recurring')

    const onSubmit: SubmitHandler<TaskFields> = async (data) => {
        return onSave({
            title: data.title,
            rrule: data.rrule,
            is_recurring: data.is_recurring,
            start_at: data.is_recurring ? new Date().toISOString() : (data.start_at as Date).toISOString(),
            end_at: data.is_recurring ? (data.end_at as Date).toISOString() : (data.start_at as Date).toISOString(),
        })
    }

    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto"
                onClose={onClose}>
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="relative inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <Dialog.Title as="h3" className="flex items-center text-lg px-4 pt-3 pb-2 w-full font-medium text-gray-900 border-b-2">
                                <div className='flex-1'>Add Task</div>
                                <button autoFocus={false} className='text-lg text-gray-800'
                                    onClick={onClose}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </Dialog.Title>
                            <div className="px-4 pt-5 pb-4">

                                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                                    <TextInput
                                        label='Task title (e.g. Open Room 1)'
                                        control={control}
                                        name='title'
                                    />
                                    <SwitchInput
                                        control={control}
                                        name='is_recurring'
                                        label='This task is repeating'
                                    />
                                    {!is_recurring && <DateInput
                                        label='Select a Date for this task'
                                        control={control}
                                        name='start_at'
                                    />}
                                    {is_recurring &&
                                        <>
                                            <TextInput
                                                control={control}
                                                name='rrule'
                                                label='Recurrence Rule'
                                            />
                                            <DateInput
                                                label='Ends On'
                                                control={control}
                                                name='end_at'
                                            />
                                        </>}
                                    <Button loading={loading} type='submit'>Save Task</Button>
                                </form>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default TaskForm