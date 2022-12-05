import dayjs from "dayjs";
import React, { useState } from "react";
import { AppointmentModel } from "../../models/appointment.model";
import AppointmentItemScanner from "./AppointmentItemScanner";
import AppointmentList from "./AppointmentList";

function CheckoutScreen() {
    const [date, setDate] = useState(dayjs().startOf('d').toDate().toUTCString())
    const [selected_appt, setSelectedAppt] = useState<AppointmentModel | undefined>()

    const onSelect = (appt?: AppointmentModel) => {
        setSelectedAppt(appt)
    }

    const setToToday = () => {
        setDate(dayjs().startOf('d').toDate().toUTCString())
    }

    const goPrevDay = () => {
        setDate(d => dayjs(d).subtract(1, 'd').toDate().toUTCString())
    }

    const goNextDay = () => {
        setDate(d => dayjs(d).add(1, 'd').toDate().toUTCString())
    }


    return <div className='h-full flex item-stretch overflow-hidden'>
        <div className='w-1/3 border-r-2 shadow-lg px-4 overflow-y-auto'>
            <div className="flex items-center py-4">
                <button onClick={goPrevDay} className="p-2 mx-2 bg-slate-200 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                    className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <div className="flex-1 flex justify-center items-center">
                    <p className='text-md font-bold'>{dayjs(date).format('MMM DD, YYYY')}</p>
                    <button
                        onClick={setToToday}
                        className="px-2 py-1 mx-2  bg-slate-200 rounded-xl">Today</button>
                </div>
                <button onClick={goNextDay} className="p-2 mx-2  bg-slate-200 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                    className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
            <AppointmentList date={date} onSelect={onSelect} selected={selected_appt} />
        </div>
        <div className='flex-1 p-4 relative overflow-y-auto'>
            <p className='text-md font-bold mb-2'>{selected_appt ? `${selected_appt.patient.first_name} (${selected_appt.id})` : 'Pick an appointment'}</p>
            {selected_appt ? <AppointmentItemScanner
                appointment_id={selected_appt.id}
                patient_name={selected_appt.patient.first_name}
            /> : null}
        </div>
    </div>
}

export default CheckoutScreen;
