import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import dayjs from 'dayjs';
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom';
import SteriLabel from '../../components/SteriLabel';
import { QRType } from '../../constants';
import BackButton from '../../lib/BackButton';
import Button from '../../lib/Button';
import { useDialog } from '../../lib/dialog.context';
import { classNames } from '../../lib/form/classNames';
import Loading from '../../lib/Loading';
import NotFoundItem from '../../lib/NotFoundItem';
import { CountFragment, CountModel } from '../../models/count.model';
import { SteriItemModel } from '../../models/steri-item.model';
import { SteriLabelFragment, SteriLabelModel } from '../../models/steri-label.model';
import { QueryAllSteriItems } from '../../queries';
import useScanner from '../../services/use-scanner';
import { useUser } from '../../services/user.context'
import CountController from './CountController';
import { useCountFixer } from './use-count-fixer';

const SubscriptionCount = gql`
  subscription count($id: bigint!) {
    count_by_pk(id: $id){
      ${CountFragment}
    }
  }
`;

const InsertCountSteriLabel = gql`
  mutation insert_count_steri_label($object: count_steri_label_insert_input!) {
    insert_count_steri_label_one(object: $object, on_conflict: {
      constraint: count_steri_label_pkey,
      update_columns: [clinic_user_id]
    }) {
      id
      steri_label {
        ${SteriLabelFragment}
      }
    }
  }
`

const MutationUpdateCount = gql`
  mutation update_count($id: bigint!, $set: count_set_input!) {
    update_count_by_pk(pk_columns: {id: $id}, _set: $set) {
      ${CountFragment}
    }
  }
`;

function CountScreen() {
  const count_id = +(useParams().count_id as string);
  const dialog = useDialog();
  const {
    user,
  } = useUser();
  const {
    data: steri_item_data,
  } = useQuery(QueryAllSteriItems({}))
  const {
    data,
    loading,
    error,
  } = useSubscription(SubscriptionCount, {
    variables: {
      id: count_id
    }
  })
  const { fixCount } = useCountFixer()

  const [updateCount, update_status] = useMutation(MutationUpdateCount)
  const [insertLabel] = useMutation(InsertCountSteriLabel)

  const count = data?.count_by_pk as CountModel;
  const steri_items = (steri_item_data?.steri_item || []) as SteriItemModel[];


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
        const { data } = await insertLabel({
          variables: {
            object: {
              count_id,
              steri_label_id: id,
              clinic_user_id: user.id,
            },
          }
        })
        const item = data?.insert_count_steri_label_one as {
          id: number;
          steri_label: SteriLabelModel;
        }
        if (!item) {
          dialog.showToast({
            message: `Failed to add item`,
            type: 'error',
          });
          return;
        }
        dialog.showToast({
          message: `Add ${item.steri_label.steri_item.name} to count`,
          type: "success",
        });
      } catch (e) {
        dialog.showError(e)
      }
    }
  }

  useScanner({
    is_scanning: true,
    onScan: onScan
  })

  const [categories, total_count] = useMemo(() => {
    if (!count?.steri_item_tally) {
      return [{}, 0]
    }
    const item_tally = count.steri_item_tally.reduce((o, item) => ({
      ...o,
      [item.steri_item_id]: item.total,
    }), {} as { [id: number]: number })

    const total_count = Object.keys(item_tally).reduce((total, item_id) => total += item_tally[+item_id], 0);
    const categories = steri_items
      .reduce((all, item) => ({
        ...all,
        [item.category.toLowerCase()]: {
          name: item.category,
          items: all[item.category.toLowerCase()] ? [
            ...all[item.category.toLowerCase()].items,
            {
              ...item,
              total: item_tally[item.id],
            },
          ] : [{
            ...item,
            total: item_tally[item.id],
          }],
        }
      }), {} as {
        [id: string]: {
          name: string;
          items: {
            id: number;
            name: string;
            total: number;
            total_count: number;
          }[]
        }
      })
    return [categories, total_count];
  }, [steri_items, count?.steri_item_tally])

  const update = async (data: any) => {
    try {
      await updateCount({
        variables: {
          id: count_id,
          set: data,
        }
      })
    } catch (e) {
      dialog.showError(e)
    }
  }

  const adminFixCount = () => {
    if (!user.is_admin) {
      return;
    }
    dialog.showDialog({
      title: 'Update All Count',
      message: 'Warning, this will update all counts to match the total number of counted items. This cannot be undone',
      buttons: [{
        children: 'Cancel',
      }, {
        children: 'Confirm',
        className: 'bg-red-200',
        onClick: async () => {
          await fixCount(count)
          dialog.showToast({ message: 'Count updated', type: 'success' })
        }
      }]
    })
  }

  const isCycleFailed = () => {
    return Object.keys(categories)
      .findIndex(id => {
        return categories[id].items.findIndex(item => item.total_count > item.total) > -1
      }) > -1
  }

  if (error) {
    return <>{JSON.stringify(error)}</>
  }

  if (loading) {
    return <Loading />
  }

  if (!count) {
    return <NotFoundItem title='Sorry, this count was not found' />
  }

  return (
    <div className='my-6 mx-auto container'>
      <BackButton href='/counts' />
      <div className='mt-2 flex items-start border-b-2 pb-2'>
        <div className='flex-1'>
          <p className='text-sm text-gray-500'>Count ID: {count.id}</p>
          <p className='font-bold'>By: {count.clinic_user.name}</p>
          <p className='text-sm'>Start: {dayjs(count.created_at).format('MM/DD/YYYY HH:mm')}</p>
          <p className='text-sm'>Finish: {count.finish_at ? dayjs(count.finish_at).format('MM/DD/YYYY HH:mm') : 'Not finished'}</p>
        </div>
        {user.is_admin && <div className=''><Button
          onClick={adminFixCount} className='bg-red-200 w-fit'>Match Counts</Button></div>}
      </div>
      <div className='py-4 flex flex-col items-center'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
        </svg>
        {count.steri_labels && count.steri_labels.length > 0 && <>
          <p className='text-5xl font-bold text-green-600'>{total_count} Items</p>
          <p className='text-lg'>Last Added: <span className='font-bold text-green-600'>
            {count.steri_labels[0]?.steri_label.steri_item.name}</span> {dayjs(count.steri_labels[0]?.created_at).fromNow()}</p>
        </>}
        <h2 className='text-md font-semibold text-gray-600'>Use the handheld scanner to scan all items that you are counting.</h2>
      </div>
      <CountController
        finish_at={count.finish_at}
        status={count.status}
        updateCount={update}
        loading={update_status.loading}
        isCountFailed={isCycleFailed}
      />
      <div className='py-4'>
        {Object.keys(categories).map(category => <div
          key={category}
          className='p-2 bg-slate-100 mb-2 rounded-xl'>
          <p className='uppercase font-semibold text-sm'>{category}</p>
          {categories[category].items.map(item => <div key={item.id}
            className={classNames('flex text-lg py-1 border-b-2', item.total < item.total_count ? 'bg-red-100' : 'bg-green-100')}>
            <p className='flex-1'>{item.name}</p>
            <p className='font-bold'>{item.total}/{item.total_count}</p>
          </div>)}
        </div>)}
      </div>
      <div className='py-4'>
        <p className='text-lg font-semibold'>Scanned Contents</p>
        <div className='grid grid-cols-2 gap-4 mt-4'>
          {(count.steri_labels || []).map((item) => <SteriLabel
            item={item.steri_label}
            // loading={loading_label[item.id]}
            key={item.id} />)
          }
        </div>
      </div>
    </div>
  )
}

export default CountScreen