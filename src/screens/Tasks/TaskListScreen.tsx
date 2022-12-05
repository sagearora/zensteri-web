import { useSubscription } from "@apollo/client";
import dayjs from "dayjs";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { rrulestr } from "rrule";
import { PageLimit } from "../../constants";
import BackButton from "../../lib/BackButton";
import Button from "../../lib/Button";
import { TaskModel } from "../../models/task.model";
import { QueryTaskList } from "../../queries";
import TaskCreateModal from "./TaskCreateModal";


function SteriListScreen() {
    const navigate = useNavigate();
    const {
        loading,
        data,
    } = useSubscription(QueryTaskList({ sub: true }), {
        variables: {
            limit: PageLimit,
            cursor: 0,
        }
    })

    const onCreateTask = async (task: TaskModel) => {
        navigate(`/tasks/${task.id}/edit`)
    }

    const tasks = (data?.task || []) as TaskModel[];

    return <div className='my-6 mx-auto container'>
        <div className='flex items-center mb-4'>
            <BackButton href='/' />
            <p className='ml-2 font-bold text-gray-500'>Tasks</p>
            <div className='flex-1' />
            <TaskCreateModal
                onCreate={onCreateTask}
            >{(show) => <Button
                className='w-fit'
                onClick={show}
            >+ Add Task</Button>}</TaskCreateModal>
        </div>
        {tasks.map(task => <Link
            className="flex items-start bg-slate-100 hover:bg-slate-200 my-2 rounded-lg p-4"
            to={`${task.id}/edit`}
            key={task.id}
        >
            <div className="flex-1">
                <p className="text-md font-bold">{task.title}</p>
                <p className='text-xs text-gray-500'>{task.rrule ? `Repeats: ${rrulestr(task.rrule).toText()}` : dayjs(task.start_at).format('DD/MM/YYYY')}</p>
                {task.items && task.items.length > 0 && <div className='mt-2'>
                    {task.items.map((item, idx) => <div className="text-xs ml-2" key={idx}>
                        {item.content}
                    </div>)}
                </div>}
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </Link>)}

    </div>
}

export default SteriListScreen;
