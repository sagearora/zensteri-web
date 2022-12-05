import { gql, useMutation, useSubscription } from '@apollo/client';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { PatientSearch } from '../../components/PatientSearch';
import { PageLimit } from '../../constants';
import { useDialog } from '../../lib/dialog.context';
import Loading from '../../lib/Loading';
import NotFoundItem from '../../lib/NotFoundItem';
import { AppointmentFragment, AppointmentModel } from '../../models/appointment.model';
import { PatientModel } from '../../models/patient.model';
import { QueryAppointmentsByDate } from '../../queries';
import AddPatientModal from './AddPatientModal';


const MutationInsertAppointment = gql`
    mutation insert_appt($object: appointment_insert_input!) {
        insert_appointment_one(object: $object, on_conflict: {
            constraint: appointment_patient_id_schedule_date_key,
            update_columns: [deleted_at]
        }) {
            ${AppointmentFragment}
        }
    }
`

export type AppointmentListProps = {
    onSelect: (appt?: AppointmentModel) => void;
    date: string;
    selected?: AppointmentModel;
}

function AppointmentList({
    onSelect,
    date,
    selected,
}: AppointmentListProps) {
    const dialog = useDialog();
    const [create_patient, setCreatePatient] = useState(false);
    const {
        loading,
        data,
    } = useSubscription(QueryAppointmentsByDate({ sub: true }), {
        variables: {
            date,
            cursor: 0,
            limit: PageLimit,
        },
    })
    const [insertAppt, insert_status] = useMutation(MutationInsertAppointment)

    const appointments = (data?.appointment || []) as AppointmentModel[];

    const insertAppointment = async (p: PatientModel) => {
        try {
            const { id: patient_id } = p;
            const { data } = await insertAppt({
                variables: {
                    object: {
                        patient_id,
                        schedule_date: date,
                        deleted_at: null,
                    }
                }
            })
            if (data?.insert_appointment_one) {
                onSelect(data.insert_appointment_one)
            }
        } catch (e) {
            dialog.showError(e)
        }
    }

    const onCreatePatient = async (patient: PatientModel) => {
        setCreatePatient(false);
        return insertAppointment(patient);
    }

    const remove = async (appt: AppointmentModel) => {
        try {
            await insertAppt({
                variables: {
                    object: {
                        patient_id: appt.patient_id,
                        schedule_date: appt.schedule_date,
                        deleted_at: 'now()',
                    }
                }
            })
            onSelect(undefined)
        } catch (e) {
            dialog.showError(e)
        }
    }

    return (
        <div>
            <AddPatientModal
                onClose={() => setCreatePatient(false)}
                onCreate={onCreatePatient}
                show={create_patient}
            />
            <div className='flex items-center'>
                <div className='flex-1'>
                    <PatientSearch onSelect={insertAppointment} />
                </div>
                <button onClick={() => setCreatePatient(true)} className='ml-2 hover:bg-slate-100 p-1 rounded-full'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            {loading && <Loading />}
            {
                !loading && appointments.length === 0 && <NotFoundItem
                    title='No upcoming appointments'
                    noBack
                />
            }
            <div className='py-2'>
                {appointments.map(appt => <div
                    key={appt.id}
                    className='flex my-2 items-center'>
                    <div className='flex-1'>
                        <button
                            onClick={() => onSelect(appt)}
                            className={`p-2 rounded-xl w-full ${selected?.id === appt.id ? 'bg-green-100 hover:bg-green-200' : 'bg-slate-100 hover:bg-slate-100'}`}>
                            <p>{appt.patient.first_name} {appt.patient.last_name}</p>
                        </button>
                    </div>
                    <button disabled={insert_status.loading} className='p-2 ml-2 rounded-full hover:bg-red-200 bg-red-100 text-red-500' onClick={() => remove(appt)}>
                        {insert_status.loading ? <svg
                            className='w-4 h-4 animate-spin'
                            fill="currentColor"
                            viewBox="0 0 1792 1792"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M1760 896q0 176-68.5 336t-184 275.5-275.5 184-336 68.5-336-68.5-275.5-184-184-275.5-68.5-336q0-213 97-398.5t265-305.5 374-151v228q-221 45-366.5 221t-145.5 406q0 130 51 248.5t136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5q0-230-145.5-406t-366.5-221v-228q206 31 374 151t265 305.5 97 398.5z" />
                        </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3}
                            stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>}
                    </button>
                </div>
                )}
            </div>
        </div >
    )
}

export default AppointmentList