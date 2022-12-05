import { gql, useQuery } from '@apollo/client'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import SteriLabel from './SteriLabel'
import Loading from '../lib/Loading'
import NotFoundItem from '../lib/NotFoundItem'
import { SteriLabelFragment, SteriLabelModel } from '../models/steri-label.model'


export const QueryPatientSteriLabel = gql`
query list_patient_steri_label(
    $patient_id: bigint!,
    $start_date: timestamptz!, 
    $end_date: timestamptz!, 
) { 
    steri_label(
        where: {
            _and: [
                {appointment: {
                    patient_id: {_eq: $patient_id}},
                },
                {created_at: {_gte: $start_date}},
                {created_at: {_lt: $end_date}}
            ]
        },
        order_by: {id: desc}) {
        ${SteriLabelFragment}
    }
}
`

export type PatientSteriHistoryProps = {
    patient_id: number;
}

function PatientSteriHistory({
    patient_id,
}: PatientSteriHistoryProps) {
    const [date, setDate] = useState(new Date())
    const {
        data,
        loading,
    } = useQuery(QueryPatientSteriLabel, {
        variables: {
            patient_id,
            start_date: dayjs(date).subtract(1, 'month').toISOString(),
            end_date: date.toISOString(),
        }
    })

    const items = (data?.steri_label || []) as SteriLabelModel[]

    return (
        <div className="">
            <p className="text-sm font-semibold text-gray-800">Steri History</p>
            {loading && <Loading />}
            <div className='grid grid-cols-2 gap-4 mt-4'>
                {items.map((item) => <SteriLabel
                    key={item.id}
                    item={item} />)}
            </div>
            {items.length === 0 && !loading && <NotFoundItem
                title='No steri items used'
                noBack
            />}
        </div>
    )
}

export default PatientSteriHistory