import { gql, useMutation, useSubscription } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import { PatientSearch } from '../../../components/PatientSearch';
import BackButton from '../../../lib/BackButton';
import Button from '../../../lib/Button';
import { useDialog } from '../../../lib/dialog.context';
import Loading from '../../../lib/Loading';
import NotFoundItem from '../../../lib/NotFoundItem';
import { OpFragment, OpModel } from '../../../models/op.model';
import { PatientModel } from '../../../models/patient.model';

function OpScreen() {
    const dialog = useDialog();
    const op_id = useParams().op_id
    const {
        loading,
        data,
    } = useSubscription(gql`
        subscription($id: bigint!) { 
            op_by_pk(id: $id) {
                ${OpFragment}
            }
        }
    `, {
        variables: {
            id: op_id,
        }
    })

    const [execute, save] = useMutation(gql`
        mutation save($id: bigint!, $set: op_set_input!) {
            update_op_by_pk(
                pk_columns: {id: $id},
                _set: $set,
            ) {
                ${OpFragment}
            }
        }
    `)

    const addPatient = async (patient?: PatientModel) => {
        try {
            await execute({
                variables: {
                    id: op.id,
                    set: {
                        patient_id: patient ? patient.id : null,
                    },
                }
            })
        } catch (e) {
            dialog.showError(e);
        }
    }
    if (loading) {
        return <Loading />
    }
    const op = data?.op_by_pk as OpModel;
    if (!op) {
        return <NotFoundItem title="Sorry op not found." />
    }
    return (
        <div className='my-6 mx-auto container'>
            <BackButton href='/ops' />
            <div className='mt-2 mb-4 border-b-2'>
                <p className='text-sm text-gray-500'>Operatory</p>
                <p className='font-bold'>{op.name}</p>
            </div>
            {save.loading ? <Loading /> : <div className=''>
                {op.patient
                    ? <div className=''>
                        <div className='flex items-center bg-green-100 rounded-xl px-4 py-2'>
                            <div className='flex-1'>
                                <p className='text-sm text-gray-500'>Current Patient</p>
                                <p className='text-lg font-bold'>{op.patient.first_name} {op.patient.last_name}</p>
                            </div>
                            <div>
                                <Button
                                    className='w-fit'
                                    onClick={() => addPatient()}>Clear</Button>
                            </div>
                        </div>
                    </div>
                    : <div>
                        <p className='text-sm text-gray-500 mb-2'>Select patient for room</p>
                        <PatientSearch
                            onSelect={addPatient}
                        />
                    </div>}
            </div>}
        </div>
    )
}

export default OpScreen