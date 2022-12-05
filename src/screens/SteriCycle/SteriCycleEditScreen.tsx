import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import BackButton from '../../lib/BackButton';
import Loading from '../../lib/Loading';
import { SteriCycleFragment, SteriCycleModel } from '../../models/steri-cycle.model';
import { useDialog } from '../../lib/dialog.context';
import SteriCycleForm from './SteriCycleForm';

const QuerySteriCycleByPk = gql`
    query steri_cycle($id: bigint!) {
        steri_cycle_by_pk(id: $id) {
            ${SteriCycleFragment}
        }
    }
`;

function SteriCycleEditScreen() {
    const dialog = useDialog();
    const cycle_id = useParams().cycle_id;
    const navigate = useNavigate();
    const {
        data,
        loading,
    } = useQuery(QuerySteriCycleByPk, {
        variables: {
            id: cycle_id,
        }
    })
    const [executeMutation, status] = useMutation(gql`
        mutation update_steri_cycle(
            $id: bigint!, 
            $set: steri_cycle_set_input!
        ) {
            update_steri_cycle_by_pk(
                pk_columns: {id: $id}, 
                _set: $set
            ) {
                ${SteriCycleFragment}
            }
        }
    `);


    if (loading) {
        return <Loading />
    }

    const cycle = data?.steri_cycle_by_pk as SteriCycleModel;

    if (!cycle) {
        return <p>Sorry cycle not found.</p>
    }

    const onSave = async (set: any) => {
        try {
            const r = await executeMutation({
                variables: {
                    id: cycle.id,
                    set: set,
                }
            });
            navigate(`/cycles/${cycle.id}`)
        } catch (e) {
            dialog.showError(e);
        }
    }

    return (
        <div className='my-6 mx-auto container'>
            <BackButton href={`/cycles/${cycle.id}`} />
            <div className='mt-2 flex items-center mb-4'>
                <div className='flex-1'>
                    <p className='text-gray-500'>Edit Cycle</p>
                    <p className='font-bold'>{cycle.id} - {cycle.steri?.name}</p>
                </div>
            </div>
            <SteriCycleForm
                cycle={cycle}
                loading={status.loading}
                onSave={onSave}
            />
        </div >
    )
}

export default SteriCycleEditScreen