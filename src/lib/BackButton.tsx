import React from 'react';
import { Link } from 'react-router-dom';

type BackButtonProps = {
    href?: string;
}

function BackButton({
    href
}: BackButtonProps) {
    return (
        <Link to={href||'..'} className='p-1 pr-2 w-fit flex items-center bg-slate-200 hover:bg-slate-300 rounded-md text-sm font-semibold'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
        </Link>
    )
}

export default BackButton