import { gql, useSubscription } from '@apollo/client'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { classNames } from '../../lib/form/classNames'
import Loading from '../../lib/Loading'
import { TaskEventFragment, TaskEventModel } from '../../models/task-event.model'
import TaskModal from './TaskModal'

const SubscriptionTasks = gql`
    subscription task_events_for_day($start: date!, $end: date!) {
        task_event(where: {_and:[
            {event_at: {_gte: $start}},
            {event_at: {_lt: $end}}
        ]}) {
            ${TaskEventFragment}
        }
    }
`

function TasksWidget() {
    const [date, setDate] = useState(dayjs().startOf('d').toDate().toUTCString())
    const [show_task, setShowTask] = useState<number>()

    const { loading, data } = useSubscription(SubscriptionTasks, {
        variables: {
            start: date,
            end: dayjs(date).add(1, 'day').toISOString(),
        }
    })

    const setToToday = () => {
        setDate(dayjs().startOf('d').toDate().toUTCString())
    }

    const goPrevDay = () => {
        setDate(d => dayjs(d).subtract(1, 'd').toDate().toUTCString())
    }

    const goNextDay = () => {
        setDate(d => dayjs(d).add(1, 'd').toDate().toUTCString())
    }

    const task_events = (data?.task_event || []) as TaskEventModel[]

    return (
        <div className='border-b-2 py-6'>
            <div className="flex items-center py-4">
                <button onClick={goPrevDay} className="p-2 mx-2 bg-slate-200 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                        className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <div className="flex-1 flex justify-center items-center">
                    <p className='text-md font-bold'>Tasks: {dayjs(date).format('ddd, MMM D')}</p>
                    <button
                        onClick={setToToday}
                        className="px-2 py-1 mx-2  bg-slate-200 rounded-xl">Today</button>
                </div>
                <button onClick={goNextDay} className="p-2 mx-2  bg-slate-200 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                        className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
            {loading && <Loading />}
            {show_task && <TaskModal
                task_event_id={show_task}
                onClose={() => setShowTask(undefined)}
            />}
            {task_events.map((task_event, idx) => <button
                onClick={() => setShowTask(task_event.id)}
                key={task_event.id} className={classNames('flex w-full text-left items-center py-2', idx !== task_events.length - 1 && 'border-b-2')}>
                <span className={classNames('font-bold mr-2', task_event.completed_at && 'text-green-500')}>
                    {task_event.completed_at ? <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                            <g fill="currentColor" fillRule="nonzero">
                                <path d="M18.25 3A2.75 2.75 0 0121 5.75v12.5A2.75 2.75 0 0118.25 21H5.75A2.75 2.75 0 013 18.25V5.75A2.75 2.75 0 015.75 3h12.5zm0 1.5H5.75c-.69 0-1.25.56-1.25 1.25v12.5c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V5.75c0-.69-.56-1.25-1.25-1.25zM10 14.44l6.47-6.47a.75.75 0 011.133.976l-.073.084-7 7a.75.75 0 01-.976.073l-.084-.073-3-3a.75.75 0 01.976-1.133l.084.073L10 14.44l6.47-6.47L10 14.44z"></path>
                            </g>
                        </g>
                    </svg> :
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                                <g fill="#212121" fillRule="nonzero">
                                    <path d="M5.75 3h12.5A2.75 2.75 0 0121 5.75v12.5A2.75 2.75 0 0118.25 21H5.75A2.75 2.75 0 013 18.25V5.75A2.75 2.75 0 015.75 3zm0 1.5c-.69 0-1.25.56-1.25 1.25v12.5c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V5.75c0-.69-.56-1.25-1.25-1.25H5.75z"></path>
                                </g>
                            </g>
                        </svg>}
                </span>
                <div className='flex-1'>
                    <p className={classNames(task_event.completed_at && 'line-through text-green-500', 'text-lg')}>{task_event.task.title}</p>
                    {task_event.completed_at && <p className={'text-sm text-slate-500'}>{task_event.clinic_user?.name} @ {
                        dayjs(task_event.completed_at).format('DD/MM/YYYY h:mm a')}</p>}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>)}

        </div>
    )
}

export default TasksWidget