import { gql, useMutation, useSubscription } from '@apollo/client';
import React from 'react';
import { useDialog } from '../../lib/dialog.context';
import Loading from '../../lib/Loading';
import { SteriCycleFragment, SteriCycleModel } from '../../models/steri-cycle.model';
import { useUser } from '../../services/user.context';
import SporeTestItem from './SporeTestItem';

const SubCheckedOut = gql`
  subscription checked_out {
    steri_cycle(where: {
      _and: [
        {finish_at: {_is_null: false}},
        {is_spore_test_enabled: {_eq: true}},
        {spore_test_recorded_at: {_is_null: true}}
      ]
    }) {
      ${SteriCycleFragment}
    }
  }
`;


const MutationUpdateSteriCycle = gql`
    mutation update_steri_cycle($id: bigint!, $set: steri_cycle_set_input!) {
        update_steri_cycle_by_pk(pk_columns: {id: $id}, _set: $set) {
            ${SteriCycleFragment}
        }
    }
`;

function SporeTest() {
  const dialog = useDialog()
  const { user } = useUser();
  const {
    data,
    loading,
  } = useSubscription(SubCheckedOut)
  const [executeMutation] = useMutation(MutationUpdateSteriCycle)
  const items = (data?.steri_cycle || []) as SteriCycleModel[]

  const updateCycle = async (cycle_id: number, v: any) => {
    try {
      await executeMutation({
        variables: {
          id: cycle_id,
          set: v,
        }
      });
      return true;
    } catch (e) {
      dialog.showError(e);
      return false
    }
  }

  if (items.length === 0) {
    return null;
  }


  return (
    <div className='py-6 border-t-2'>
      <p className='text-md font-semibold text-center mb-2'>Pending Spore Tests</p>
      {loading && <Loading />}
      {items.map(cycle => <SporeTestItem
        user={user}
        key={cycle.id}
        updateCycle={updateCycle}
        cycle={cycle} />)}
    </div>
  )
}

export default SporeTest