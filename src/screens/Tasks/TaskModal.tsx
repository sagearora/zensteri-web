import { gql, useMutation, useQuery } from '@apollo/client'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import Confetti from 'react-confetti'
import Button from '../../lib/Button'
import { useDialog } from '../../lib/dialog.context'
import { classNames } from '../../lib/form/classNames'
import Loading from '../../lib/Loading'
import Modal from '../../lib/Modal'
import { TaskEventFragment, TaskEventModel } from '../../models/task-event.model'
import { useUser } from '../../services/user.context'

export type TaskModalProps = {
    task_event_id: number;
    onClose: () => void;
}

const QueryTask = gql`
  query task_event_by_pk($id: bigint!) {
    task_event_by_pk(id: $id) {
      ${TaskEventFragment}
    }
  }
`;

const MutationUpdateTaskEvent = gql`
    mutation update_task_event($id: bigint!, $set: task_event_set_input!) {
        update_task_event_by_pk(pk_columns: {id: $id}, _set: $set) {
            ${TaskEventFragment}
        }
    }
`;

function TaskModal({
    task_event_id,
    onClose,
}: TaskModalProps) {
    const { user } = useUser();
    const dialog = useDialog()
    const { data, loading: loading_task } = useQuery(QueryTask, {
        variables: {
            id: task_event_id,
        }
    })
    const task_event = data?.task_event_by_pk as TaskEventModel;

    const [loading, setLoading] = useState<{ [id: string]: boolean }>({})
    const [updateTaskEvent] = useMutation(MutationUpdateTaskEvent)
    const [show_confetti, setShowConfetti] = useState(false)
    const completed_tasks = task_event?.completed_tasks || {};

    const toggle = async (item: { id: string; content: string; }) => {
        try {
            setLoading(l => ({
                ...l,
                [item.id]: true,
            }))

            const _completed_tasks = {
                ...completed_tasks,
                [item.id]: completed_tasks[item.id] ? false : {
                    id: item.id,
                    content: item.content,
                    completed_at: new Date().toISOString(),
                }
            }
            const all_complete_keys = Object.keys(_completed_tasks).filter(key => _completed_tasks[key])

            const is_task_complete = (task_event.task.items || []).findIndex(i => all_complete_keys.indexOf(i.id) === -1) === -1
            if (is_task_complete) {
                setShowConfetti(true)
            }
            const { data } = await updateTaskEvent({
                variables: {
                    id: task_event.id,
                    set: {
                        completed_user_id: user.id,
                        completed_tasks: _completed_tasks,
                        completed_at: is_task_complete ? 'now()' : null,
                    }
                }
            })
        } catch (e) {
            dialog.showError(e)
        } finally {
            setLoading(l => ({
                ...l,
                [item.id]: false,
            }))
        }
    }


    return (
        <Modal show={true} onClose={onClose}>
            {loading_task && <Loading />}
            {task_event && <div>
                {show_confetti && <Confetti recycle={false} numberOfPieces={500} />}
                <div className='py-2 px-4 border-b-2'>
                    <p className={classNames(
                        task_event.completed_at && 'text-green-500',
                        'text-lg font-semibold flex items-center')}>
                        {task_event.completed_at && <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className='mr-2'
                        >
                            <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="2">
                                <g fill="currentColor" fillRule="nonzero">
                                    <path d="M18.25 3A2.75 2.75 0 0121 5.75v12.5A2.75 2.75 0 0118.25 21H5.75A2.75 2.75 0 013 18.25V5.75A2.75 2.75 0 015.75 3h12.5zm0 1.5H5.75c-.69 0-1.25.56-1.25 1.25v12.5c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V5.75c0-.69-.56-1.25-1.25-1.25zM10 14.44l6.47-6.47a.75.75 0 011.133.976l-.073.084-7 7a.75.75 0 01-.976.073l-.084-.073-3-3a.75.75 0 01.976-1.133l.084.073L10 14.44l6.47-6.47L10 14.44z"></path>
                                </g>
                            </g>
                        </svg>} {task_event.task.title}</p>
                    {task_event.completed_at && <p className='text-sm text-slate-500'>Completed by: {task_event.clinic_user?.name} @ {dayjs(task_event.completed_at).format('MM/DD/YYYY h:mm a')}</p>}
                </div>
                <div className='p-4'>
                    {(task_event.task.items || [])
                        .map((item, idx) => <button onClick={() => toggle(item)} className='flex w-full text-left items-start py-2 border-b-2' key={idx}>
                            {loading[item.id] ? <svg
                                className='w-6 h-6 mr-2 animate-spin'
                                fill="currentColor"
                                viewBox="0 0 1792 1792"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M1760 896q0 176-68.5 336t-184 275.5-275.5 184-336 68.5-336-68.5-275.5-184-184-275.5-68.5-336q0-213 97-398.5t265-305.5 374-151v228q-221 45-366.5 221t-145.5 406q0 130 51 248.5t136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5q0-230-145.5-406t-366.5-221v-228q206 31 374 151t265 305.5 97 398.5z" />
                            </svg> : <span className='font-bold mr-2'>
                                {completed_tasks[item.id] ? <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                >
                                    <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                                        <g fill="#212121" fillRule="nonzero">
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
                            </span>}
                            <p className={classNames(completed_tasks[item.id] && 'line-through', 'text-lg')}>{item.content}</p>
                        </button>)}
                    <Button onClick={onClose} className='mt-2'>Close</Button>
                </div>
            </div>}
        </Modal>
    )
}

export default TaskModal