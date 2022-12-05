import dayjs from 'dayjs';
import React from "react";
import { Link } from 'react-router-dom';
import { SteriCycleModel } from "../../models/steri-cycle.model";

export type SteriCycleItemProps = {
    cycle: SteriCycleModel
}

export const SteriCycleListItem = ({ cycle }: SteriCycleItemProps) => {
    return <Link className={`flex items-center my-2 p-2 rounded-xl ${!cycle.finish_at ? 'bg-orange-100 hover:bg-orange-300' : cycle.status === 'failed' ? 'bg-red-100 hover:bg-red-200' : 'bg-green-100 hover:bg-green-200'}`} to={`/cycles/${cycle.id}`}>
        <div className='flex-1'>
            <p className='text-sm font-semibold'>{cycle.steri?.name} {cycle.steri?.serial}</p>
            <p className='text-lg font-bold'>Cycle #{cycle.cycle_number}</p>
            {cycle.finish_at ? <p className={`text-lg font-bold ${cycle.status === 'failed' ? 'bg-red-500' : 'bg-green-600'} text-white px-2 w-fit rounded-lg mt-1`}>{
                cycle.status === 'failed' ? 'Failed' : 'Passed'} {dayjs(cycle.finish_at).format('YYYY-MM-DD HH:mm')}</p> : <p
                    className='text-white bg-orange-500 px-2 w-fit rounded-lg mt-1'>
                {cycle.status}</p>}
        </div>
        {cycle.is_spore_test_enabled && <div className={!cycle.spore_test_recorded_at ? 'text-orange-600' : cycle.spore_test_result === 'passed' ? 'text-red-500' : 'text-red-500'}>
            {!cycle.spore_test_recorded_at ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
            </svg>
                : cycle.spore_test_result === 'passed' ?
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    </svg>}
        </div>}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    </Link>
}
