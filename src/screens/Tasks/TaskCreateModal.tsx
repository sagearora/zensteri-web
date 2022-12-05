import { gql, useMutation } from "@apollo/client";
import React, { ReactNode, useState } from "react";
import { useDialog } from "../../lib/dialog.context";
import { TaskFragment, TaskModel } from "../../models/task.model";
import { useClinic } from "../../services/clinic.context";
import TaskForm from "./TaskForm";

export type TaskCreateModalProps = {
    onCreate: (task: TaskModel) => void;
    children: (show: () => void) => ReactNode;
}

function TaskCreateModal({
    onCreate,
    children,
}: TaskCreateModalProps) {
    const [show, setShow] = useState(false);
    const { clinic } = useClinic();
    const dialog = useDialog();
    const [execute, insert_status] = useMutation(gql`
        mutation create($object: task_insert_input!) {
            insert_task_one(
                object: $object,
            ) {
                ${TaskFragment}
            }
        }
    `)

    const onSave = async (v: any) => {
        try {
            const { data } = await execute({
                variables: {
                    object: {
                        ...v,
                        clinic_id: clinic.id,
                    }
                }
            })
            if (data?.insert_task_one) {
                onCreate(data.insert_task_one)
                return true;
            }
        } catch (e) {
            dialog.showError(e);
            return false;
        }
    }

    return (
        <>
        <TaskForm
            show={show}
            loading={insert_status.loading}
            onClose={() => setShow(false)}
            onSave={onSave}
        />
        {children(() => setShow(true))}
        </>
    )
}

export default TaskCreateModal;
