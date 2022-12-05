import { useQuery } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import BackButton from "../../../lib/BackButton";
import { SteriModel } from "../../../models/steri.model";
import { QuerySteriList } from "../../../queries";


function SteriListScreen() {
    const {
        loading,
        data,
    } = useQuery(QuerySteriList())

    const steris = (data?.steri || []) as SteriModel[];

    return <div className='my-6 mx-auto container'>
        <div className='flex items-center mb-4'>
            <BackButton href='/settings' />
            <p className='ml-2 font-bold text-gray-500'>Sterilizers</p>
            <div className='flex-1' />
            <Link
                to='create'
            >+ Add Sterilizer</Link>
        </div>
        {steris.map(steri => <Link
            className="flex items-center border-b-2 p-2 hover:bg-slate-200"
            to={`${steri.id}/edit`}
            key={steri.id}
        >
            <p className={`flex-1 ${steri.archived_at ? 'line-through text-gray-700' : ''}`}>{steri.name} - {steri.serial}</p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </Link>)}

    </div>
}

export default SteriListScreen;
