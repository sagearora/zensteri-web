import { gql, useMutation, useSubscription } from '@apollo/client';
import React, { useState } from 'react';
import { QRType } from '../../constants';
import Button from '../../lib/Button';
import { useDialog } from '../../lib/dialog.context';
import NotFoundItem from '../../lib/NotFoundItem';
import { SteriItemFragment, SteriItemModel } from '../../models/steri-item.model';
import { SteriLabelFragment, SteriLabelModel } from '../../models/steri-label.model';
import useScanner from '../../services/use-scanner';
import { useUser } from '../../services/user.context';

const SubCheckedOut = gql`
  subscription checked_out {
    steri_item(where: {total_checked_out: {_gt: 0}}) {
      ${SteriItemFragment}
    }
  }
`;


const MutationUpdateSteriLabel = gql`
    mutation update_steri_label($id: bigint!, $set: steri_label_set_input!) {
        update_steri_label_by_pk(pk_columns: {id: $id}, _set: $set) {
            ${SteriLabelFragment}
        }
    }
`;

function CheckedOut() {
  const dialog = useDialog()
  const { user } = useUser();
  const [scanning, setScanning] = useState(false);

  const {
    data,
    loading,
  } = useSubscription(SubCheckedOut)
  const [updateLabel] = useMutation(MutationUpdateSteriLabel)

  const items = (data?.steri_item || []) as SteriItemModel[]
  const onScan = async (data: {
    type: QRType;
    id: number;
  }) => {
    if (!user) {
      return;
    }
    if (data?.type === QRType.SteriLabel) {
      const { id } = data;
      // add this label to the load.
      try {
        // const { data: steri_label_data } = await apollo.query({
        //   query: gql`query steri_label($id: bigint!) {
        //             steri_label_by_pk(id: $id) {
        //                 id
        //                 steri_item_id
        //                 appointment_id
        //                 steri_cycle_id
        //                 checkin_at
        //             }
        //         }`,
        //   variables: {
        //     id,
        //   },
        //   fetchPolicy: 'network-only'
        // })
        // const steri_label = steri_label_data?.steri_label_by_pk;
        // if (!steri_label) {
        //   dialog.showSimpleDialog('Invalid Label', 'Sorry this item could not be found. You will have to re-sterilize this package.')
        //   return;
        // }
        // if (steri_label.appointment_id) {
        //   dialog.showSimpleDialog('Used for Patient', `This item has already been checked out for a patient. Cannot check back in.`)
        //   return;
        // }
        // if (steri_label.steri_cycle_id) {
        //   dialog.showSimpleDialog('Already Sterilized', `This item has already been sterilized. It can be safely put away.`)
        //   return;
        // }
        // if (steri_label.checkin_at) {
        //   dialog.showSimpleDialog('Already checked in', `This item has already been checked in.`)
        //   return;
        // }
        const { data } = await updateLabel({
          variables: {
            id,
            set: {
              checkin_user_id: user.id,
              checkin_at: 'now()'
            }
          }
        })
        const item = data?.update_steri_label_by_pk as SteriLabelModel;
        if (!item) {
          dialog.showToast({
            message: `Failed to check-in item`,
            type: 'error',
          });
          return;
        }
        dialog.showToast({
          message: `Checked-in ${item.steri_item.name}. Please add to sterilizer as soon as possible.`,
          type: "success",
        });
      } catch (e) {
        dialog.showError(e)
      }
    }
  }

  useScanner({
    is_scanning: scanning,
    onScan: onScan
  })

  return (
    <div className='py-6 border-t-2'>
      <p className='text-md font-semibold text-center mb-2'>What's checked out?</p>
      <div className='grid grid-cols-4 gap-2'>
        {items.map(item => <div key={item.id} className='border-slate-400 border-2 rounded-xl flex flex-col items-center p-4'>
          <p className='text-2xl font-bold'>{item.total_checked_out}{item.total_checked_in?.total_records && `(+${item.total_checked_in.total_records})`}/{item.total_count}</p>
          <p className='text-lg font-semibold'>{item.name}</p>
          <p className='text-sm text-gray-800'>{item.category}</p>
        </div>)}
      </div>
      {items.length > 0 ? <div className='py-2'>
        {!scanning ? <Button className={`bg-green-200`} onClick={() => setScanning(true)}>
          <div className='flex items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
            </svg>
            Sterilizer Is Full? Check-In Items
          </div>
        </Button> : <div className='flex flex-col items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
          </svg>
          <h2 className='text-md font-semibold'>Use the handheld scanner to check-in items waiting to be sterilized.</h2>
          <Button onClick={() => setScanning(false)}>End Scanning</Button>
        </div>}
      </div> : <NotFoundItem
        icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-green-500 w-12 h-12">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
        }
        title='Everything is checked in.'
        noBack
      />}
    </div>
  )
}

export default CheckedOut