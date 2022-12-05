import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PatientSearch } from "../../components/PatientSearch";
import { LargeInt, PageLimit } from "../../constants";
import BackButton from "../../lib/BackButton";
import Button from "../../lib/Button";
import { PatientFragment, PatientModel } from "../../models/patient.model";

export const QueryPatientList = gql`
query list_patient($cursor: bigint!, $limit: Int!) { 
    patient(limit: $limit, where: {
        id: {_lt: $cursor}
    } order_by: {id: desc}) {
        ${PatientFragment}
    }
}
`

function PatientListScreen() {
    const navigate = useNavigate();
    const [has_more, setHasMore] = useState(true);
    const {
        loading,
        data,
        fetchMore,
    } = useQuery(QueryPatientList, {
        variables: {
            cursor: LargeInt,
            limit: PageLimit,
        },
        onCompleted: (d) => {
            setHasMore(d.steri_cycle?.length % PageLimit === 0);
        }
    })

    const patients = (data?.patient || []) as PatientModel[];

    const loadMore = () => {
        if (patients.length > 0) {
            fetchMore({
                variables: {
                    cursor: patients[patients.length - 1].id,
                    limit: PageLimit,
                }
            })
        }
    }

    return <div className='my-6 mx-auto container'>
        <div className='flex items-center mb-4'>
            <BackButton href='/' />
            <p className='ml-2 font-bold text-gray-500'>Patients</p>
            <div className='flex-1' />
            <Link
                to='create'
            >+ Add Patient</Link>
        </div>
        <PatientSearch 
            onSelect={p => navigate(`/patients/${p.id}`)}
        />
        {patients.map(patient => <Link
            className="flex items-center border-b-2 p-2 hover:bg-slate-200"
            to={`${patient.id}`}
            key={patient.id}
        >
            <div className='flex-1'>
                <p className={`text-md ${patient.archived_at ? 'line-through text-gray-700' : ''}`}>{patient.first_name} {patient.last_name}</p>
                <p className={`text-sm ${patient.archived_at ? 'line-through text-gray-700' : ''}`}>{patient.dob}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </Link>)}
        {has_more ? <Button
            loading={loading} onClick={loadMore}>Fetch More</Button> : null}

    </div>
}

export default PatientListScreen;
