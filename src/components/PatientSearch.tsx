import { gql, useLazyQuery } from '@apollo/client';
import React, { useEffect, useRef, useState } from 'react';
import { PatientFragment, PatientModel } from '../models/patient.model';
import { useDebounce } from '../lib/use-debounce';

export type PatientSearchProps = {
    onSelect: (patient: PatientModel) => void;
}

const QuerySearchPatients = gql`
query search_patients($query: citext!) {
    patient(where: {_or: [
        {first_name: {_ilike: $query}},
        {last_name: {_ilike: $query}}
    ]}) {
        ${PatientFragment}
    }
}`

export const PatientSearch = ({
    onSelect,
}: PatientSearchProps) => {
    const [text, setText] = useState('');
    const debounced_text = useDebounce(text, 500)
    const input_ref = useRef<HTMLInputElement>(null)
    const [_doSearch, search_result] = useLazyQuery(QuerySearchPatients)
    const doSearch = (query: string) => {
        _doSearch({
            variables: {
                query: `%${query}%`,
            }
        })
    }

    useEffect(() => {
        if (debounced_text.length === 0) {
            return;
        }
        (async () => {
            doSearch(debounced_text)
        })();
    }, [debounced_text])

    const patients = (search_result.data?.patient || []) as PatientModel[]

    const clear = () => {
        setText('');
        if (input_ref.current) {
            input_ref.current.focus();
        }
    }

    const _onSelect = (p: PatientModel) => {
        clear();
        onSelect(p)
    }

    return <div className='relative w-full'>
        <div className='relative'>
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
                ref={input_ref}
                data-hj-allow
                className='shadow appearance-none 
        border rounded w-full py-3 px-3 
        text-gray-700 leading-tight 
        focus:outline-none focus:shadow-outline
        pl-10 pr-10'
                autoComplete='off'
                value={text}
                onChange={e => setText(e.currentTarget.value)}
                id='search'
                placeholder='Search patients' />
            {!!text ? <button onClick={clear} className="flex absolute inset-y-0 right-0 items-center pr-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                </svg>
            </button> : null}

        </div>
        {!!debounced_text ? <div className='absolute w-full mt-1 z-50 bg-white shadow-lg rounded-lg overflow-hidden'>
            {patients.map(patient => <button
                className='block w-full px-4 py-2 hover:bg-slate-200 border-b-2'
                key={patient.id} onClick={() => _onSelect(patient)}>
                    {patient.first_name} {patient.last_name} - {patient.dob}
            </button>)}
        </div> : null}
    </div>
}

