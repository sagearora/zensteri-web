import { gql, useMutation, useQuery } from '@apollo/client';
import { arrayMoveImmutable } from 'array-move';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { rrulestr } from 'rrule';
import BackButton from '../../lib/BackButton';
import Button from '../../lib/Button';
import { useDialog } from '../../lib/dialog.context';
import { classNames } from '../../lib/form/classNames';
import Loading from '../../lib/Loading';
import NotFoundItem from '../../lib/NotFoundItem';
import { TaskFragment, TaskModel } from '../../models/task.model';
import TaskForm from './TaskForm';
import TaskItemForm from './TaskItemForm';

const QueryTask = gql`
  query task($id: bigint!) {
    task_by_pk(id: $id) {
      ${TaskFragment}
    }
  }
`;

const MutationUpdateTask = gql`
  mutation update_task($id: bigint!, $set: task_set_input!) {
    update_task_by_pk(pk_columns: {id: $id}, _set: $set) {
      ${TaskFragment}
    }
  }
`;

const MutationDuplicateTask = gql`
  mutation duplicate_task($object: task_insert_input!) {
    insert_task_one(object: $object) {
      id
    }
  }
`


function TaskEditScreen() {
  const task_id = +(useParams().task_id as string)
  const dialog = useDialog();
  const navigate = useNavigate()
  const [show_add, setShowAdd] = useState(false)
  const [show_edit_item, setShowEditItem] = useState(-1)
  const [show_edit, setShowEdit] = useState(false)
  const [update_task, update_status] = useMutation(MutationUpdateTask)
  const [duplicateTask, duplicate_status] = useMutation(MutationDuplicateTask)
  const { data, loading } = useQuery(QueryTask, {
    variables: {
      id: task_id,
    }
  })

  if (loading) {
    return <Loading />
  }

  const task = data?.task_by_pk as TaskModel;

  if (!task) {
    return <NotFoundItem title='Task not found' />
  }

  const updateTask = async (set: any) => {
    try {
      const { data } = await update_task({
        variables: {
          id: task_id,
          set,
        }
      })
      return data?.update_task_by_pk as TaskModel
    } catch (e) {
      dialog.showError(e)
    }
  }

  const onSave = async (v: { id: string; content: string }, idx = -1) => {
    const items = idx > -1 ? (task.items || []).map((item, i) => idx === i ? v : item) : [...(task.items || []), v]
    if (await updateTask({
      items,
    })) {
      setShowEditItem(-1)
      return true;
    }
    return false;
  }

  const deleteItem = async (idx: string) => {
    const items = (task.items || []).filter((item) => item.id !== idx)
    if (await updateTask({
      items,
    })) {
      dialog.showToast({
        message: 'Deleted checklist item'
      })
    }
  }

  const move = async (id: string, direction: 'up' | 'down') => {
    const idx = (task.items || []).findIndex(item => item.id === id)
    if (idx === 0 && direction === 'up') {
      return;
    }
    if (idx === (task.items || []).length - 1 && direction === 'down') {
      return;
    }
    const items = arrayMoveImmutable(task.items || [], idx, idx + (direction === 'up' ? -1 : 1))
    return updateTask({
      items,
    })
  }

  const duplicate = async () => {
    try {
      const { data } = await duplicateTask({
        variables: {
          object: {
            clinic_id: task.clinic_id,
            title: task.title,
            is_recurring: task.is_recurring,
            rrule: task.rrule,
            start_at: task.start_at,
            end_at: task.end_at,
            items: task.items,
          }
        }
      })
      const task_id = data?.insert_task_one?.id;
      if (task_id) {
        dialog.showToast({ message: 'Duplicated task' })
        navigate(`/tasks/${task_id}/edit`, { replace: true })
      }
    } catch (e) {
      dialog.showError(e)
    }
  }

  const deleteTask = () => {
    dialog.showDialog({
      title: 'Are you sure?',
      message: 'This will delete all future events for this task.',
      buttons: [{
        children: 'Cancel',
      }, {
        children: 'Delete',
        className: 'bg-red-200',
        onClick: () => {
          updateTask({ deleted_at: 'now()' })
          navigate('/tasks')
        }
      }]
    })
  }

  return (
    <div className='my-6 mx-auto container'>
      <BackButton href='/tasks' />
      <div className='mb-4 flex items-start'>
        <div className='flex-1'>
          <p className='font-bold text-gray-500'>{task.title}</p>
          <p className='text-gray-500'>{dayjs(task.start_at).format('M/D/YYYY')} - {dayjs(task.end_at).format('M/D/YYYY')}</p>
          <p className='text-md text-gray-500'>{task.rrule ? `Repeats: ${rrulestr(task.rrule).toText()}` : dayjs(task.start_at).format('DD/MM/YYYY')}</p>
        </div>
        <Button className='w-fit mr-2' onClick={() => setShowEdit(true)}>Edit</Button>
        <Button className='w-fit mr-2' loading={duplicate_status.loading} onClick={duplicate}>Duplicate</Button>
        <Button className='w-fit bg-red-200' loading={update_status.loading} onClick={deleteTask}>Delete</Button>
        {!!task && <TaskForm
          show={show_edit}
          onClose={() => setShowEdit(false)}
          task={task}
          onSave={(set) => {
            updateTask(set)
            setShowEdit(false)
          }}
          loading={update_status.loading}
        />}
      </div>
      <div className=''>
        {(task.items || []).map((item, idx) => <div key={idx} className='border-b-2 py-1 my-2'>
          {idx === show_edit_item ? <TaskItemForm
            loading={update_status.loading}
            item={item}
            dismiss={() => setShowEditItem(-1)}
            onSave={v => onSave(v, idx)}
          /> : <div className='items-center flex'>
            <button onClick={() => deleteItem(item.id)} className='font-bold mr-2 p-2 rounded-full bg-red-200'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
            <button onClick={() => setShowEditItem(idx)} className='font-bold mr-2 p-2 rounded-full bg-slate-200'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>
            <p className='text-lg flex-1'>
              {item.content}
            </p>
            <button disabled={idx === 0} onClick={() => move(item.id, 'up')}
              className={classNames(
                idx === 0 && 'cursor-none text-slate-400',
                'font-bold mr-2 p-2 rounded-full bg-slate-200')}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button disabled={idx === (task.items || []).length - 1} onClick={() => move(item.id, 'down')}
              className={classNames(
                idx === (task.items || []).length - 1 && 'cursor-none text-slate-400',
                'font-bold mr-2 p-2 rounded-full bg-slate-200')}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>}
        </div>)}

        {!show_add && <Button
          className='w-fit text-md p-1' onClick={() => setShowAdd(true)}>+ Add Checklist Item</Button>}
        {show_add && <TaskItemForm
          loading={update_status.loading}
          onSave={onSave}
          dismiss={() => setShowAdd(false)}
        />}
      </div>
    </div>
  )
}

export default TaskEditScreen