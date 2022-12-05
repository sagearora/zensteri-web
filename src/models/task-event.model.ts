import { TaskFragment, TaskModel } from "./task.model"

export type TaskEventModel = {
    id: number;
    created_at: string;
    event_at: string;
    completed_at?: string;
    clinic_user?: {
        id: number;
        name: string;
    }
    task: TaskModel
    completed_tasks?: {[id: string]: {
        id: string;
        completed_at: string;
        content: string;
    }}
}


export const TaskEventFragment = `
    id
    created_at
    event_at
    completed_at
    clinic_user {
        id
        name
    }
    task {
        ${TaskFragment}
    }
    completed_tasks
`
