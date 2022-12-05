import dayjs from 'dayjs';
import React, { useState } from 'react';
import Button from '../../lib/Button';
import { CountStatus } from '../../models/count.model';

export type CountControllerProps = {
    status: CountStatus;
    finish_at?: string;
    loading?: boolean;
    updateCount: (v: any) => void
    isCountFailed: () => boolean;
}

function CountController({
    status,
    finish_at,
    updateCount,
    loading,
    isCountFailed,
}: CountControllerProps) {
    const [notes, setNotes] = useState('');

    const finish = async () => {
        return updateCount({
            finish_at: 'now()',
            status: isCountFailed() ? 'failed' : 'finished' as CountStatus,
            notes,
        });
    }

    const undoFinish = async () => {
        return updateCount({
            finish_at: null,
            status: 'counting' as CountStatus
        });
    }

    if (status === 'counting') {
        return <div className='bg-slate-100 p-4 rounded-xl shadow-lg mb-8'>
            <p className='text-lg font-bold mb-2'>Finish Count</p>
            <textarea
                placeholder='(Optional) Type any notes here like cycle failures or other issues...'
                value={notes}
                rows={4}
                onChange={v => setNotes(v.target.value)}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
            <Button loading={loading} onClick={() => finish()}>Finish Count</Button>
            {isCountFailed() ? <p className='my-2 text-red-500'>This count has missing items</p> : <p className='my-2 text-green-500'>This count has no missing items.</p>}
        </div>
    }

    return <div>
        <p className={`text-lg font-bold ${status === 'failed' ? 'bg-red-500' : 'bg-green-600'} text-white px-2 w-fit rounded-lg mb-1`}>{
            status === 'failed' ? 'Failed' : 'Passed'} {dayjs(finish_at).format('YYYY-MM-DD HH:mm')}</p>
        {+new Date() - +new Date(finish_at || '') < 24 * 60 * 60 * 1000 ? <div>
            <p className='text-sm text-red-500 mb-2'>Made an error in recording your results?
                Change results up to 24 hours after finishing the cycle.</p>
            <Button
                onClick={undoFinish}
            >Change Results</Button>
        </div> : null}
    </div>

    // return (
    // <div>
    //     {!cycle.start_at || !cycle.finish_at ?
    //         <div className='mb-4 bg-green-100 p-4 shadow-md rounded-md'>
    //             <p className='text-center text-xl font-semibold'>
    //                 {!cycle.start_at ? 'Are you ready to Start?' : 'Are you ready to finish?'}
    //             </p>
    //             {!user ? null : <>
    //                 {!cycle.start_at ? <Button
    //                     onClick={start}
    //                 >Start Cycle</Button> : <>
    //                     <div className='my-2 border-b-2 py-2 flex items-center'>
    //                         <div className='flex-1'>
    //                             <p className='text-md font-bold'>Did the cycle fail?</p>
    //                         </div>
    //                         <Switch
    //                             checked={is_cycle_failed}
    //                             onChange={setIsCycleFailed}
    //                             className={`${is_cycle_failed ? 'bg-orange-600' : 'bg-gray-200'
    //                                 } relative inline-flex h-6 w-11 items-center rounded-full`}
    //                         >
    //                             <span className="sr-only">Spore Growth</span>
    //                             <span
    //                                 className={`${is_cycle_failed ? 'translate-x-6' : 'translate-x-1'
    //                                     } inline-block h-4 w-4 transform rounded-full bg-white`}
    //                             />
    //                         </Switch>
    //                     </div>
    //                     <textarea
    //                         placeholder='(Optional) Type any notes here like cycle failures or other issues...'
    //                         value={notes}
    //                         rows={4}
    //                         onChange={v => setNotes(v.target.value)}
    //                         className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
    //                     />
    //                     <Button
    //                         color='orange'
    //                         fullWidth
    //                         onClick={finish}
    //                         loading={status.loading}
    //                         label='Finish Cycle' />
    //                 </>}
    //             </>}
    //         </div> : null
    //     }
    // </div>
    // )
}

export default CountController