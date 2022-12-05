import { Switch } from '@headlessui/react';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import Button from '../../lib/Button';
import { SteriStatus } from '../../models/steri-cycle.model';
import { UserModel } from '../../models/user.model';

export type SteriControllerProps = {
    status: SteriStatus;
    user: UserModel;
    finish_at?: string;
    loading?: boolean;
    updateCycle: (v: any) => void
}

function SteriController({
    status,
    user,
    finish_at,
    updateCycle,
    loading,
}: SteriControllerProps) {
    const [is_cycle_failed, setIsCycleFailed] = useState(false);
    const [notes, setNotes] = useState('');

    const start = async () => {
        return updateCycle({
            start_at: 'now()',
            start_user_id: user.id,
            status: 'running' as SteriStatus,
        });
    }

    const finish = async () => {
        return updateCycle({
            finish_at: 'now()',
            finish_user_id: user.id,
            status: is_cycle_failed ? 'failed' : 'finished' as SteriStatus,
            notes,
        });
    }

    const undoFinish = async () => {
        return updateCycle({
            finish_at: null,
            finish_user_id: null,
            status: 'running' as SteriStatus
        });
    }

    if (status === 'loading') {
        return <div className='bg-slate-100 p-4 rounded-xl shadow-lg mb-8'>
            <Button loading={loading} onClick={() => start()}>Start Cycle</Button>
        </div>
    }

    if (status === 'running') {
        return <div className='bg-slate-100 p-4 rounded-xl shadow-lg mb-8'>
            <p className='text-lg font-bold mb-2'>Finish Cycle</p>
            <div className='my-2 py-2 flex items-center'>
                <div className='flex-1'>
                    <p className='text-md font-bold'>Did the cycle fail?</p>
                </div>
                <Switch
                    checked={is_cycle_failed}
                    onChange={setIsCycleFailed}
                    className={`${is_cycle_failed ? 'bg-orange-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                    <span className="sr-only">Spore Growth</span>
                    <span
                        className={`${is_cycle_failed ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white`}
                    />
                </Switch>
            </div>
            <textarea
                placeholder='(Optional) Type any notes here like cycle failures or other issues...'
                value={notes}
                rows={4}
                onChange={v => setNotes(v.target.value)}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
            <Button loading={loading} onClick={() => finish()}>Finish Cycle</Button>
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

export default SteriController