import { Switch } from '@headlessui/react'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import Button from '../../lib/Button'
import { useDialog } from '../../lib/dialog.context'
import { SporeTestResult, SteriCycleModel } from '../../models/steri-cycle.model'
import { UserModel } from '../../models/user.model'

export type SporeTestItem = {
    cycle: SteriCycleModel
    user: UserModel;
    updateCycle: (cycle_id: number, v: any) => Promise<boolean>
}

function SporeTestItem({
    cycle,
    user,
    updateCycle,
}: SporeTestItem) {
    const dialog = useDialog();
    const [did_spore_grow_sterilized, setDidSporeGrowSterilized] = useState(false);
    const [did_spore_grow_control, setDidSporeGrowControl] = useState(false);

    const setResult = async () => {
        const result = !!did_spore_grow_control && !did_spore_grow_sterilized;
        if (!result) {
            dialog.showDialog({
                title: 'Failed Test',
                message: 'You are about to mark this as a failed spore test. Please confirm to continue.',
                buttons: [{
                    children: 'Cancel',
                }, {
                    children: 'Confirm',
                    className: 'bg-red-200',
                    onClick: () => update('failed')
                }]
            })
        } else {
            update('passed')
        }
    }

    const update = async (result: SporeTestResult) => {
        if (await updateCycle(cycle.id, {
            spore_test_user_id: user.id,
            spore_test_recorded_at: 'now()',
            spore_test_result: result,
        })) {
            dialog.showToast({
                message: `Succesfully recorded spore test result.`,
                type: 'success'
            })
        }
    }


    return (
        <div className='p-4'>
            <p className='text-sm text-gray-500'>{cycle.steri?.name}</p>
            <p className='text-lg font-bold'>#{cycle.cycle_number}</p>
            <p className='text-sm'>Start: {cycle.start_at ? `${dayjs(cycle.start_at).format('MM/DD/YYYY HH:mm')} - ${cycle.start_user?.name}` : 'Not Started'}</p>
            <p className='text-sm mb-2'>Finish: {cycle.finish_at ? `${dayjs(cycle.finish_at).format('MM/DD/YYYY HH:mm')} - ${cycle.finish_user?.name}` : 'Not finished'}</p>
            <p className='text-md font-bold'>Record Results</p>
            <div className='my-1 py-1 flex items-center'>
                <div className='flex-1'>
                    <p className='text-md'>Did Spore Grow In the Sterilized Vial?</p>
                </div>
                <Switch
                    checked={did_spore_grow_sterilized}
                    onChange={setDidSporeGrowSterilized}
                    className={`${did_spore_grow_sterilized ? 'bg-orange-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                    <span className="sr-only">Spore Growth</span>
                    <span
                        className={`${did_spore_grow_sterilized ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white`}
                    />
                </Switch>
            </div>
            <div className='my-1 py-1 flex items-center'>
                <div className='flex-1'>
                    <p className='text-md'>Did Spore Grow In the Control Vial?</p>
                </div>
                <Switch
                    checked={did_spore_grow_control}
                    onChange={setDidSporeGrowControl}
                    className={`${did_spore_grow_control ? 'bg-orange-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                    <span className="sr-only">Control Growth</span>
                    <span
                        className={`${did_spore_grow_control ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white`}
                    />
                </Switch>
            </div>
            <Button onClick={() => setResult()}>Record Result</Button>
        </div>
    )
}

export default SporeTestItem