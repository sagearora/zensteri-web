import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useNavigate } from 'react-router';
import { LargeInt, PageLimit } from '../../constants';
import BackButton from '../../lib/BackButton';
import { useDialog } from '../../lib/dialog.context';
import SteriCycleForm from './SteriCycleForm';
import { QuerySteriCycleList } from './SteriCycleListScreen';

const MutationInsertSteriCycle = gql`
mutation insert_steri_cycle($object: steri_cycle_insert_input!) {
    insert_steri_cycle_one(object: $object) {
        id
    }
}
`

function SteriCycleStartScreen() {
    const dialog = useDialog();
    const navigate = useNavigate();
    const [executeMutation, status] = useMutation(MutationInsertSteriCycle, {
        refetchQueries: [{
            query: QuerySteriCycleList,
            variables: {
                cursor: LargeInt,
                limit: PageLimit,
            }
        }]
    });

    const onSave = async (cycle: any) => {
        try {
            const r = await executeMutation({
                variables: {
                    object: cycle,
                }
            });
            if (!r.data?.insert_steri_cycle_one?.id) {
                dialog.showError('Failed to create cycle');
                return;
            }
            navigate(`/cycles/${r.data.insert_steri_cycle_one.id}`)
        } catch (e) {
            dialog.showError(e);
        }
    }

    return (
        <div className='my-6 mx-auto container'>
            <div className='flex items-center mb-4'>
                <BackButton href='/cycles' />
                <p className='ml-2 font-bold text-gray-500'>Start a Cycle</p>
                <div className='flex-1' />
            </div>
            <SteriCycleForm
                loading={status.loading}
                onSave={onSave}
            />
        </div >
    )
}

export default SteriCycleStartScreen