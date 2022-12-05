import dayjs from 'dayjs'
import React, { useMemo, useState } from 'react'
import Button from '../lib/Button'
import Loading from '../lib/Loading'
import { SteriLabelModel } from '../models/steri-label.model'
import {QRCodeSVG} from 'qrcode.react';
import { createQr } from '../services/qr-service'
import { QRType } from '../constants'

export type SteriLabelProps = {
    item: SteriLabelModel
    remove?: () => void;
    loading?: boolean;
}

function SteriLabel({
    item,
    remove,
    loading,
}: SteriLabelProps) {
    const [more_info, setMoreInfo] = useState(false)

    const color = useMemo(() => {
        if (item.appointment) {
            return 'bg-black text-white'
        }
        if (!item.steri_cycle) {
            return 'bg-slate-100'
        }
        if (item.steri_cycle.status === 'loading') {
            return 'bg-yellow-100'
        }
        if (item.steri_cycle.status === 'running') {
            return 'bg-blue-100'
        }
        if (item.steri_cycle.status === 'failed') {
            return 'bg-red-200'
        }
        if (item.steri_cycle.status === 'finished') {
            return 'bg-green-200'
        }
    }, [item.steri_cycle])

    return (
        <div className={`rounded-xl p-2 relative overflow-hidden ${color}`}>
            {loading && <div className='absolute left-0 top-0 w-full h-full z-10 bg-white/50 flex items-center justify-center'>
                <Loading />
            </div>}
            {remove && <button
                onClick={remove}
                className='absolute text-white right-2 top-2 p-1 rounded-full
                                hover:bg-gray-600 flex items-center justify-center bg-gray-500'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>}
            <div className='flex'>
                <div className='flex-1'>
                    <p className='text-sm'>#{item.id} - {item.steri_item.category}</p>
                    <p className='text-lg font-bold'>{item.steri_item.name}</p>
                    <p className='text-sm font-semibold'>{item.clinic_user.name}</p>
                    <p className='text-sm'>Date: {dayjs(item.created_at).format('YYYY-MM-DD HH:mm')}</p>
                    <p className='text-sm'>Exp: {dayjs(item.expiry_at).format('YYYY-MM-DD HH:mm')}</p>
                </div>
                <QRCodeSVG value={createQr({
                    type: QRType.SteriLabel,
                    id: item.id,
                })} />
            </div>
            {more_info && <>
                {item.steri_cycle_clinic_user && item.steri_cycle && <div className='mt-2'>
                    <p className='text-sm font-semibold'>Sterilization (<span className='capitalize'>{item.steri_cycle.status}</span>)</p>
                    <p className='text-sm'>Cycle: #{item.steri_cycle.cycle_number}</p>
                    <p className='text-sm'>Loaded By: {item.steri_cycle_clinic_user.name}</p>
                    <p className='text-sm'>Loaded When: {dayjs(item.loaded_at).format('YYYY-MM-DD HH:mm')}</p>
                </div>}
                {item.appointment_clinic_user && item.appointment && <div className='mt-2'>
                    <p className='text-sm font-semibold'>Appointment</p>
                    <p className='text-sm'>Patient: {item.appointment.patient.first_name} {item.appointment.patient.last_name}</p>
                    <p className='text-sm'>Checkout By: {item.appointment_clinic_user.name}</p>
                    <p className='text-sm'>Checkout When: {dayjs(item.checkout_at).format('YYYY-MM-DD HH:mm')}</p>
                </div>}
            </>}
            <Button className='bg-white text-gray-800 mt-2' onClick={() => setMoreInfo(v => !v)}>
                <div className='flex items-center'>
                    {!more_info ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
                        <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
                    </svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
                        <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z" clipRule="evenodd" />
                    </svg>} {more_info ? 'Less Info' : 'More Info'}
                </div>
            </Button>
        </div>
    )
}

export default SteriLabel